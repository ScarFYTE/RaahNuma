import { BookOpen } from 'lucide-react'
import SourceLink from '../shared/SourceLink'

const JargonBuster = ({ title, items, source }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </header>

      <dl className="space-y-3">
        {items.map((item) => (
          <div key={item.term} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <dt className="font-semibold text-slate-900">{item.term}</dt>
            <dd className="mt-1 text-sm text-slate-600">{item.plain_explanation}</dd>
          </div>
        ))}
      </dl>

      <footer className="mt-4">
        <SourceLink href={source.url} label={source.label} text={source.text} />
      </footer>
    </article>
  )
}

export default JargonBuster
