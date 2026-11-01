import { useMemo, useState } from 'react'
import PermissionGate from '../../components/common/PermissionGate'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useApp } from '../../context/AppContext'
import { downloadCsv } from '../../utils/csv'
import { formatDate } from '../../utils/format'
import { PERMISSIONS, ROLE_LABELS } from '../../utils/permissions'

export default function AuditLogsPage() {
  const { store } = useApp()
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [action, setAction] = useState('all')
  const [selected, setSelected] = useState(null)

  const actions = [...new Set(store.auditLogs.map((item) => item.action))]
  const rows = useMemo(() => store.auditLogs.filter((item) => {
    const actor = store.users.find((user) => user.id === item.actorId)
    const q = query.toLowerCase()
    return (
      (!q || item.details.toLowerCase().includes(q) || item.action.toLowerCase().includes(q) || actor?.name.toLowerCase().includes(q)) &&
      (role === 'all' || item.actorRole === role) &&
      (status === 'all' || item.status === status) &&
      (action === 'all' || item.action === action)
    )
  }).map((item) => ({ ...item, actorName: store.users.find((user) => user.id === item.actorId)?.name })), [action, query, role, status, store.auditLogs, store.users])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Search events" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="rounded-lg border px-3 py-2 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="all">All roles</option>
          {Object.keys(ROLE_LABELS).map((id) => <option key={id} value={id}>{ROLE_LABELS[id]}</option>)}
        </select>
        <select className="rounded-lg border px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option>Success</option>
          <option>Denied</option>
          <option>Failed</option>
        </select>
        <select className="rounded-lg border px-3 py-2 text-sm" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="all">All actions</option>
          {actions.map((id) => <option key={id}>{id}</option>)}
        </select>
        <PermissionGate permission={PERMISSIONS.AUDIT_EXPORT}>
          <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={() => downloadCsv('accessguard-audit.csv', rows.map(({ actorName, action: act, at, status: st, severity, target, details }) => ({ at, actorName, action: act, status: st, severity, target, details })))}>Export CSV</button>
        </PermissionGate>
      </div>
      <p className="text-xs text-slate-500">Audit records are append-only through the normal interface. There is no edit or delete action.</p>
      <DataTable
        rows={rows}
        columns={[
          { key: 'at', header: 'When', sortable: true, render: (row) => formatDate(row.at) },
          { key: 'actorName', header: 'User' },
          { key: 'actorRole', header: 'Role', render: (row) => ROLE_LABELS[row.actorRole] },
          { key: 'action', header: 'Action', render: (row) => <button type="button" className="text-navy-700" onClick={() => setSelected(row)}>{row.action}</button> },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'severity', header: 'Severity', render: (row) => <StatusBadge value={row.severity} /> },
        ]}
      />
      {selected ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p className="font-semibold text-navy-900">{selected.action}</p>
          <p className="mt-1 text-slate-600">{selected.details}</p>
          <p className="mt-2 text-xs text-slate-500">Target: {selected.target}</p>
          <button type="button" className="mt-2 text-xs text-navy-700" onClick={() => setSelected(null)}>Close details</button>
        </div>
      ) : null}
    </div>
  )
}
