import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../utils/format'

export default function CustomersPage() {
  const { store, currentUser } = useApp()
  const [query, setQuery] = useState('')
  const assignedOnly = currentUser.role === 'RELATIONSHIP_MANAGER'
  const rows = useMemo(() => {
    const list = assignedOnly ? store.customers.filter((customer) => customer.rmId === currentUser.id) : store.customers
    return list.filter((customer) => customer.name.toLowerCase().includes(query.toLowerCase()) || customer.email.toLowerCase().includes(query.toLowerCase())).map((customer) => {
      const accounts = store.accounts.filter((account) => account.customerId === customer.id)
      return {
        ...customer,
        accountCount: accounts.length,
        portfolio: accounts.reduce((sum, account) => sum + account.balance, 0),
        branchName: store.branches.find((branch) => branch.id === customer.branchId)?.name,
        firstAccountId: accounts[0]?.id,
      }
    })
  }, [assignedOnly, currentUser.id, query, store.accounts, store.branches, store.customers])

  return (
    <div className="space-y-4">
      <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Search customers" value={query} onChange={(e) => setQuery(e.target.value)} />
      <DataTable
        rows={rows}
        columns={[
          { key: 'name', header: 'Customer', sortable: true, render: (row) => row.firstAccountId ? <Link className="text-navy-700" to={`/accounts/${row.firstAccountId}`}>{row.name}</Link> : row.name },
          { key: 'city', header: 'City' },
          { key: 'kyc', header: 'KYC', render: (row) => <StatusBadge value={row.kyc} /> },
          { key: 'accountCount', header: 'Accounts' },
          { key: 'portfolio', header: 'Balances', render: (row) => formatCurrency(row.portfolio) },
          { key: 'branchName', header: 'Home branch' },
        ]}
      />
    </div>
  )
}
