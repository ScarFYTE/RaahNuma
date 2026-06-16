import { Compass } from 'lucide-react'
import { useEffect, useState } from 'react'

const Header = ({ brandName, tagline, linkHref, linkText }) => {
  const [hasShadow, setHasShadow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 4)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur transition-shadow ${
        hasShadow ? 'shadow-sm' : ''
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-teal-100 p-2 text-teal-700">
            <Compass className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">{brandName}</p>
            <p className="text-xs text-slate-500">{tagline}</p>
          </div>
        </div>

        <a href={linkHref} className="text-sm font-medium text-slate-600 transition hover:text-teal-700">
          {linkText}
        </a>
      </div>
    </header>
  )
}

export default Header
