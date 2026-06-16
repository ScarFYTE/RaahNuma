import { useCallback, useMemo, useState } from 'react'
import { useScholarshipQuery } from '../hooks/useScholarshipQuery'
import { QueryContext } from './queryContext'

export const QueryProvider = ({ children }) => {
  const [queryText, setQueryText] = useState('')
  const { submitQuery: executeScholarshipQuery, isLoading, result, error } = useScholarshipQuery()

  const submitQuery = useCallback(async (nextQueryText) => {
    setQueryText(nextQueryText)
    return executeScholarshipQuery(nextQueryText)
  }, [executeScholarshipQuery])

  const contextValue = useMemo(
    () => ({
      queryText,
      isLoading,
      result,
      error,
      submitQuery,
    }),
    [queryText, isLoading, result, error, submitQuery],
  )

  return <QueryContext.Provider value={contextValue}>{children}</QueryContext.Provider>
}
