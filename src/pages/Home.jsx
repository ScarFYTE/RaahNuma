import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import SituationInput from '../components/input/SituationInput'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import DisclaimerBanner from '../components/shared/DisclaimerBanner'
import OutputContainer from '../components/output/OutputContainer'
import { useQueryContext } from '../context/queryContext'
import { HOME_SUPPORT_NOTICE, RESPONSIBLE_AI_NOTICE } from '../constants/disclaimers'
import { buildSourceByAuthority } from '../utils/formatters'

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
      'Describe your situation below. RaahNuma will match you against HEC, PEEF, Ehsaas, and other programs.',
    placeholder:
      'e.g. I live in Multan, my father earns PKR 45,000/month, I got admission to FAST-NUCES for BS Computer Science. What scholarships can I apply for?',
    buttonText: 'Check My Eligibility →',
    helperText: HOME_SUPPORT_NOTICE,
  },
  output: {
    title: 'Your Potentially Relevant Results',
    cards: {
      preliminary: {
        title: 'Programs You May Qualify For',
        source: {
          text: 'Verify at official portal →',
          label: 'HEC Official Portal',
          url: 'https://www.hec.gov.pk',
        },
      },
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
  loadingLabel: 'Reviewing your details and preparing a preliminary response...',
  footerCopy: 'Built for undergraduate students in Pakistan seeking potentially relevant scholarship pathways.',
}

const Home = () => {
  const { isLoading, result, error, submitQuery } = useQueryContext()
  const sourceMap = result?.sources ? buildSourceByAuthority(result.sources) : {}
  const cardSources = {
    preliminary: {
      ...PAGE_CONTENT.output.cards.preliminary,
      source: {
        ...PAGE_CONTENT.output.cards.preliminary.source,
        url: sourceMap['HEC Official Portal'] || PAGE_CONTENT.output.cards.preliminary.source.url,
      },
    },
    jargon: {
      ...PAGE_CONTENT.output.cards.jargon,
      source: {
        ...PAGE_CONTENT.output.cards.jargon.source,
        url: sourceMap['PEEF Official Portal'] || PAGE_CONTENT.output.cards.jargon.source.url,
      },
    },
    documents: {
      ...PAGE_CONTENT.output.cards.documents,
      source: {
        ...PAGE_CONTENT.output.cards.documents.source,
        url: sourceMap['HEC Official Portal'] || PAGE_CONTENT.output.cards.documents.source.url,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-slate-50 to-white">
      <Header {...PAGE_CONTENT.header} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
        <SituationInput {...PAGE_CONTENT.hero} onSubmit={submitQuery} isLoading={isLoading} />

        {isLoading ? <LoadingSpinner label={PAGE_CONTENT.loadingLabel} /> : null}

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
        ) : null}

        {result ? (
          <OutputContainer
            sectionTitle={PAGE_CONTENT.output.title}
            result={result}
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
