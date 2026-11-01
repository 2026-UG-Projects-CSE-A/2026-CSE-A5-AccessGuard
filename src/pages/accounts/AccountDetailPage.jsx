import { Link, Navigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import PermissionGate from '../../components/common/PermissionGate'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/format'
import { PERMISSIONS } from '../../utils/permissions'
import { useState } from 'react'

export default function AccountDetailPage() {
  const { id } = useParams()
  const { store, currentUser, can, setAccountStatus } = useApp()
  const [confirm, setConfirm] = useState(null)
  const account = store.accounts.find((item) => item.id === id)
  if (!account) return <Navigate to="/accounts" replace />

  const ownOnly = can(PERMISSIONS.ACCOUNTS_VIEW_OWN) && !can(PERMISSIONS.ACCOUNTS_VIEW)
  if (ownOnly && account.customerId !== currentUser.customerId) return <Navigate to="/access-denied" replace />

  const customer = store.customers.find((item) => item.id === account.customerId)
  const branch = store.branches.find((item) => item.id === account.branchId)
  const history = store.transactions.filter((txn) => txn.fromAccountId === account.id || txn.toAccountId === account.id)

  return (
    <div className="space-y-4">
      <Link to="/accounts" className="text-sm text-navy-700">← Accounts</Link>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-navy-900">{customer?.name}</h2>
            <p className="text-sm text-slate-500">{account.product} · {maskAccountNumber(account.accountNumber)}</p>
          </div>
          <StatusBadge value={account.status} />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
          <div><dt className="text-slate-500">Type</dt><dd className="font-medium">{account.type}</dd></div>
          <div><dt className="text-slate-500">Balance</dt><dd className="font-medium">{formatCurrency(account.balance)}</dd></div>
          <div><dt className="text-slate-500">Branch</dt><dd className="font-medium">{branch?.name}</dd></div>
        </dl>
        <PermissionGate permission={PERMISSIONS.ACCOUNTS_MANAGE_STATUS}>
          <button
            type="button"
            className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            onClick={() => setConfirm(account.status === 'Active' ? 'Frozen' : 'Active')}
          >
            {account.status === 'Active' ? 'Freeze account' : 'Reactivate account'}
          </button>
        </PermissionGate>
      </section>
      <h3 className="font-semibold text-navy-900">Transaction history</h3>
      <DataTable
        rows={history}
        columns={[
          { key: 'reference', header: 'Reference', render: (row) => <Link className="text-navy-700" to={`/transactions/${row.id}`}>{row.reference}</Link> },
          { key: 'type', header: 'Type' },
          { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'createdAt', header: 'Submitted', render: (row) => formatDate(row.createdAt) },
        ]}
      />
      {confirm ? (
        <ConfirmDialog
          title={`${confirm} account`}
          message="Account status changes are recorded in the audit log."
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            setAccountStatus(account.id, confirm)
            setConfirm(null)
          }}
        />
      ) : null}
    </div>
  )
}
