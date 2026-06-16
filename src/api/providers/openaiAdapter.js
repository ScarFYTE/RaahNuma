/**
 * openaiAdapter.js
 * Provider: OpenAI GPT-4o
 *
 * Required env vars:
 *   VITE_AI_PROVIDER=openai
 *   VITE_OPENAI_API_KEY=sk-...
 *   VITE_OPENAI_MODEL=gpt-4o                     (optional, has default)
 *
 * TODO: Implement submitQuery() using the OpenAI Chat Completions API.
 * Endpoint: POST https://api.openai.com/v1/chat/completions
 * Use response_format: { type: "json_object" } for structured output.
 * Parse choices[0].message.content into ScholarshipResponse.
 */

export const openaiAdapter = {
  async submitQuery(_queryText) {
    // TODO: Implement
    throw new Error(
      '[openaiAdapter] Not yet implemented. ' +
      'Set VITE_AI_PROVIDER=mock to use the working placeholder.'
    )
  },

  async healthCheck() {
    // TODO: Ping https://api.openai.com/v1/models with API key
    return false
  },
}