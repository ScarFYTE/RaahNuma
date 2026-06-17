import { MessageSquare, RotateCcw } from 'lucide-react'

/**
 * Shows prior user messages in the current conversation and a reset control.
 */
const ConversationHistory = ({ turns = [], onClear, isLoading }) => {
  const userMessages = turns.filter((turn) => turn.role === 'user')

  if (!userMessages.length) {
    return null
  }

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm sm:p-5"
      aria-label="Conversation history"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-teal-600" />
          <h2 className="text-sm font-semibold text-slate-900">This conversation</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {userMessages.length} {userMessages.length === 1 ? 'message' : 'messages'}
          </span>
        </div>

        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          New conversation
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {userMessages.map((turn, index) => (
          <li
            key={`${turn.text}-${index}`}
            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
              You
            </span>
            {turn.text}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ConversationHistory
