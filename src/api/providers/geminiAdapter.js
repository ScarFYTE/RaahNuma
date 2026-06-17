/**
 * geminiAdapter.js
 * Provider: Google Gemini (Free Tier via Google AI Studio)
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const GEMINI_DEFAULT_MODEL = 'gemini-1.5-flash'

const SYSTEM_PROMPT = `You are RaahNuma, an AI navigation assistant for Pakistani undergraduate scholarship seekers. Analyze the user's financial and academic situation and return ONLY a valid JSON object.

CRITICAL LANGUAGE REQUIREMENTS: Use only conditional, non-deterministic phrasing. NEVER use words like "qualify", "approved", "guaranteed", "eligible", or "will receive". Use phrases like "may be eligible", "matches baseline criteria", "potentially aligns with", "appears to meet thresholds", "could potentially apply".

Focus on Pakistani programs (HEC, PEEF, Ehsaas, BEEF, DEEF), consider income thresholds, domicile requirements, and university type (public/private). Maximum 3 items per array.`

// Gemini's native JSON Schema enforcement
const JSON_SCHEMA = {
  type: "object",
  properties: {
    preliminaryAssessment: {
      type: "array",
      items: {
        type: "object",
        properties: {
          programName: { type: "string" },
          matchLevel: { type: "string" },
          matchReason: { type: "string" },
          officialLink: { type: "string" }
        },
        required: ["programName", "matchLevel", "matchReason", "officialLink"]
      }
    },
    jargonBuster: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term: { type: "string" },
          plainEnglishExplanation: { type: "string" }
        },
        required: ["term", "plainEnglishExplanation"]
      }
    },
    documentChecklist: {
      type: "array",
      items: {
        type: "object",
        properties: {
          documentName: { type: "string" },
          reason: { type: "string" }
        },
        required: ["documentName", "reason"]
      }
    }
  },
  required: ["preliminaryAssessment", "jargonBuster", "documentChecklist"]
}

export const geminiAdapter = {
  async submitQuery(queryText) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error(
        '[geminiAdapter] VITE_GEMINI_API_KEY not found. ' +
        'Set it in your .env file.'
      )
    }

    const model = import.meta.env.VITE_GEMINI_MODEL || GEMINI_DEFAULT_MODEL
    const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [{
            role: "user",
            parts: [{ text: queryText }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: JSON_SCHEMA,
            temperature: 0.3
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`[geminiAdapter] API error: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!rawText) {
        throw new Error('[geminiAdapter] Empty response from API')
      }

      // Gemini guarantees the format matches the schema exactly
      const parsed = JSON.parse(rawText)

      return {
        ...parsed,
        responsible_ai_notice:
          'This is a navigational assessment only. Verify directly with official program authorities before applying.',
      }
    } catch (error) {
      console.error("[geminiAdapter] Caught Error:", error)
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