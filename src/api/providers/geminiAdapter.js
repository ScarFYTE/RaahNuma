/**
 * geminiAdapter.js
 * ─────────────────
 * Google Gemini provider for RaahNuma Phase 3.
 *
 * Responsibilities:
 *  - Map multi-turn conversation history to Gemini `contents` payload
 *  - Enforce JSON schema contract via `responseSchema`
 *  - Inject hardcoded RAG knowledge base + anti-markdown guardrails in SYSTEM_PROMPT
 *  - Sanitize parsed JSON string values as a defensive fallback against markdown leakage
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const GEMINI_DEFAULT_MODEL = 'gemini-2.0-flash'

/**
 * System prompt — encodes responsible-AI guardrails, English-only constraint,
 * hardcoded knowledge base (Level 5 mini-RAG), and strict plain-text JSON rules.
 */
const SYSTEM_PROMPT = `You are RaahNuma, an expert AI financial aid advisor for Pakistani undergraduate students. Analyze the user's situation and return a highly actionable, strategic JSON object.

LANGUAGE CONSTRAINT:
Assume all user inputs are in English. Generate all responses, advice, and JSON keys exclusively in English.

CURRENT KNOWLEDGE BASE (AUTHORITATIVE — DO NOT CONTRADICT OR HALLUCINATE):
Rule 1: The HEC Need-Based Scholarship income threshold for private university students is generally 50,000 PKR/month.
Rule 2: The PEEF Scholarship strictly requires a Punjab domicile.
Rule 3: The Ehsaas Undergraduate program is heavily restricted to public sector universities, not private institutions.

When the user provides financial details across multiple turns, remember and cross-reference ALL prior data (income, domicile, university type, program) before scoring programs.

CRITICAL RESPONSIBLE AI GUARDRAILS:
1. NEVER use deterministic words like "qualify", "approved", or "guaranteed". Use "highly likely", "matches baseline", or "potential fit".
2. NEVER invent exact due dates. Only provide general historical timelines (e.g., "Usually opens in Fall", "Typically announced in August").
3. If the user sends a low-context greeting (e.g., "Hi", "Hello"), return an EMPTY preliminaryAssessment array and populate strategicAdvice with a warm welcome asking for their financial details (income, domicile, university, program).

Focus heavily on Pakistani programs (HEC Need-Based, PEEF, Ehsaas, provincial endowments). Provide specific, tailored advice based on their university and region.

STRICT JSON FORMATTING RULE — NO MARKDOWN INSIDE JSON VALUES:
ALL STRING VALUES IN YOUR JSON RESPONSE MUST BE RAW, UNFORMATTED PLAIN TEXT ONLY.
DO NOT USE MARKDOWN SYNTAX INSIDE ANY JSON STRING VALUE.
NO ASTERISKS FOR BOLD (**text**).
NO ASTERISKS FOR ITALICS (*text*).
NO BULLET POINTS USING HYPHENS OR DASHES (- item).
NO NUMBERED LISTS INSIDE STRING VALUES.
NO BACKTICKS, NO HEADINGS, NO LINK MARKDOWN.
WRITE COMPLETE SENTENCES IN PLAIN TEXT ONLY.`

/** Gemini responseSchema — mirrors the frontend ScholarshipResponse contract. */
const JSON_SCHEMA = {
  type: 'object',
  properties: {
    preliminaryAssessment: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          programName: { type: 'string' },
          confidenceScore: { type: 'integer', description: '0 to 100 based on data match' },
          matchReason: { type: 'string' },
          applicationTimeline: {
            type: 'string',
            description: 'General historical window, no exact dates',
          },
          officialLink: { type: 'string' },
        },
        required: [
          'programName',
          'confidenceScore',
          'matchReason',
          'applicationTimeline',
          'officialLink',
        ],
      },
    },
    strategicAdvice: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string', description: 'e.g., Strategy, Deadlines, Campus Tips' },
          advice: { type: 'string' },
        },
        required: ['category', 'advice'],
      },
    },
    jargonBuster: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          term: { type: 'string' },
          plainEnglishExplanation: { type: 'string' },
        },
        required: ['term', 'plainEnglishExplanation'],
      },
    },
    documentChecklist: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          documentName: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['documentName', 'reason'],
      },
    },
  },
  required: ['preliminaryAssessment', 'strategicAdvice', 'jargonBuster', 'documentChecklist'],
}

