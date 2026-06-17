import { useCallback, useEffect, useRef, useState } from 'react'
import { submitScholarshipQuery } from '../api/scholarshipService.js'

/**
 * @typedef {{ role: 'user' | 'model', text: string }} ConversationTurn
 */

/**
 * Serializes an AI response for storage in conversation history.
 * Model turns are stored as compact JSON so Gemini can recall prior financial data.
 *
 * @param {import('../schemas/scholarshipResponse.js').ScholarshipResponse} response
 * @returns {string}
 */
const serializeModelTurn = (response) => {
  if (!response) {
    return '{}'
  }

  const { responsible_ai_notice: notice, ...payload } = response
  void notice
  return JSON.stringify(payload)
}

export const useScholarshipQuery = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [conversationHistory, setConversationHistory] = useState(/** @type {ConversationTurn[]} */ ([]))

  const conversationHistoryRef = useRef(conversationHistory)
  const requestIdRef = useRef(0)
  const abortControllerRef = useRef(/** @type {AbortController | null} */ (null))

  useEffect(() => {
    conversationHistoryRef.current = conversationHistory
  }, [conversationHistory])

  const submitQuery = useCallback(async (queryText) => {
    const trimmedQuery = queryText?.trim()
    if (!trimmedQuery) {
      return null
    }

    abortControllerRef.current?.abort()

    const controller = new AbortController()
    abortControllerRef.current = controller
    const requestId = ++requestIdRef.current

    setIsLoading(true)
    setError(null)

    try {
      const historySnapshot = conversationHistoryRef.current
      const response = await submitScholarshipQuery(trimmedQuery, historySnapshot, {
        signal: controller.signal,
      })

      if (requestId !== requestIdRef.current) {
        return null
      }

      setResult(response)
      setConversationHistory((previousHistory) => [
        ...previousHistory,
        { role: 'user', text: trimmedQuery },
        { role: 'model', text: serializeModelTurn(response) },
      ])

      return response
    } catch (queryError) {
      if (queryError?.name === 'AbortError') {
        return null
      }

      if (requestId !== requestIdRef.current) {
        return null
      }

      const message =
        queryError?.message?.includes('VITE_GEMINI_API_KEY')
          ? 'Gemini API key not configured. Set VITE_GEMINI_API_KEY in your .env file.'
          : 'We could not process your request. Please try again.'
      setError(message)
      throw queryError
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  const clearConversation = useCallback(() => {
    abortControllerRef.current?.abort()
    requestIdRef.current += 1
    setConversationHistory([])
    setResult(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    submitQuery,
    isLoading,
    result,
    error,
    conversationHistory,
    clearConversation,
  }
}
