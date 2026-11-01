import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../components/common/Modal'
import PermissionGate from '../../components/common/PermissionGate'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useApp } from '../../context/AppContext'
import { formatCurrency, maskAccountNumber } from '../../utils/format'
import { PERMISSIONS } from '../../utils/permissions'

export default function AccountsPage() {
  const { store, currentUser, can, createAccount } = useApp()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [form, setForm] = useState(null)

  const visible = can(PERMISSIONS.ACCOUNTS_VIEW)
    ? store.accounts
    : store.accounts.filter((account) => account.customerId === currentUser.customerId)

  const rows = useMemo(() => visible.filter((account) => {
    const customer = store.customers.find((item) => item.id === account.customerId)
    const q = query.toLowerCase()
    const matches = !q || customer?.name.toLowerCase().includes(q) || account.accountNumber.includes(q.replace(/\s/g, ''))
    return matches && (type === 'all' || account.type === type) && (status === 'all' || account.status === status)
  }).map((account) => ({
    ...account,
    customerName: store.customers.find((item) => item.id === account.customerId)?.name,
    branchName: store.branches.find((item) => item.id === account.branchId)?.name,
  })), [query, status, store.branches, store.customers, type, visible])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">Customer or account
          <input className="mt-1 block rounded-lg border px-3 py-2" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Mehta or 4521" />
        </label>
        <label className="text-sm">Type
          <select className="mt-1 block rounded-lg border px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All</option>
            <option>Savings</option>
            <option>Current</option>
          </select>
        </label>
        <label className="text-sm">Status
          <select className="mt-1 block rounded-lg border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option>Active</option>
            <option>Frozen</option>
          </select>
        </label>
        <PermissionGate permission={PERMISSIONS.ACCOUNTS_CREATE}>
          <button type="button" className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={() => setForm({ customerId: store.customers[0].id, branchId: store.branches[0].id, type: 'Savings', openingBalance: '0', product: 'AccessGuard Savings Plus' })}>Open account</button>
        </PermissionGate>
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: 'customerName', header: 'Customer', sortable: true, render: (row) => <Link className="text-navy-700" to={`/accounts/${row.id}`}>{row.customerName}</Link> },
          { key: 'accountNumber', header: 'Account', render: (row) => maskAccountNumber(row.accountNumber) },
          { key: 'type', header: 'Type', sortable: true },
          { key: 'balance', header: 'Balance', sortable: true, render: (row) => formatCurrency(row.balance) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'branchName', header: 'Branch' },
        ]}
      />
      {form ? (
        <Modal
          title="Create account"
          onClose={() => setForm(null)}
          footer={
            <>
              <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={() => setForm(null)}>Cancel</button>
              <button
                type="button"
                className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white"
                onClick={() => {
                  createAccount(form)
                  setForm(null)
                }}
              >
                Create
              </button>
            </>
          }
        >
          <div className="grid gap-3">
            <label className="text-sm">Customer
              <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
                {store.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
              </select>
            </label>
            <label className="text-sm">Branch
              <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
                {store.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </label>
            <label className="text-sm">Type
              <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Savings</option>
                <option>Current</option>
              </select>
            </label>
            <label className="text-sm">Opening balance
              <input type="number" min="0" className="mt-1 w-full rounded-lg border px-3 py-2" value={form.openingBalance} onChange={(e) => setForm({ ...form, openingBalance: e.target.value })} />
            </label>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
