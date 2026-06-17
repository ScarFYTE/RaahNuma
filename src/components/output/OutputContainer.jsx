import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Target } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import DocumentChecklist from './DocumentChecklist'
import JargonBuster from './JargonBuster'
import StrategicAdviceSection from './StrategicAdviceSection'

/** Analytical phrases cycled during AI inference — fades every 1.5 seconds. */
const LOADING_PHRASES = [
  'Analyzing financial criteria...',
  'Cross-referencing proxy wealth thresholds...',
  'Generating application strategy...',
]

const LOADING_CYCLE_MS = 1500

const sectionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

/**
 * Returns Tailwind classes for the confidence progress bar per score band.
 * 80–100: green | 50–79: yellow | below 50: gray
 */
const getConfidenceBarColor = (score) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-400'
  return 'bg-gray-400'
}

const clampScore = (score) => Math.max(0, Math.min(100, Number(score) || 0))

const AnalysisLoadingPanel = () => {
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0)

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setLoadingPhraseIndex((currentIndex) => (currentIndex + 1) % LOADING_PHRASES.length)
    }, LOADING_CYCLE_MS)

    return () => window.clearInterval(timerId)
  }, [])

  return (
    <motion.div
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      role="status"
      aria-label="Analyzing your request"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Thinking
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Preparing your results</h3>
        </div>
      </div>

      <div className="mt-6 flex min-h-[5.5rem] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={LOADING_PHRASES[loadingPhraseIndex]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="text-center"
          >
            <p className="text-base font-medium text-slate-800 sm:text-lg">
              {LOADING_PHRASES[loadingPhraseIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/**
 * OutputContainer
 * ───────────────
 * Renders loading states, greeting/empty state, preliminary assessments,
 * strategic advice, jargon buster, and document checklist.
 */
const OutputContainer = ({
  sectionTitle = 'Your Potentially Relevant Results',
  results,
  isLoading = false,
  cardSources,
}) => {
  const preliminaryAssessment = useMemo(
    () => (Array.isArray(results?.preliminaryAssessment) ? results.preliminaryAssessment : []),
    [results],
  )
  const strategicAdvice = useMemo(
    () => (Array.isArray(results?.strategicAdvice) ? results.strategicAdvice : []),
    [results],
  )
  const jargonBuster = useMemo(
    () => (Array.isArray(results?.jargonBuster) ? results.jargonBuster : []),
    [results],
  )
  const documentChecklist = useMemo(
    () => (Array.isArray(results?.documentChecklist) ? results.documentChecklist : []),
    [results],
  )

  // Greeting / low-context flow: empty assessments but populated strategic advice
  const isGreetingState =
    !isLoading && preliminaryAssessment.length === 0 && strategicAdvice.length > 0

  if (!isLoading && !results) {
    return null
  }

  return (
    <section className="space-y-5" aria-live="polite">
      {!isGreetingState ? (
        <h2 className="text-xl font-semibold text-slate-900">{sectionTitle}</h2>
      ) : null}

      {/* Dynamic "thinking" state — no static spinners */}
      {isLoading ? <AnalysisLoadingPanel /> : null}

      {!isLoading && results ? (
        isGreetingState ? (
          /* Greeting fix: hide scholarship checklist UI; center strategic advice */
          <div className="flex min-h-[24rem] items-center justify-center py-6 sm:py-10">
            <StrategicAdviceSection items={strategicAdvice} isHero />
          </div>
        ) : (
          <motion.div className="space-y-5" variants={sectionVariants} initial="hidden" animate="show">
            {/* Preliminary assessment with confidence bar + timeline */}
            {preliminaryAssessment.length > 0 ? (
              <motion.section
                variants={itemVariants}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-sky-50 px-5 py-4 sm:px-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700/80">
                        Preliminary assessment
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        Programs that may be a potential fit
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  {preliminaryAssessment.map((item, index) => {
                    const score = clampScore(item?.confidenceScore)
                    const barColor = getConfidenceBarColor(score)
                    const programKey = item?.programName ?? `program-${index}`

                    return (
                      <motion.article
                        key={`${programKey}-${score}`}
                        variants={itemVariants}
                        className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-semibold text-slate-900 sm:text-lg">
                                {item?.programName ?? 'Unnamed program'}
                              </h4>
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                                {score}% confidence
                              </span>
                            </div>

                            {item?.matchReason ? (
                              <p className="text-sm leading-6 text-slate-600">{item.matchReason}</p>
                            ) : null}

                            {/* Animated horizontal confidence score bar */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                                <span>Confidence score</span>
                                <span>{score}%</span>
                              </div>
                              <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
                                <motion.div
                                  className={`h-full rounded-full ${barColor}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                />
                              </div>
                            </div>

                            {/* Application timeline with Calendar icon */}
                            {item?.applicationTimeline ? (
                              <p className="inline-flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                                <span>{item.applicationTimeline}</span>
                              </p>
                            ) : null}
                          </div>

                          {item?.officialLink ? (
                            <a
                              href={item.officialLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
                            >
                              Official link
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          ) : null}
                        </div>
                      </motion.article>
                    )
                  })}
                </div>
              </motion.section>
            ) : null}

            {/* Dedicated strategic advice section — distinct from checklists */}
            {strategicAdvice.length > 0 ? (
              <StrategicAdviceSection items={strategicAdvice} />
            ) : null}

            {jargonBuster.length > 0 ? (
              <motion.div variants={itemVariants}>
                <JargonBuster
                  title={cardSources?.jargon?.title || 'What these terms actually mean'}
                  items={jargonBuster}
                  source={
                    cardSources?.jargon?.source || {
                      text: 'Learn more →',
                      label: 'RaahNuma',
                      url: '#',
                    }
                  }
                />
              </motion.div>
            ) : null}

            {documentChecklist.length > 0 ? (
              <motion.div variants={itemVariants}>
                <DocumentChecklist
                  key={documentChecklist
                    .map((document) => document?.documentName ?? document)
                    .join('|')}
                  title={cardSources?.documents?.title || 'Documents you will need'}
                  items={documentChecklist}
                  source={
                    cardSources?.documents?.source || {
                      text: 'Keep these ready →',
                      label: 'RaahNuma',
                      url: '#',
                    }
                  }
                />
              </motion.div>
            ) : null}
          </motion.div>
        )
      ) : null}
    </section>
  )
}

export default OutputContainer
