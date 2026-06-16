/**
 * mockAdapter.js
 * Default provider. Returns hardcoded mock data with a simulated delay.
 * Safe fallback when no VITE_AI_PROVIDER is set.
 * This is the ONLY provider that should be fully implemented right now.
 */

const MOCK_RESPONSE = {
  query_received: '',
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
      reason:
        'Monthly income appears to be below the PKR 50,000 threshold for private university students. You may be eligible to apply.',
      official_url:
        'https://www.hec.gov.pk/english/scholarshipsgrants/NBS/Pages/default.aspx',
    },
    {
      program_name: 'PEEF Scholarship (Punjab)',
      authority: 'Punjab Educational Endowment Fund',
      match_strength: 'possible',
      reason:
        'Punjab domicile may be required — you appear to meet the baseline criteria, but verify Multan district quota availability.',
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
    'This is a preliminary navigational assessment only. RaahNuma does not guarantee eligibility or approval. Always verify directly with the official program authority before applying.',
  sources: [
    { label: 'HEC Official Portal', url: 'https://www.hec.gov.pk' },
    { label: 'PEEF Official Portal', url: 'https://www.peef.org.pk' },
    { label: 'Ehsaas Program', url: 'https://www.pass.gov.pk' },
  ],
}

export const mockAdapter = {
  async submitQuery(queryText) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return { ...MOCK_RESPONSE, query_received: queryText }
  },

  async healthCheck() {
    return true
  },
}