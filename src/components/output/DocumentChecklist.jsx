import { ClipboardList } from 'lucide-react'
import { useState } from 'react'
import SourceLink from '../shared/SourceLink'

const DocumentChecklist = ({ title, items, source }) => {
  const [checkedItems, setCheckedItems] = useState({})

  const toggleItem = (itemName) => {
    setCheckedItems((previous) => ({
      ...previous,
      [itemName]: !previous[itemName],
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
          const documentName = typeof item === 'string' ? item : item.documentName
          const reason = typeof item === 'string' ? '' : item.reason

          return (
            <li
              key={documentName}
              className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <input
                id={inputId}
                type="checkbox"
                checked={Boolean(checkedItems[documentName])}
                onChange={() => toggleItem(documentName)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor={inputId} className="min-w-0 flex-1 cursor-pointer">
                <span className="text-sm font-medium text-slate-800">{documentName}</span>
                {reason ? (
                  <span className="mt-1 block text-sm text-slate-600">{reason}</span>
                ) : null}
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
