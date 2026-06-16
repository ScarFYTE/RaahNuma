import { useCallback, useState } from 'react'

const MOCK_RESPONSE = {
  query_received: 'I live in Multan, my father earns PKR 45,000/month...',
  user_profile: {
    city: 'Multan',
    province: 'Punjab',
    monthly_income_pkr: 45000,
    university: 'FAST-NUCES',
    university_type: 'private',
    degree: 'BS Computer Science',
  },
  preliminary_assessment: [
    {
      program_name: 'HEC Need-Based Scholarship',
      authority: 'Higher Education Commission',
      match_strength: 'strong',
      reason: 'Monthly income below PKR 50,000 threshold for private university students.',
      official_url:
        'https://www.hec.gov.pk/english/scholarshipsgrants/NBS/Pages/default.aspx',
    },
    {
      program_name: 'PEEF Scholarship (Punjab)',
      authority: 'Punjab Educational Endowment Fund',
      match_strength: 'possible',
      reason: 'Punjab domicile required — verify Multan district quota availability.',
      official_url: 'https://www.peef.org.pk',
    },
  ],
  jargon_busters: [
    {
      term: 'Proxy Income Indicators',
      plain_explanation:
        'Since salaries are hard to verify, programs look at electricity bill amounts, vehicle ownership, and property size as indirect signs of household wealth.',
    },
    {
      term: 'Family Wealth Assets',
      plain_explanation:
        'This includes land, property, vehicles, and bank balances owned by anyone in your immediate household — not just your parents.',
    },
  ],
  document_checklist: [
    "Father's Attested Salary Slip (last 3 months)",
    'Last 3 months of electricity utility bills (MEPCO for Multan)',
    'Family Registration Certificate (FRC) from NADRA',
    'Domicile Certificate (Punjab)',
    'University Admission Letter / Fee Challan',
    'CNIC copies of student and parents',
    'Recent passport-size photographs (attested)',
  ],
  responsible_ai_notice:
    'This assessment is a preliminary navigational guide only. RaahNuma does not guarantee eligibility or approval. Verify all criteria directly with the program authority before applying.',
  sources: [
    { label: 'HEC Official Portal', url: 'https://www.hec.gov.pk' },
    { label: 'PEEF Official Portal', url: 'https://www.peef.org.pk' },
    { label: 'Ehsaas Program', url: 'https://www.pass.gov.pk' },
  ],
}

export const useScholarshipQuery = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const submitQuery = useCallback(async (queryText) => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Replace mock response below with submitScholarshipQuery(queryText)
      await new Promise((resolve) => {
        setTimeout(resolve, 500)
      })

      const mockResult = {
        ...MOCK_RESPONSE,
        query_received: queryText || MOCK_RESPONSE.query_received,
      }

      setResult(mockResult)
      return mockResult
    } catch (queryError) {
      const defaultError = 'We could not process your request. Please try again.'
      setError(defaultError)
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
