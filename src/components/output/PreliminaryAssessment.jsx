import { CheckCircle } from 'lucide-react'
import SourceLink from '../shared/SourceLink'
import { formatMatchStrength } from '../../utils/formatters'

const MATCH_STYLES = {
  strong: 'bg-emerald-100 text-emerald-700',
  possible: 'bg-amber-100 text-amber-700',
}

const PreliminaryAssessment = ({ title, items, source }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-4 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-teal-600" />
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </header>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.program_name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-900">{item.program_name}</p>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  MATCH_STYLES[item.match_strength] || MATCH_STYLES.possible
                }`}
              >
                {formatMatchStrength(item.match_strength)}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{item.reason}</p>
          </li>
        ))}
      </ul>

      <footer className="mt-4">
        <SourceLink href={source.url} label={source.label} text={source.text} />
      </footer>
    </article>
  )
}

export default PreliminaryAssessment
