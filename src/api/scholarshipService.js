/**
 * scholarshipService.js
 * ─────────────────────
 * Universal AI adapter for RaahNuma.
 *
 * Swap the active model by setting VITE_AI_PROVIDER in your .env file.
 * The rest of the application never needs to change.
 *
 * Supported provider keys (set as VITE_AI_PROVIDER):
 *   "claude"     → Anthropic Claude (claude-sonnet-4-6 or later)
 *   "openai"     → OpenAI GPT-4o
 *   "gemini"     → Google Gemini 1.5 Pro
 *   "ollama"     → Local Ollama instance (self-hosted)
 *   "mock"       → Returns mock data instantly (default, safe fallback)
 *
 * Each provider must implement the AdapterInterface contract below.
 */

import { claudeAdapter }  from './providers/claudeAdapter.js'
import { openaiAdapter }  from './providers/openaiAdapter.js'
import { geminiAdapter }  from './providers/geminiAdapter.js'
import { ollamaAdapter }  from './providers/ollamaAdapter.js'
import { mockAdapter }    from './providers/mockAdapter.js'

/** @type {Record<string, AdapterInterface>} */
const PROVIDER_REGISTRY = {
  claude: claudeAdapter,
  openai: openaiAdapter,
  gemini: geminiAdapter,
  ollama: ollamaAdapter,
  mock:   mockAdapter,
}

/**
 * AdapterInterface — every provider must implement these two functions.
 *
 * submitQuery(queryText: string): Promise<ScholarshipResponse>
 *   Sends the raw user query to the model and returns a structured response
 *   matching the ScholarshipResponse schema defined in useScholarshipQuery.js
 *
 * healthCheck(): Promise<boolean>
 *   Returns true if the provider is reachable and configured. Used for
 *   optional startup diagnostics. Never throws — returns false on failure.
 */

const resolveAdapter = () => {
  const providerKey = import.meta.env.VITE_AI_PROVIDER?.toLowerCase() ?? 'mock'
  const adapter = PROVIDER_REGISTRY[providerKey]

  if (!adapter) {
    console.warn(
      `[RaahNuma] Unknown VITE_AI_PROVIDER="${providerKey}". ` +
      `Falling back to "mock". Valid options: ${Object.keys(PROVIDER_REGISTRY).join(', ')}`
    )
    return PROVIDER_REGISTRY.mock
  }

  return adapter
}

/**
 * submitScholarshipQuery
 * Primary entry point used by useScholarshipQuery.js
 *
 * @param {string} queryText - Raw natural language input from the user
 * @returns {Promise<ScholarshipResponse>}
 */
export const submitScholarshipQuery = async (queryText) => {
  const adapter = resolveAdapter()
  return adapter.submitQuery(queryText)
}

/**
 * runProviderHealthCheck
 * Optional diagnostic — call on app startup to confirm provider is live.
 *
 * @returns {Promise<{ provider: string, healthy: boolean }>}
 */
export const runProviderHealthCheck = async () => {
  const providerKey = import.meta.env.VITE_AI_PROVIDER?.toLowerCase() ?? 'mock'
  const adapter = resolveAdapter()
  const healthy = await adapter.healthCheck()
  return { provider: providerKey, healthy }
}
