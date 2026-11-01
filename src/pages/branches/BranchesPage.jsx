import { useState } from 'react'
import Modal from '../../components/common/Modal'
import PermissionGate from '../../components/common/PermissionGate'
import StatusBadge from '../../components/common/StatusBadge'
import { useApp } from '../../context/AppContext'
import { PERMISSIONS } from '../../utils/permissions'

export default function BranchesPage() {
  const { store, updateBranch } = useApp()
  const [selected, setSelected] = useState(null)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {store.branches.map((branch) => {
        const employees = store.employees.filter((item) => item.branchId === branch.id)
        const accounts = store.accounts.filter((item) => item.branchId === branch.id)
        return (
          <article key={branch.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-navy-900">{branch.name}</h2>
                <p className="text-sm text-slate-500">{branch.code} · {branch.ifsc}</p>
              </div>
              <StatusBadge value={branch.status} />
            </div>
            <p className="mt-3 text-sm text-slate-600">{branch.address}</p>
            <p className="mt-2 text-sm">{employees.length} employees · {accounts.length} accounts</p>
            <p className="text-xs text-slate-500">Staff assigned to this branch see it as their access indicator in the header.</p>
            <PermissionGate permission={PERMISSIONS.BRANCHES_MANAGE}>
              <button type="button" className="mt-3 text-sm text-navy-700" onClick={() => setSelected(branch)}>Edit details</button>
            </PermissionGate>
          </article>
        )
      })}
      {selected ? (
        <Modal
          title="Update branch"
          onClose={() => setSelected(null)}
          footer={<button type="button" className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={() => { updateBranch(selected.id, selected); setSelected(null) }}>Save</button>}
        >
          <label className="text-sm">Phone
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={selected.phone} onChange={(e) => setSelected({ ...selected, phone: e.target.value })} />
          </label>
          <label className="mt-3 block text-sm">Address
            <textarea className="mt-1 w-full rounded-lg border px-3 py-2" value={selected.address} onChange={(e) => setSelected({ ...selected, address: e.target.value })} />
          </label>
        </Modal>
      ) : null}
    </div>
  )
}
