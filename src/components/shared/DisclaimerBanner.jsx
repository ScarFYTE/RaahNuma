import { AlertTriangle } from 'lucide-react'

const DisclaimerBanner = ({ message }) => {
  return (
    <aside className="sticky bottom-0 z-50 border-t border-amber-300 bg-amber-100/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-start gap-2 text-sm font-medium text-amber-900">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <p>{message}</p>
      </div>
    </aside>
  )
}

export default DisclaimerBanner
