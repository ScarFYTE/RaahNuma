const MOCK_RESPONSE = {
  preliminaryAssessment: [
    {
      programName: 'HEC Need-Based Scholarship',
      matchLevel: 'High',
      matchReason:
        'Monthly income appears to be below the PKR 50,000 threshold for private university students. You may be eligible to apply.',
      officialLink:
        'https://www.hec.gov.pk/english/scholarshipsgrants/NBS/Pages/default.aspx',
    },
    {
      programName: 'PEEF Scholarship (Punjab)',
      matchLevel: 'Medium',
      matchReason:
        'Punjab domicile may be required — you appear to meet the baseline criteria, but verify district quota availability.',
      officialLink: 'https://www.peef.org.pk',
    },
  ],
  jargonBuster: [
    {
      term: 'Proxy Income Indicators',
      plainEnglishExplanation:
        'Since salaries are hard to verify, programs look at electricity bill amounts, vehicle ownership, and property size as indirect signs of household wealth.',
    },
    {
      term: 'Family Wealth Assets',
      plainEnglishExplanation:
        'This includes land, property, vehicles, and bank balances owned by anyone in your immediate household — not just your parents.',
    },
  ],
  documentChecklist: [
    {
      documentName: "Father's Attested Salary Slip (last 3 months)",
      reason: 'Verifies monthly household income against scholarship thresholds.',
    },
    {
      documentName: 'Last 3 months of electricity utility bills (MEPCO for Multan)',
      reason: 'Used as proxy income indicator for verification.',
    },
    {
      documentName: 'Family Registration Certificate (FRC) from NADRA',
      reason: 'Required to establish family composition for need assessment.',
    },
  ],
  responsible_ai_notice:
    'This is a preliminary navigational assessment only. RaahNuma does not guarantee eligibility or approval. Always verify directly with the official program authority before applying.',
}

export const mockAdapter = {
  async submitQuery(queryText) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return { ...MOCK_RESPONSE, queryReceived: queryText }
  },

  async healthCheck() {
    return true
  },
}