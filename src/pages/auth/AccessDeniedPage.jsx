import { ShieldOff } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ROLE_LABELS } from '../../utils/permissions'

export default function AccessDeniedPage() {
  const { currentRole, explain } = useApp()
  const location = useLocation()
  const permission = location.state?.permissions?.[0]
  const decision = permission ? explain(permission) : null

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
      <ShieldOff className="mx-auto text-red-700" size={36} />
      <h1 className="mt-4 text-2xl font-semibold text-navy-900">Access denied</h1>
      <p className="mt-2 text-sm text-slate-600">
        {ROLE_LABELS[currentRole]} cannot open {location.state?.from || 'this module'}. The route is protected by the centralized permission engine.
      </p>
      {decision ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{decision.reason}</p> : null}
      <p className="mt-3 text-xs text-slate-500">Production AccessGuard will require the same decision on the server.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/dashboard" className="rounded-lg bg-navy-800 px-4 py-2 text-sm text-white">Back to dashboard</Link>
        <Link to="/authorization" className="rounded-lg border px-4 py-2 text-sm">Explain permissions</Link>
      </div>
    </div>
  )
}
