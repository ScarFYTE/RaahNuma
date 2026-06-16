import { useRef, useState } from 'react'

const SituationInput = ({ title, subtitle, placeholder, buttonText, helperText, onSubmit, isLoading }) => {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const resizeTextarea = (element) => {
    if (!element) {
      return
    }

    element.style.height = 'auto'
    const maxHeight = 8 * 24
    const minHeight = 3 * 24
    const nextHeight = Math.max(minHeight, Math.min(element.scrollHeight, maxHeight))
    element.style.height = `${nextHeight}px`
    element.style.overflowY = element.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }

  const handleChange = (event) => {
    const nextValue = event.target.value
    setValue(nextValue)
    resizeTextarea(event.target)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmed = value.trim()
    if (!trimmed || isLoading) {
      return
    }

    onSubmit(trimmed)
  }

  return (
    <section className="rounded-3xl border border-teal-100 bg-white/90 p-6 shadow-sm sm:p-8" id="how-it-works">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
      <p className="mt-3 text-pretty text-base text-slate-600">{subtitle}</p>

      <form className="mt-6" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="situation-input">
          {title}
        </label>
        <textarea
          id="situation-input"
          ref={textareaRef}
          rows={3}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-inner outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
        />
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {buttonText}
          </button>
          <p className="text-sm text-slate-500">{helperText}</p>
        </div>
      </form>
    </section>
  )
}

export default SituationInput
