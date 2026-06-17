import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, Lightbulb, Target } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import DocumentChecklist from './DocumentChecklist'
import JargonBuster from './JargonBuster'

const LOADING_PHRASES = [
  'Analyzing criteria...',
  'Cross-referencing proxy wealth...',
  'Generating strategy...',
]

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

const getConfidenceStyles = (score) => {
  if (score > 80) {
    return {
      bar: 'bg-emerald-500',
      track: 'bg-emerald-100',
      badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    }
  }

  if (score >= 50) {
    return {
      bar: 'bg-amber-500',
      track: 'bg-amber-100',
      badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    }
  }

  return {
    bar: 'bg-rose-500',
    track: 'bg-slate-200',
    badge: 'bg-slate-100 text-slate-700 ring-slate-200',
  }
}

const clampScore = (score) => Math.max(0, Math.min(100, Number(score) || 0))

const OutputContainer = ({ sectionTitle = 'Your Potentially Relevant Results', results, isLoading = false, cardSources }) => {
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0)

  useEffect(() => {
    if (!isLoading) {
      return undefined
    }

    const timerId = window.setInterval(() => {
      setLoadingPhraseIndex((currentIndex) => (currentIndex + 1) % LOADING_PHRASES.length)
    }, 2200)

    return () => window.clearInterval(timerId)
  }, [isLoading])

  const preliminaryAssessment = useMemo(() => results?.preliminaryAssessment ?? [], [results])
  const strategicAdvice = useMemo(() => results?.strategicAdvice ?? [], [results])
  const jargonBuster = useMemo(() => results?.jargonBuster ?? [], [results])
  const documentChecklist = useMemo(() => results?.documentChecklist ?? [], [results])

  if (!isLoading && !results) {
    return null
  }

  return (
    <section className="space-y-5" aria-live="polite">
      <h2 className="text-xl font-semibold text-slate-900">{sectionTitle}</h2>

      {isLoading ? (
        <motion.div
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Thinking</p>
              <h3 className="text-lg font-semibold text-slate-900">Preparing your results</h3>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <AnimatePresence mode="wait">
              <motion.p
                key={LOADING_PHRASES[loadingPhraseIndex]}
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-base font-medium text-slate-900 sm:text-lg"
              >
                {LOADING_PHRASES[loadingPhraseIndex]}
              </motion.p>
            </AnimatePresence>

            <div className="mt-4 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-2 w-1/3 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500"
                animate={{ x: ['-15%', '125%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-2 w-2 rounded-full bg-sky-500 motion-safe:animate-pulse" />
              Refining scholarship signals and matching them against your situation.
            </div>
          </div>
        </motion.div>
      ) : null}

      {!isLoading && results ? (
        <motion.div className="space-y-5" variants={sectionVariants} initial="hidden" animate="show">
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
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">Programs you may qualify for</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                {preliminaryAssessment.map((item) => {
                  const score = clampScore(item.confidenceScore)
                  const confidenceStyles = getConfidenceStyles(score)

                  return (
                    <motion.article
                      key={`${item.programName}-${score}`}
                      variants={itemVariants}
                      className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-semibold text-slate-900 sm:text-lg">{item.programName}</h4>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${confidenceStyles.badge}`}
                            >
                              {score}% confidence
                            </span>
                          </div>

                          {item.matchReason ? (
                            <p className="text-sm leading-6 text-slate-600">{item.matchReason}</p>
                          ) : null}

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                              <span>Confidence score</span>
                              <span>{score}%</span>
                            </div>
                            <div className={`h-2 overflow-hidden rounded-full ${confidenceStyles.track}`}>
                              <motion.div
                                className={`h-full rounded-full ${confidenceStyles.bar}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                              />
                            </div>
                          </div>

                          {item.applicationTimeline ? (
                            <p className="inline-flex items-center gap-2 text-sm text-slate-500">
                              <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                              <span>{item.applicationTimeline}</span>
                            </p>
                          ) : null}
                        </div>

                        {item.officialLink ? (
                          <a
                            href={item.officialLink}
                            target="_blank"
                            rel="noreferrer"
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

          {strategicAdvice.length > 0 ? (
            <motion.section
              variants={itemVariants}
              className="overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-100 shadow-sm"
            >
              <div className="border-b border-sky-100/70 px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700/80">
                      Strategic advice
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">Next best moves</h3>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:p-6">
                {strategicAdvice.map((adviceItem, index) => (
                  <motion.article
                    key={`${adviceItem.category}-${index}`}
                    variants={itemVariants}
                    className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
                        <Target className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-semibold text-slate-900">{adviceItem.category}</h4>
                          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                            Advisory
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{adviceItem.advice}</p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          ) : null}

          {jargonBuster.length > 0 ? (
            <motion.div variants={itemVariants}>
              <JargonBuster
                title={cardSources?.jargon?.title || 'What these terms actually mean'}
                items={jargonBuster}
                source={cardSources?.jargon?.source || { text: 'Learn more →', label: 'RaahNuma', url: '#' }}
              />
            </motion.div>
          ) : null}

          {documentChecklist.length > 0 ? (
            <motion.div variants={itemVariants}>
              <DocumentChecklist
                key={documentChecklist.map((document) => document.documentName ?? document).join('|')}
                title={cardSources?.documents?.title || 'Documents you will need'}
                items={documentChecklist}
                source={cardSources?.documents?.source || { text: 'Keep these ready →', label: 'RaahNuma', url: '#' }}
              />
            </motion.div>
          ) : null}
        </motion.div>
      ) : null}
    </section>
  )
}

export default OutputContainer
