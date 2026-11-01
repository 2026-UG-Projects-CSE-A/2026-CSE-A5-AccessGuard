import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { PERMISSION_META, ROLE_LABELS } from '../../utils/permissions'

export default function AuthorizationPage() {
  const { currentRole, explain, can } = useApp()
  const [permission, setPermission] = useState(PERMISSION_META[0].id)
  const decision = explain(permission)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-navy-900">Allow / deny </h2>
        <p className="mt-1 text-sm text-slate-500">
          Every button, menu item, and route in AccessGuard calls one permission utility. This page shows the current decision for {ROLE_LABELS[currentRole]}.
        </p>
        <label className="mt-4 block text-sm">
          Permission
          <select className="mt-1 w-full rounded-lg border px-3 py-2" value={permission} onChange={(e) => setPermission(e.target.value)}>
            {PERMISSION_META.map((item) => (
              <option key={item.id} value={item.id}>{item.module} — {item.action}</option>
            ))}
          </select>
        </label>
        <div className={`mt-4 rounded-lg border px-4 py-3 ${decision.allowed ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-900'}`}>
          <p className="text-sm font-semibold">{decision.allowed ? 'ALLOW' : 'DENY'}</p>
          <p className="mt-1 text-sm">{decision.reason}</p>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-navy-900">How the engine is used</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Sidebar items render only when the role has the mapped permission.</li>
          <li>Protected routes redirect to Access Denied and write an audit event.</li>
          <li>Sensitive buttons are wrapped in a permission gate.</li>
          <li>Transaction approval additionally forbids self-approval.</li>
          {/* <li>These checks are frontend demonstrations. A future backend must repeat them.</li> */}
        </ul>
        <p className="mt-4 text-sm">Current role can manage users: <strong>{can('users.manage') ? 'yes' : 'no'}</strong></p>
        <p className="text-sm">Current role can approve transactions: <strong>{can('transactions.approve') ? 'yes' : 'no'}</strong></p>
      </section>
    </div>
  )
}
