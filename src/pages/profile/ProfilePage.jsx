import { useState } from 'react'
import StatusBadge from '../../components/common/StatusBadge'
import { useApp } from '../../context/AppContext'
import { ROLE_LABELS } from '../../utils/permissions'

export default function ProfilePage() {
  const { currentUser, store, updateProfile, saveCustomerRequest } = useApp()
  const [name, setName] = useState(currentUser.name)
  const [request, setRequest] = useState('')
  const branch = store.branches.find((item) => item.id === currentUser.branchId)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-navy-900">User profile</h2>
        <p className="text-sm text-slate-500">{currentUser.email} · {ROLE_LABELS[currentUser.role]}</p>
        <p className="mt-2 text-sm">Branch: {branch?.name || 'Head Office'} · <StatusBadge value={currentUser.status} /></p>
        <label className="mt-4 block text-sm">Display name
          <input className="mt-1 w-full rounded-lg border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="button" className="mt-3 rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={() => updateProfile({ name })}>Save profile</button>
      </section>
      {currentUser.customerId ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-navy-900">Service request</h2>
          <textarea className="mt-3 w-full rounded-lg border px-3 py-2" placeholder="Cheque book, address update, callback…" value={request} onChange={(e) => setRequest(e.target.value)} />
          <button
            type="button"
            className="mt-3 rounded-lg border px-3 py-2 text-sm"
            onClick={() => {
              if (!request.trim()) return
              saveCustomerRequest({ type: 'Customer request', note: request })
              setRequest('')
            }}
          >
            Submit request
          </button>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Password for all personas is documented on the login page. This profile update does not change authorization; role assignment is managed by Super Admin.
        </section>
      )}
    </div>
  )
}
