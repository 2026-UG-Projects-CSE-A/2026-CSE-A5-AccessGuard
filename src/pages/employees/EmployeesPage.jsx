import { useMemo, useState } from 'react'
import Modal from '../../components/common/Modal'
import PermissionGate from '../../components/common/PermissionGate'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useApp } from '../../context/AppContext'
import { PERMISSIONS } from '../../utils/permissions'

export default function EmployeesPage() {
  const { store, updateEmployee } = useApp()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const rows = useMemo(() => store.employees.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.employeeCode.toLowerCase().includes(query.toLowerCase())).map((item) => ({
    ...item,
    branchName: store.branches.find((branch) => branch.id === item.branchId)?.name || 'Head Office',
  })), [query, store.branches, store.employees])

  return (
    <div className="space-y-4">
      <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Search employees" value={query} onChange={(e) => setQuery(e.target.value)} />
      <DataTable
        rows={rows}
        columns={[
          { key: 'employeeCode', header: 'Code', sortable: true },
          { key: 'name', header: 'Name', sortable: true, render: (row) => (
            <button type="button" className="text-navy-700" onClick={() => setSelected(row)}>{row.name}</button>
          ) },
          { key: 'jobRole', header: 'Job role' },
          { key: 'department', header: 'Department' },
          { key: 'branchName', header: 'Branch' },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
      />
      {selected ? (
        <Modal
          title={selected.name}
          onClose={() => setSelected(null)}
          footer={
            <PermissionGate permission={PERMISSIONS.EMPLOYEES_MANAGE}>
              <button type="button" className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={() => { updateEmployee(selected.id, selected); setSelected(null) }}>Save assignment</button>
            </PermissionGate>
          }
        >
          <p className="text-sm text-slate-500">{selected.employeeCode} · {selected.email}</p>
          <p className="mt-2 text-sm">Joined {selected.joinedOn}</p>
          <label className="mt-3 block text-sm">Branch assignment
            <select className="mt-1 w-full rounded-lg border px-3 py-2" value={selected.branchId || ''} onChange={(e) => setSelected({ ...selected, branchId: e.target.value || null })}>
              <option value="">Head Office</option>
              {store.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
            </select>
          </label>
          <label className="mt-3 block text-sm">Status
            <select className="mt-1 w-full rounded-lg border px-3 py-2" value={selected.status} onChange={(e) => setSelected({ ...selected, status: e.target.value })}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </Modal>
      ) : null}
    </div>
  )
}
