import { useCallback, useState } from 'react'
import { submitScholarshipQuery } from '../api/scholarshipService.js'

export const useScholarshipQuery = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const submitQuery = useCallback(async (queryText) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await submitScholarshipQuery(queryText)
      setResult(response)
      return response
    } catch (queryError) {
      const message =
        queryError?.message?.includes('Not yet implemented')
          ? `AI provider not configured. Set VITE_AI_PROVIDER=mock in your .env to use the demo mode.`
          : 'We could not process your request. Please try again.'
      setError(message)
      throw queryError
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    submitQuery,
    isLoading,
    result,
    error,
  }
}
