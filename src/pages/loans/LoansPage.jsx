import { useMemo, useState } from 'react'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import PermissionGate from '../../components/common/PermissionGate'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/tables/DataTable'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/format'
import { PERMISSIONS } from '../../utils/permissions'

export default function LoansPage() {
  const { store, currentUser, can, submitLoan, reviewLoan } = useApp()
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [apply, setApply] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const visible = can(PERMISSIONS.LOANS_VIEW)
    ? store.loans
    : store.loans.filter((loan) => loan.customerId === currentUser.customerId)

  const rows = useMemo(() => visible.filter((loan) => status === 'all' || loan.status === status).map((loan) => ({
    ...loan,
    customerName: store.customers.find((item) => item.id === loan.customerId)?.name,
  })), [status, store.customers, visible])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">Status
          <select className="mt-1 block rounded-lg border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option>Pending</option>
            <option>Under Review</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </label>
        <PermissionGate permission={PERMISSIONS.LOANS_APPLY}>
          <button type="button" className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={() => setApply({ customerId: currentUser.customerId || store.customers[0].id, type: 'Personal Loan', amount: '', tenureMonths: '24', incomeProof: true })}>New application</button>
        </PermissionGate>
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: 'applicationNo', header: 'Application', sortable: true, render: (row) => <button type="button" className="text-navy-700" onClick={() => setSelected(row)}>{row.applicationNo}</button> },
          { key: 'customerName', header: 'Applicant' },
          { key: 'type', header: 'Type' },
          { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'submittedAt', header: 'Submitted', render: (row) => formatDate(row.submittedAt) },
        ]}
      />
      {selected ? (
        <Modal
          title={selected.applicationNo}
          onClose={() => setSelected(null)}
          footer={
            <PermissionGate permission={PERMISSIONS.LOANS_REVIEW}>
              <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={() => setConfirm({ status: 'Rejected' })}>Reject</button>
              <button type="button" className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={() => setConfirm({ status: 'Approved' })}>Approve</button>
            </PermissionGate>
          }
        >
          <p className="text-sm text-slate-600">{selected.customerName} · {selected.type} · {formatCurrency(selected.amount)} · {selected.tenureMonths} months</p>
          <h3 className="mt-4 text-sm font-semibold">Mock document checklist</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {selected.documents.map((doc) => (
              <li key={doc.name} className="flex justify-between"><span>{doc.name}</span><StatusBadge value={doc.status} /></li>
            ))}
          </ul>
          <label className="mt-4 block text-sm">Review notes
            <textarea className="mt-1 w-full rounded-lg border px-3 py-2" value={selected.notes} onChange={(e) => setSelected({ ...selected, notes: e.target.value })} />
          </label>
        </Modal>
      ) : null}
      {apply ? (
        <Modal
          title="Submit loan application"
          onClose={() => setApply(null)}
          footer={<button type="button" className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={() => { submitLoan(apply); setApply(null) }}>Submit</button>}
        >
          <div className="grid gap-3">
            {can(PERMISSIONS.CUSTOMERS_VIEW) ? (
              <label className="text-sm">Applicant
                <select className="mt-1 w-full rounded-lg border px-3 py-2" value={apply.customerId} onChange={(e) => setApply({ ...apply, customerId: e.target.value })}>
                  {store.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
                </select>
              </label>
            ) : null}
            <label className="text-sm">Loan type
              <select className="mt-1 w-full rounded-lg border px-3 py-2" value={apply.type} onChange={(e) => setApply({ ...apply, type: e.target.value })}>
                <option>Personal Loan</option>
                <option>Home Loan</option>
                <option>Vehicle Loan</option>
                <option>Business Loan</option>
              </select>
            </label>
            <label className="text-sm">Requested amount
              <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" value={apply.amount} onChange={(e) => setApply({ ...apply, amount: e.target.value })} />
            </label>
            <label className="text-sm">Tenure (months)
              <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" value={apply.tenureMonths} onChange={(e) => setApply({ ...apply, tenureMonths: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={apply.incomeProof} onChange={(e) => setApply({ ...apply, incomeProof: e.target.checked })} />
              Mock income proof attached
            </label>
          </div>
        </Modal>
      ) : null}
      {confirm ? (
        <ConfirmDialog
          title={`${confirm.status} application`}
          message="This updates the loan status and writes an audit event."
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            reviewLoan(selected.id, { status: confirm.status, notes: selected.notes })
            setConfirm(null)
            setSelected(null)
          }}
        />
      ) : null}
    </div>
  )
}
