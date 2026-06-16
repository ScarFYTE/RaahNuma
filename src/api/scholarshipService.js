/**
 * Sends raw user query to backend for AI processing
 * POST /api/v1/query
 * @param {string} queryText - Raw natural language input from user
 * @returns {Promise<Object>} - Structured scholarship assessment response
 */
export const submitScholarshipQuery = async (queryText) => {
  void queryText
  // TODO: Replace with real Axios call when backend is ready
  // return await axios.post('/api/v1/query', { query: queryText });
}

/**
 * Fetches list of all supported scholarship programs
 * GET /api/v1/programs
 * @returns {Promise<Array>} - Array of scholarship program objects
 */
export const getAllPrograms = async () => {
  // TODO: Replace with real Axios call when backend is ready
}
