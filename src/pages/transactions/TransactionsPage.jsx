import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../components/common/Modal'
import PermissionGate from '../../components/common/PermissionGate'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/format'
import { PERMISSIONS } from '../../utils/permissions'
import { useToast } from '../../context/ToastContext'

const emptyTxn = { type: 'Deposit', fromAccountId: '', toAccountId: '', amount: '', note: '' }

export default function TransactionsPage() {
  const { store, currentUser, can, submitTransaction } = useApp()
  const { push } = useToast()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [form, setForm] = useState(null)
  const [formError, setFormError] = useState('')

  const ownAccounts = store.accounts.filter((account) => account.customerId === currentUser.customerId)
  const visible = can(PERMISSIONS.TRANSACTIONS_VIEW)
    ? store.transactions
    : store.transactions.filter((txn) => ownAccounts.some((account) => account.id === txn.fromAccountId || account.id === txn.toAccountId))

  const rows = useMemo(() => visible.filter((txn) => {
    const q = query.toLowerCase()
    return (!q || txn.reference.toLowerCase().includes(q) || txn.note.toLowerCase().includes(q)) && (status === 'all' || txn.status === status) && (type === 'all' || txn.type === type)
  }), [query, status, type, visible])

  const accountOptions = can(PERMISSIONS.ACCOUNTS_VIEW) ? store.accounts.filter((account) => account.status === 'Active') : ownAccounts.filter((account) => account.status === 'Active')

  const submit = () => {
    const result = submitTransaction(form)
    if (!result.ok) {
      setFormError(result.error)
      push(result.error, 'error')
      return
    }
    setForm(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">Search
          <input className="mt-1 block rounded-lg border px-3 py-2" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label className="text-sm">Status
          <select className="mt-1 block rounded-lg border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Completed</option>
          </select>
        </label>
        <label className="text-sm">Type
          <select className="mt-1 block rounded-lg border px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All</option>
            <option>Deposit</option>
            <option>Withdrawal</option>
            <option>Transfer</option>
          </select>
        </label>
        <PermissionGate permission={PERMISSIONS.TRANSACTIONS_SUBMIT}>
          <button type="button" className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={() => { setForm({ ...emptyTxn, toAccountId: accountOptions[0]?.id || '', fromAccountId: accountOptions[0]?.id || '' }); setFormError('') }}>New transaction</button>
        </PermissionGate>
      </div>
      <p className="text-sm text-slate-500">Submitting a request does not change balances. Pending → Approved → Completed is required, with an independent approver.</p>
      <DataTable
        rows={rows}
        columns={[
          { key: 'reference', header: 'Reference', sortable: true, render: (row) => <Link className="text-navy-700" to={`/transactions/${row.id}`}>{row.reference}</Link> },
          { key: 'type', header: 'Type', sortable: true },
          { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatCurrency(row.amount) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'createdAt', header: 'Submitted', sortable: true, render: (row) => formatDate(row.createdAt) },
        ]}
      />
      {form ? (
        <Modal
          title="Submit simulated transaction"
          onClose={() => setForm(null)}
          footer={
            <>
              <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={() => setForm(null)}>Cancel</button>
              <button type="button" className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={submit}>Submit for approval</button>
            </>
          }
        >
          <div className="grid gap-3">
            <label className="text-sm">Type
              <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Deposit</option>
                <option>Withdrawal</option>
                {currentUser.role === 'CUSTOMER' ? <option>Transfer</option> : <option>Transfer</option>}
              </select>
            </label>
            {form.type !== 'Deposit' ? (
              <label className="text-sm">From account
                <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.fromAccountId} onChange={(e) => setForm({ ...form, fromAccountId: e.target.value })}>
                  {accountOptions.map((account) => (
                    <option key={account.id} value={account.id}>{maskAccountNumber(account.accountNumber)} · {formatCurrency(account.balance)}</option>
                  ))}
                </select>
              </label>
            ) : null}
            {form.type !== 'Withdrawal' ? (
              <label className="text-sm">To account
                <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.toAccountId} onChange={(e) => setForm({ ...form, toAccountId: e.target.value })}>
                  {accountOptions.map((account) => (
                    <option key={account.id} value={account.id}>{maskAccountNumber(account.accountNumber)} · {formatCurrency(account.balance)}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="text-sm">Amount (INR)
              <input type="number" min="1" className="mt-1 w-full rounded-lg border px-3 py-2" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </label>
            <label className="text-sm">Note
              <textarea className="mt-1 w-full rounded-lg border px-3 py-2" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </label>
            {formError ? <p className="text-sm text-red-700">{formError}</p> : null}
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
