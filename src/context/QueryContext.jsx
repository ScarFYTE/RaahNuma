import { useCallback, useMemo, useState } from 'react'
import { useScholarshipQuery } from '../hooks/useScholarshipQuery'
import { QueryContext } from './queryContext'

export const QueryProvider = ({ children }) => {
  const [queryText, setQueryText] = useState('')
  const {
    submitQuery: executeScholarshipQuery,
    isLoading,
    result,
    error,
    conversationHistory,
    clearConversation,
  } = useScholarshipQuery()

  /**
   * Submits a new user message while passing the full conversation history
   * to the active AI adapter (anti-amnesia / multi-turn memory).
   */
  const submitQuery = useCallback(
    async (nextQueryText) => {
      setQueryText(nextQueryText)
      return executeScholarshipQuery(nextQueryText)
    },
    [executeScholarshipQuery],
  )

  const contextValue = useMemo(
    () => ({
      queryText,
      isLoading,
      result,
      error,
      conversationHistory,
      submitQuery,
      clearConversation,
    }),
    [queryText, isLoading, result, error, conversationHistory, submitQuery, clearConversation],
  )

  return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>
}
