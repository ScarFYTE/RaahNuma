import { motion } from 'framer-motion'
import { Lightbulb, Target } from 'lucide-react'

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

/**
 * StrategicAdviceSection
 * ──────────────────────
 * Premium, visually distinct card for AI strategic guidance.
 * Used both in the greeting/empty state (centered hero) and full results layout.
 *
 * @param {object} props
 * @param {Array<{ category: string, advice: string }>} props.items
 * @param {boolean} [props.isHero=false] - Centered welcome layout when no assessments exist
 * @param {string} [props.title='Next best moves']
 * @param {string} [props.subtitle='Strategic advice']
 */
const StrategicAdviceSection = ({
  items = [],
  isHero = false,
  title = 'Next best moves',
  subtitle = 'Strategic advice',
}) => {
  if (!items.length) return null

  return (
    <motion.section
      variants={itemVariants}
      className={`overflow-hidden rounded-3xl border shadow-sm ${
        isHero
          ? 'mx-auto w-full max-w-2xl border-indigo-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50'
          : 'border-indigo-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50'
      }`}
      aria-label="Strategic advice"
    >
      <div className={`border-b border-indigo-100/80 ${isHero ? 'px-6 py-6 text-center sm:px-8' : 'px-5 py-4 sm:px-6'}`}>
        <div className={`flex items-start gap-3 ${isHero ? 'flex-col items-center' : ''}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div className={isHero ? 'space-y-1' : ''}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700/80">
              {subtitle}
            </p>
            <h3 className={`font-semibold text-slate-900 ${isHero ? 'text-2xl' : 'mt-1 text-lg'}`}>
              {isHero ? 'Welcome to RaahNuma' : title}
            </h3>
            {isHero ? (
              <p className="text-sm text-slate-600">
                Share your financial details below and we will build a tailored scholarship strategy.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className={`grid gap-4 ${isHero ? 'p-6 sm:p-8' : 'p-5 sm:p-6'}`}>
        {items.map((adviceItem, index) => (
          <motion.article
            key={`${adviceItem.category}-${index}`}
            variants={itemVariants}
            className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5"
          >
            <div className={`flex items-start gap-3 ${isHero ? 'flex-col sm:flex-row' : ''}`}>
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                <Target className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-semibold text-slate-900">{adviceItem.category}</h4>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
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
  )
}

export default StrategicAdviceSection
