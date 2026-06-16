/**
 * ollamaAdapter.js
 * Provider: Local Ollama (self-hosted LLM)
 *
 * Required env vars:
 *   VITE_AI_PROVIDER=ollama
 *   VITE_OLLAMA_BASE_URL=http://localhost:11434   (optional, has default)
 *   VITE_OLLAMA_MODEL=llama3                      (optional, has default)
 *
 * TODO: Implement submitQuery() using the Ollama Chat API.
 * Endpoint: POST {VITE_OLLAMA_BASE_URL}/api/chat
 * Set "format": "json" in the request body for structured output.
 * Parse message.content from the response into ScholarshipResponse.
 * Note: Ollama runs locally — no API key needed, but CORS must be enabled:
 *   OLLAMA_ORIGINS=* ollama serve
 */

export const ollamaAdapter = {
  async submitQuery(_queryText) {
    // TODO: Implement
    throw new Error(
      '[ollamaAdapter] Not yet implemented. ' +
      'Set VITE_AI_PROVIDER=mock to use the working placeholder.'
    )
  },

  async healthCheck() {
    // TODO: GET {VITE_OLLAMA_BASE_URL}/api/tags to check if Ollama is running
    return false
  },
}