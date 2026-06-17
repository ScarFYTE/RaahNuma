/**
 * scholarshipService.js
 * ─────────────────────
 * Universal AI adapter for RaahNuma.
 *
 * Production path: VITE_AI_PROVIDER=gemini with VITE_GEMINI_API_KEY set.
 * The service normalizes all adapter output into the canonical ScholarshipResponse schema.
 */

import { normalizeScholarshipResponse } from '../schemas/scholarshipResponse.js'
import { geminiAdapter } from './providers/geminiAdapter.js'
import { mockAdapter } from './providers/mockAdapter.js'

/** @type {Record<string, AdapterInterface>} */
const PROVIDER_REGISTRY = {
  gemini: geminiAdapter,
  mock: mockAdapter,
}

const GEMINI_PROVIDER = 'gemini'

/**
 * @typedef {{ role: 'user' | 'model', text: string }} ConversationTurn
 * @typedef {{ signal?: AbortSignal }} QueryOptions
 */

const resolveAdapter = () => {
  const providerKey = import.meta.env.VITE_AI_PROVIDER?.toLowerCase() ?? GEMINI_PROVIDER
  const adapter = PROVIDER_REGISTRY[providerKey]

  if (!adapter) {
    console.warn(
      `[RaahNuma] Unknown VITE_AI_PROVIDER="${providerKey}". ` +
        `Falling back to "${GEMINI_PROVIDER}". Valid options: ${Object.keys(PROVIDER_REGISTRY).join(', ')}`,
    )
    return PROVIDER_REGISTRY[GEMINI_PROVIDER]
  }

  if (providerKey !== GEMINI_PROVIDER && providerKey !== 'mock') {
    console.warn(`[RaahNuma] Provider "${providerKey}" is not supported. Use "${GEMINI_PROVIDER}" in production.`)
  }

  return adapter
}

/**
 * @param {string} queryText
 * @param {ConversationTurn[]} [conversationHistory=[]]
 * @param {QueryOptions} [options={}]
 * @returns {Promise<import('../schemas/scholarshipResponse.js').ScholarshipResponse>}
 */
export const submitScholarshipQuery = async (queryText, conversationHistory = [], options = {}) => {
  const adapter = resolveAdapter()
  const raw = await adapter.submitQuery(queryText, conversationHistory, options)
  return normalizeScholarshipResponse(raw)
}

/**
 * @returns {Promise<{ provider: string, healthy: boolean }>}
 */
export const runProviderHealthCheck = async () => {
  const providerKey = import.meta.env.VITE_AI_PROVIDER?.toLowerCase() ?? GEMINI_PROVIDER
  const adapter = resolveAdapter()
  const healthy = await adapter.healthCheck()
  return { provider: providerKey, healthy }
}