/**
 * @typedef {{ role: 'user' | 'model', text: string }} ConversationTurn
 */

/**
 * Maps RaahNuma conversation history to Gemini's alternating user/model `contents` array.
 * The current user message is appended as the final turn.
 *
 * @param {ConversationTurn[]} conversationHistory - Prior turns only (excludes current message)
 * @param {string} queryText - The latest user message
 * @returns {Array<{ role: string, parts: Array<{ text: string }> }>}
 */
const buildGeminiContents = (conversationHistory = [], queryText = '') => {
  const contents = []

  // Replay prior turns so Gemini retains financial context from earlier messages
  for (const turn of conversationHistory) {
    if (!turn?.text?.trim()) continue

    contents.push({
      role: turn.role === 'model' ? 'model' : 'user',
      parts: [{ text: turn.text }],
    })
  }

  // Append the live user query as the final turn
  if (queryText?.trim()) {
    contents.push({
      role: 'user',
      parts: [{ text: queryText }],
    })
  }

  return contents
}

/**
 * Recursively strips common markdown artifacts from all string values in a parsed JSON object.
 * Defensive fallback — the SYSTEM_PROMPT should prevent leakage, but this avoids frontend crashes.
 *
 * @param {unknown} value
 * @returns {unknown}
 */
const stripMarkdownFromJsonValues = (value) => {
  if (typeof value === 'string') {
    return value
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim()
  }

  if (Array.isArray(value)) {
    return value.map(stripMarkdownFromJsonValues)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, stripMarkdownFromJsonValues(nested)]),
    )
  }

  return value
}

/**
 * Safely parses Gemini JSON output and sanitizes string values.
 *
 * @param {string} rawText
 * @returns {object}
 */
const parseAndSanitizeResponse = (rawText) => {
  const parsed = JSON.parse(rawText)
  return stripMarkdownFromJsonValues(parsed)
}

export const geminiAdapter = {
  /**
   * Submits a scholarship query with full conversation memory.
   *
   * @param {string} queryText - Current user message
   * @param {ConversationTurn[]} [conversationHistory=[]] - Prior user/model turns
   * @returns {Promise<object>}
   */
  async submitQuery(queryText, conversationHistory = [], options = {}) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error(
        '[geminiAdapter] VITE_GEMINI_API_KEY not found. Set it in your .env file.',
      )
    }

    const model = import.meta.env.VITE_GEMINI_MODEL || GEMINI_DEFAULT_MODEL
    const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`
    const contents = buildGeminiContents(conversationHistory, queryText)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: options.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: JSON_SCHEMA,
            temperature: 0.3,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `[geminiAdapter] API error: ${response.status} - ${errorData.error?.message || response.statusText}`,
        )
      }

      const data = await response.json()
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!rawText) {
        throw new Error('[geminiAdapter] Empty response from API')
      }

      const parsed = parseAndSanitizeResponse(rawText)

      return {
        ...parsed,
        responsible_ai_notice:
          'This is a navigational assessment only. Verify directly with official program authorities before applying.',
      }
    } catch (error) {
      console.error('[geminiAdapter] Caught Error:', error)
      throw error
    }
  },

  async healthCheck() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) return false

    try {
      const url = `${GEMINI_API_URL}/${GEMINI_DEFAULT_MODEL}?key=${apiKey}`
      const response = await fetch(url)
      return response.ok
    } catch {
      return false
    }
  },
}
