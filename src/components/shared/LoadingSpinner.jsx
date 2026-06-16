import { LoaderCircle } from 'lucide-react'

const LoadingSpinner = ({ label }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-600" role="status">
      <LoaderCircle className="h-5 w-5 animate-spin text-teal-600" />
      <span>{label}</span>
    </div>
  )
}

export default LoadingSpinner
