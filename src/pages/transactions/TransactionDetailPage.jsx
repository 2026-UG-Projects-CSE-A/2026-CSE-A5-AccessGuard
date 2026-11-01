import { Link, Navigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import PermissionGate from '../../components/common/PermissionGate'
import StatusBadge from '../../components/common/StatusBadge'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/format'
import { PERMISSIONS } from '../../utils/permissions'

export default function TransactionDetailPage() {
  const { id } = useParams()
  const { store, currentUser, can, decideTransaction, completeTransaction } = useApp()
  const { push } = useToast()
  const [confirm, setConfirm] = useState(null)
  const txn = store.transactions.find((item) => item.id === id)
  if (!txn) return <Navigate to="/transactions" replace />

  const ownAccounts = store.accounts.filter((account) => account.customerId === currentUser.customerId).map((account) => account.id)
  const ownOnly = can(PERMISSIONS.TRANSACTIONS_VIEW_OWN) && !can(PERMISSIONS.TRANSACTIONS_VIEW)
  if (ownOnly && !ownAccounts.includes(txn.fromAccountId) && !ownAccounts.includes(txn.toAccountId)) {
    return <Navigate to="/access-denied" replace />
  }

  const from = store.accounts.find((account) => account.id === txn.fromAccountId)
  const to = store.accounts.find((account) => account.id === txn.toAccountId)
  const submitter = store.users.find((user) => user.id === txn.submittedBy)
  const selfApproveBlocked = txn.requiresIndependentApproval && txn.submittedBy === currentUser.id

  const run = (action) => {
    const result = action === 'Completed' ? completeTransaction(txn.id) : decideTransaction(txn.id, action)
    if (!result.ok) push(result.error, 'error')
    setConfirm(null)
  }

  return (
    <div className="space-y-4">
      <Link to="/transactions" className="text-sm text-navy-700">← Transactions</Link>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-navy-900">{txn.reference}</h2>
            <p className="text-sm text-slate-500">{txn.type} · submitted {formatDate(txn.createdAt)}</p>
          </div>
          <StatusBadge value={txn.status} />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div><dt className="text-slate-500">Amount</dt><dd className="font-medium">{formatCurrency(txn.amount)}</dd></div>
          <div><dt className="text-slate-500">From</dt><dd>{from ? maskAccountNumber(from.accountNumber) : 'Cash / external'}</dd></div>
          <div><dt className="text-slate-500">To</dt><dd>{to ? maskAccountNumber(to.accountNumber) : 'Cash / external'}</dd></div>
          <div><dt className="text-slate-500">Submitted by</dt><dd>{submitter?.name}</dd></div>
          <div className="sm:col-span-2"><dt className="text-slate-500">Note</dt><dd>{txn.note || '—'}</dd></div>
        </dl>
        <ol className="mt-5 grid gap-2 text-sm sm:grid-cols-4">
          {['Pending', 'Approved', 'Completed', 'Rejected'].map((step) => (
            <li key={step} className={`rounded-lg border px-3 py-2 ${txn.status === step ? 'border-navy-700 bg-navy-50' : 'border-slate-200'}`}>{step}</li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          {txn.status === 'Pending' ? (
            <PermissionGate permission={PERMISSIONS.TRANSACTIONS_APPROVE}>
              <button type="button" disabled={selfApproveBlocked} className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white disabled:opacity-50" onClick={() => setConfirm('Approved')}>Approve</button>
              <button type="button" disabled={selfApproveBlocked} className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-700 disabled:opacity-50" onClick={() => setConfirm('Rejected')}>Reject</button>
              {selfApproveBlocked ? <p className="text-sm text-amber-800">Independent approval required — you submitted this request.</p> : null}
            </PermissionGate>
          ) : null}
          {txn.status === 'Approved' ? (
            <PermissionGate permission={PERMISSIONS.TRANSACTIONS_COMPLETE}>
              <button type="button" className="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white" onClick={() => setConfirm('Completed')}>Mark completed (post balances)</button>
            </PermissionGate>
          ) : null}
        </div>
      </section>
      {confirm ? (
        <ConfirmDialog
          title={`${confirm} transaction`}
          message={confirm === 'Completed' ? 'This posts the ledger and updates account balances.' : 'This records your independent decision. Balances stay unchanged until completion.'}
          onClose={() => setConfirm(null)}
          onConfirm={() => run(confirm)}
        />
      ) : null}
    </div>
  )
}
