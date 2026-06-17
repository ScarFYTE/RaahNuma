import { useState } from 'react'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import ConversationHistory from '../components/input/ConversationHistory'
import SituationInput from '../components/input/SituationInput'
import DisclaimerBanner from '../components/shared/DisclaimerBanner'
import OutputContainer from '../components/output/OutputContainer'
import { useQueryContext } from '../context/queryContext'
import { HOME_SUPPORT_NOTICE, RESPONSIBLE_AI_NOTICE } from '../constants/disclaimers'

const PAGE_CONTENT = {
  header: {
    brandName: 'RaahNuma',
    tagline: 'Your scholarship navigator for Pakistan',
    linkHref: '#how-it-works',
    linkText: 'How it works',
  },
  hero: {
    title: 'Find the financial aid you deserve — in plain language.',
    subtitle:
      'Describe your situation below. RaahNuma will match you against HEC, PEEF, Ehsaas, and other programs. Follow-up questions keep your financial context.',
    placeholder:
      'e.g. I live in Multan, my father earns PKR 45,000/month, I got admission to FAST-NUCES for BS Computer Science. What scholarships can I apply for?',
    buttonText: 'Check My Eligibility →',
    helperText: HOME_SUPPORT_NOTICE,
  },
  output: {
    title: 'Your Potentially Relevant Results',
    cards: {
      jargon: {
        title: 'What These Terms Actually Mean',
        source: {
          text: 'Verify terms at official portal →',
          label: 'PEEF Official Portal',
          url: 'https://www.peef.org.pk',
        },
      },
      documents: {
        title: "Documents You'll Need",
        source: {
          text: 'Verify requirements at HEC →',
          label: 'HEC Official Portal',
          url: 'https://www.hec.gov.pk',
        },
      },
    },
  },
  footerCopy: 'Built for undergraduate students in Pakistan seeking potentially relevant scholarship pathways.',
}

const Home = () => {
  const { isLoading, result, error, conversationHistory, submitQuery, clearConversation } =
    useQueryContext()
  const [inputKey, setInputKey] = useState(0)

  const cardSources = {
    jargon: PAGE_CONTENT.output.cards.jargon,
    documents: PAGE_CONTENT.output.cards.documents,
  }

  const handleSubmit = async (queryText) => {
    try {
      await submitQuery(queryText)
      setInputKey((currentKey) => currentKey + 1)
    } catch {
      // Error state is handled in context
    }
  }

  const handleClearConversation = () => {
    clearConversation()
    setInputKey((currentKey) => currentKey + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-slate-50 to-white">
      <Header {...PAGE_CONTENT.header} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
        <ConversationHistory
          turns={conversationHistory}
          onClear={handleClearConversation}
          isLoading={isLoading}
        />

        <SituationInput
          key={inputKey}
          {...PAGE_CONTENT.hero}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
        ) : null}

        {isLoading || result ? (
          <OutputContainer
            sectionTitle={PAGE_CONTENT.output.title}
            results={result}
            isLoading={isLoading}
            cardSources={cardSources}
          />
        ) : null}
      </main>

      <Footer copy={PAGE_CONTENT.footerCopy} />
      <DisclaimerBanner message={result?.responsible_ai_notice || RESPONSIBLE_AI_NOTICE} />
    </div>
  )
}

export default Home
