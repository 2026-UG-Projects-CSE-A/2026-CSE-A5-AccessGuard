import { Link } from 'react-router-dom'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/format'

export default function ApprovalsPage() {
  const { store, currentUser } = useApp()
  const rows = store.transactions.filter((txn) => ['Pending', 'Approved'].includes(txn.status)).map((txn) => ({
    ...txn,
    own: txn.submittedBy === currentUser.id,
  }))

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Pending items need an independent approver. Approved items still need completion before balances change.</p>
      <DataTable
        rows={rows}
        columns={[
          { key: 'reference', header: 'Reference', render: (row) => <Link className="text-navy-700" to={`/transactions/${row.id}`}>{row.reference}</Link> },
          { key: 'type', header: 'Type' },
          { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'createdAt', header: 'Submitted', render: (row) => formatDate(row.createdAt) },
          { key: 'own', header: 'Policy', render: (row) => (row.own ? 'Cannot self-approve' : 'Eligible for independent approval') },
        ]}
      />
    </div>
  )
}
