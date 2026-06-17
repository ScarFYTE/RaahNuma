const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const GEMINI_DEFAULT_MODEL = 'gemini-3.5-flash' 

const SYSTEM_PROMPT = `You are RaahNuma, an expert AI financial aid advisor for Pakistani undergraduate students. Analyze the user's situation and return a highly actionable, strategic JSON object.

CRITICAL RESPONSIBLE AI GUARDRAILS:
1. NEVER use deterministic words like "qualify", "approved", or "guaranteed". Use "highly likely", "matches baseline", or "potential fit".
2. NEVER invent exact due dates. Only provide general historical timelines (e.g., "Usually opens in Fall", "Typically announced in August").

Focus heavily on Pakistani programs (HEC Need-Based, PEEF, Ehsaas, provincial endowments). Provide specific, tailored advice based on their university and region.`

const JSON_SCHEMA = {
  type: "object",
  properties: {
    preliminaryAssessment: {
      type: "array",
      items: {
        type: "object",
        properties: {
          programName: { type: "string" },
          confidenceScore: { type: "integer", description: "0 to 100 based on data match" },
          matchReason: { type: "string" },
          applicationTimeline: { type: "string", description: "General historical window, no exact dates" },
          officialLink: { type: "string" }
        },
        required: ["programName", "confidenceScore", "matchReason", "applicationTimeline", "officialLink"]
      }
    },
    strategicAdvice: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string", description: "e.g., Strategy, Deadlines, Campus Tips" },
          advice: { type: "string" }
        },
        required: ["category", "advice"]
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
  required: ["preliminaryAssessment", "strategicAdvice", "jargonBuster", "documentChecklist"]
}

// ... Keep the rest of the submitQuery function exactly the same ...

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