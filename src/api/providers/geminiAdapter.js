/**
 * geminiAdapter.js
 * Provider: Google Gemini 1.5 Pro
 *
 * Required env vars:
 *   VITE_AI_PROVIDER=gemini
 *   VITE_GEMINI_API_KEY=AIza...
 *   VITE_GEMINI_MODEL=gemini-1.5-pro             (optional, has default)
 *
 * TODO: Implement submitQuery() using the Gemini generateContent API.
 * Endpoint: POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
 * Use responseMimeType: "application/json" in generationConfig for structured output.
 * Parse candidates[0].content.parts[0].text into ScholarshipResponse.
 */

export const geminiAdapter = {
  async submitQuery(_queryText) {
    // TODO: Implement
    throw new Error(
      '[geminiAdapter] Not yet implemented. ' +
      'Set VITE_AI_PROVIDER=mock to use the working placeholder.'
    )
  },

  async healthCheck() {
    return false
  },
}