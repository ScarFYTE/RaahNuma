import { ClipboardList } from 'lucide-react'
import { useState } from 'react'
import SourceLink from '../shared/SourceLink'

const DocumentChecklist = ({ title, items, source }) => {
  const [checkedItems, setCheckedItems] = useState({})

  const toggleItem = (item) => {
    setCheckedItems((previous) => ({
      ...previous,
      [item]: !previous[item],
    }))
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-4 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </header>

      <ul className="space-y-2">
        {items.map((item, index) => {
          const inputId = `document-item-${index}`

          return (
            <li
            key={item}
            className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
            <input
              id={inputId}
              type="checkbox"
              checked={Boolean(checkedItems[item])}
              onChange={() => toggleItem(item)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor={inputId} className="text-sm text-slate-700">
              {item}
            </label>
            </li>
          )
        })}
      </ul>

      <footer className="mt-4">
        <SourceLink href={source.url} label={source.label} text={source.text} />
      </footer>
    </article>
  )
}

export default DocumentChecklist
