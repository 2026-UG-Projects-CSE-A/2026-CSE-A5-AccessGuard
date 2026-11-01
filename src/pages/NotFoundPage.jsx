import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f4f6f9] p-6">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-navy-600">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-navy-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600">That route is not part of the AccessGuard preview.</p>
        <Link to="/dashboard" className="mt-5 inline-flex rounded-lg bg-navy-800 px-4 py-2 text-sm text-white">Go to dashboard</Link>
      </div>
    </div>
  )
}
