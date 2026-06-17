import { ArrowUpRight } from 'lucide-react'

const SourceLink = ({ href, label, text }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition hover:text-teal-600"
    >
      <span>{text}</span>
      <span className="text-xs text-slate-500">({label})</span>
      <ArrowUpRight className="h-4 w-4" />
    </a>
  )
}

export default SourceLink
