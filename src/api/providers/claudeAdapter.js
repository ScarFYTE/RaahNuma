/**
 * claudeAdapter.js
 * Provider: Anthropic Claude
 *
 * Required env vars:
 *   VITE_AI_PROVIDER=claude
 *   VITE_CLAUDE_API_KEY=sk-ant-...
 *   VITE_CLAUDE_MODEL=claude-sonnet-4-6          (optional, has default)
 *
 * TODO: Implement submitQuery() using the Anthropic Messages API.
 * Endpoint: POST https://api.anthropic.com/v1/messages
 * The system prompt must enforce the ScholarshipResponse JSON schema.
 * The response must use soft eligibility language (may be eligible, appears to meet).
 * Parse the response content[0].text and JSON.parse() into ScholarshipResponse.
 */

export const claudeAdapter = {
  async submitQuery(_queryText) {
    // TODO: Implement
    throw new Error(
      '[claudeAdapter] Not yet implemented. ' +
      'Set VITE_AI_PROVIDER=mock to use the working placeholder.'
    )
  },

  async healthCheck() {
    // TODO: Ping https://api.anthropic.com/v1/models with API key
    return false
  },
}