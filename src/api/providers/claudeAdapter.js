const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const CLAUDE_DEFAULT_MODEL = 'claude-sonnet-4-6'

const SYSTEM_PROMPT = `You are RaahNuma, an AI navigation assistant for Pakistani undergraduate scholarship seekers. Analyze the user's financial and academic situation and return ONLY a valid, minified JSON object with zero markdown formatting.

CRITICAL LANGUAGE REQUIREMENTS: Use only conditional, non-deterministic phrasing. NEVER use words like "qualify", "approved", "guaranteed", "eligible", or "will receive". Use phrases like "may be eligible", "matches baseline criteria", "potentially aligns with", "appears to meet thresholds", "could potentially apply".

Return only this JSON structure (no other text):
{"preliminaryAssessment":[{"programName":"string","matchLevel":"High|Medium|Low","matchReason":"string using conditional language","officialLink":"https://"}],"jargonBuster":[{"term":"string","plainEnglishExplanation":"string"}],"documentChecklist":[{"documentName":"string","reason":"string"}]}

Focus on Pakistani programs (HEC, PEEF, Ehsaas, BEEF, DEEF), consider income thresholds, domicile requirements, and university type (public/private). Maximum 3 items per array.`

const extractJson = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No valid JSON object found in response')
  return jsonMatch[0]
}

const validateSchema = (data) => {
  if (!data.preliminaryAssessment || !Array.isArray(data.preliminaryAssessment)) {
    throw new Error('Invalid response: missing preliminaryAssessment array')
  }
  if (!data.jargonBuster || !Array.isArray(data.jargonBuster)) {
    throw new Error('Invalid response: missing jargonBuster array')
  }
  if (!data.documentChecklist || !Array.isArray(data.documentChecklist)) {
    throw new Error('Invalid response: missing documentChecklist array')
  }
}

export const claudeAdapter = {
  async submitQuery(queryText) {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
    if (!apiKey) {
      throw new Error(
        '[claudeAdapter] VITE_CLAUDE_API_KEY not found. ' +
        'Set it in your .env file or use VITE_AI_PROVIDER=mock.'
      )
    }

    const model = import.meta.env.VITE_CLAUDE_MODEL || CLAUDE_DEFAULT_MODEL

    try {
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: queryText }],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `[claudeAdapter] API error: ${response.status} ${response.statusText}` +
          (errorData.error?.message ? ` - ${errorData.error.message}` : '')
        )
      }

      const data = await response.json()
      const rawText = data.content?.[0]?.text

      if (!rawText) {
        throw new Error('[claudeAdapter] Empty response from API')
      }

      const cleanJson = extractJson(rawText)
      const parsed = JSON.parse(cleanJson)
      validateSchema(parsed)

      return {
        ...parsed,
        responsible_ai_notice:
          'This is a navigational assessment only. Verify directly with official program authorities before applying.',
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('[claudeAdapter] Failed to parse API response as JSON')
      }
      throw error
    }
  },

  async healthCheck() {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
    if (!apiKey) return false

    try {
      const response = await fetch(`${CLAUDE_API_URL.replace(/\/messages$/, '/models')}`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      })
      return response.ok
    } catch {
      return false
    }
  },
}