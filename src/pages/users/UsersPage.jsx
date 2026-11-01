import { useMemo, useState } from 'react'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import PermissionGate from '../../components/common/PermissionGate'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useApp } from '../../context/AppContext'
import { ROLE_LABELS, ROLES, PERMISSIONS } from '../../utils/permissions'
import { formatDate } from '../../utils/format'

const emptyForm = { name: '', email: '', username: '', role: ROLES.BANK_TELLER, branchId: '', department: 'Operations', status: 'Active' }

export default function UsersPage() {
  const { store, saveUser, setUserStatus } = useApp()
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [form, setForm] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const rows = useMemo(() => store.users.filter((user) => {
    const q = query.toLowerCase()
    const matchesQuery = !q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.username.toLowerCase().includes(q)
    const matchesRole = role === 'all' || user.role === role
    const matchesStatus = status === 'all' || user.status === status
    return matchesQuery && matchesRole && matchesStatus
  }), [query, role, status, store.users])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">Search
          <input className="mt-1 block rounded-lg border border-slate-300 px-3 py-2" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label className="text-sm">Role
          <select className="mt-1 block rounded-lg border border-slate-300 px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="all">All</option>
            {Object.values(ROLES).map((id) => <option key={id} value={id}>{ROLE_LABELS[id]}</option>)}
          </select>
        </label>
        <label className="text-sm">Status
          <select className="mt-1 block rounded-lg border border-slate-300 px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>
        <PermissionGate permission={PERMISSIONS.USERS_MANAGE}>
          <button type="button" className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={() => setForm(emptyForm)}>Add user</button>
        </PermissionGate>
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: 'name', header: 'Name', sortable: true },
          { key: 'email', header: 'Email', sortable: true },
          { key: 'role', header: 'Role', sortable: true, render: (row) => ROLE_LABELS[row.role] },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'lastLogin', header: 'Last login', sortable: true, render: (row) => formatDate(row.lastLogin) },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <PermissionGate permission={PERMISSIONS.USERS_MANAGE} fallback={<span className="text-xs text-slate-400">View only</span>}>
                <div className="flex gap-2">
                  <button type="button" className="text-sm text-navy-700" onClick={() => setForm(row)}>Edit</button>
                  <button
                    type="button"
                    className="text-sm text-red-700"
                    onClick={() => setConfirm({ user: row, status: row.status === 'Active' ? 'Inactive' : 'Active' })}
                  >
                    {row.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </PermissionGate>
            ),
          },
        ]}
      />
      {form ? (
        <Modal
          title={form.id ? 'Edit user' : 'Create user'}
          onClose={() => setForm(null)}
          footer={
            <>
              <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={() => setForm(null)}>Cancel</button>
              <button
                type="button"
                className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white"
                onClick={() => {
                  if (!form.name || !form.email || !form.username) return
                  saveUser({ ...form, branchId: form.branchId || null })
                  setForm(null)
                }}
              >
                Save
              </button>
            </>
          }
        >
          <div className="grid gap-3">
            {['name', 'email', 'username', 'department'].map((field) => (
              <label key={field} className="text-sm capitalize">{field}
                <input className="mt-1 w-full rounded-lg border px-3 py-2" value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
              </label>
            ))}
            <label className="text-sm">Role
              <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {Object.values(ROLES).map((id) => <option key={id} value={id}>{ROLE_LABELS[id]}</option>)}
              </select>
            </label>
            <label className="text-sm">Branch
              <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.branchId || ''} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
                <option value="">Head office / none</option>
                {store.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </label>
          </div>
        </Modal>
      ) : null}
      {confirm ? (
        <ConfirmDialog
          title={`${confirm.status === 'Active' ? 'Activate' : 'Deactivate'} user`}
          message={`This changes the account status for ${confirm.user.name}.`}
          tone={confirm.status === 'Inactive' ? 'danger' : 'primary'}
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            setUserStatus(confirm.user.id, confirm.status)
            setConfirm(null)
          }}
        />
      ) : null}
    </div>
  )
}
