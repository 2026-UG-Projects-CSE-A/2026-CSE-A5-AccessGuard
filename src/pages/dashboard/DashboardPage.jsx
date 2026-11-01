import { AlertTriangle, Building2, Landmark, TrendingUp, Users, Wallet, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/format'
import { ROLE_LABELS, ROLES } from '../../utils/permissions'

const PALETTE = ['#0e2145', '#24508e', '#3460a8', '#5580be', '#87a8d4', '#b9cde9', '#dce6f4']

/* ── Welcome banner ─────────────────────────────────────── */
function WelcomeBanner({ name, role }) {
  const hour  = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-700 px-6 py-5 text-white shadow-md animate-fade-in">
      <p className="text-sm text-navy-200">{greet},</p>
      <h2 className="mt-0.5 text-xl font-semibold tracking-tight">{name}</h2>
      <p className="mt-1 text-sm text-navy-300">
        Signed in as <span className="font-medium text-navy-100">{ROLE_LABELS[role]}</span>
        &nbsp;· {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
    </div>
  )
}

/* ── Section card containers ─────────────────────────────── */
function ChartCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-navy-900">{title}</h3>
      {children}
    </section>
  )
}

function Panel({ title, to, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
        {to && (
          <Link to={to} className="flex items-center gap-1 text-xs font-medium text-navy-600 hover:text-navy-800">
            View all <ArrowRight size={12} />
          </Link>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function Row({ title, meta, badge, to }) {
  const content = (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 hover:border-navy-200 hover:bg-navy-50 transition-colors">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-navy-900">{title}</p>
        <p className="truncate text-xs text-slate-500">{meta}</p>
      </div>
      {badge ? <StatusBadge value={badge} /> : null}
    </div>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

/* ── Role-specific dashboards ─────────────────────────────── */
export default function DashboardPage() {
  const { currentRole, currentUser } = useApp()
  return (
    <div>
      <WelcomeBanner name={currentUser.name} role={currentRole} />
      {currentRole === ROLES.SUPER_ADMIN           && <AdminDashboard />}
      {currentRole === ROLES.BRANCH_MANAGER        && <ManagerDashboard />}
      {currentRole === ROLES.BANK_TELLER           && <TellerDashboard />}
      {currentRole === ROLES.CUSTOMER              && <CustomerDashboard />}
      {currentRole === ROLES.AUDITOR               && <AuditorDashboard />}
      {currentRole === ROLES.LOAN_OFFICER          && <LoanDashboard />}
      {currentRole === ROLES.RELATIONSHIP_MANAGER  && <RmDashboard />}
    </div>
  )
}

/* ── Super Admin ──────────────────────────────────────────── */
function AdminDashboard() {
  const { store } = useApp()
  const roleData = Object.values(ROLES).map((role) => ({
    name: ROLE_LABELS[role].split(' ')[0],
    value: store.users.filter((u) => u.role === role).length,
  }))
  const alerts = store.auditLogs.filter((item) => item.severity === 'High' || item.status === 'Denied').slice(0, 5)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users"     value={store.users.length}                                               hint={`${store.users.filter((u) => u.status === 'Active').length} active`}      icon={Users}        accent="blue" />
        <StatCard label="Branches"        value={store.branches.length}                                                                                                                            icon={Building2}    accent="green" />
        <StatCard label="Inactive users"  value={store.users.filter((u) => u.status === 'Inactive').length}        hint="Require attention"                                                       icon={AlertTriangle} accent="amber" />
        <StatCard label="Audit events"    value={store.auditLogs.length}                                           hint="Session log"                                                        icon={Landmark}     accent="purple" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Role distribution">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {roleData.map((entry, i) => (
                  <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <Panel title="Recent audit events" to="/audit-logs">
          {store.auditLogs.slice(0, 5).map((item) => (
            <Row key={item.id} title={item.action} meta={`${formatDate(item.at)} · ${item.details}`} badge={item.severity} />
          ))}
        </Panel>
      </div>

      <Panel title="Security alerts">
        {alerts.length
          ? alerts.map((item) => <Row key={item.id} title={item.action} meta={item.details} badge={item.status} />)
          : <p className="text-sm text-slate-500">No high-severity alerts in the current set.</p>
        }
      </Panel>
    </div>
  )
}

/* ── Branch Manager ───────────────────────────────────────── */
function ManagerDashboard() {
  const { store, currentUser } = useApp()
  const branchAccounts = store.accounts.filter((a) => a.branchId === currentUser.branchId)
  const branchTx       = store.transactions.filter((t) => t.branchId === currentUser.branchId)
  const pending        = branchTx.filter((t) => t.status === 'Pending')
  const employees      = store.employees.filter((e) => e.branchId === currentUser.branchId)
  const summary        = ['Pending', 'Approved', 'Rejected', 'Completed'].map((status) => ({
    status, count: branchTx.filter((t) => t.status === status).length,
  }))

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Branch accounts"    value={branchAccounts.length}       hint={formatCurrency(branchAccounts.reduce((s, a) => s + a.balance, 0))} icon={Wallet}        accent="blue" />
        <StatCard label="Pending approvals"  value={pending.length}              hint="Awaiting decision"                                                  icon={AlertTriangle} accent="amber" />
        <StatCard label="Branch employees"   value={employees.length}                                                                                      icon={Users}         accent="green" />
        <StatCard label="Total transactions" value={branchTx.length}             hint="All statuses"                                                       icon={TrendingUp}    accent="purple" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Transaction status breakdown">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={summary} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0e2145" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Panel title="Pending approvals" to="/approvals">
          {pending.length
            ? pending.map((txn) => (
                <Row key={txn.id} title={`${txn.reference} · ${formatCurrency(txn.amount)}`} meta={txn.note} badge={txn.status} to={`/transactions/${txn.id}`} />
              ))
            : <p className="text-sm text-slate-500">No pending transactions right now.</p>
          }
        </Panel>
      </div>

      <Panel title="Recent branch activity" to="/transactions">
        {branchTx.slice(0, 5).map((txn) => (
          <Row key={txn.id} title={txn.reference} meta={`${txn.type} · ${formatDate(txn.createdAt)}`} badge={txn.status} />
        ))}
      </Panel>
    </div>
  )
}

/* ── Bank Teller ──────────────────────────────────────────── */
function TellerDashboard() {
  const { store, currentUser } = useApp()
  const mine = store.transactions.filter((t) => t.submittedBy === currentUser.id)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="My submissions"  value={mine.length}                                           accent="blue" />
        <StatCard label="Pending"         value={mine.filter((t) => t.status === 'Pending').length}     accent="amber" />
        <StatCard label="Completed"       value={mine.filter((t) => t.status === 'Completed').length}   accent="green" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Quick actions">
          <div className="flex flex-wrap gap-2">
            <Link className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-4 py-2 text-sm font-medium text-white hover:bg-navy-900" to="/transactions">
              New deposit / withdrawal
            </Link>
            <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50" to="/accounts">
              Account search
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-500">Balances only update after a manager completes an approved request.</p>
        </Panel>

        <Panel title="Recent transactions" to="/transactions">
          {store.transactions.slice(0, 5).map((txn) => (
            <Row key={txn.id} title={txn.reference} meta={`${txn.type} · ${formatCurrency(txn.amount)}`} badge={txn.status} to={`/transactions/${txn.id}`} />
          ))}
        </Panel>
      </div>
    </div>
  )
}

/* ── Customer ─────────────────────────────────────────────── */
function CustomerDashboard() {
  const { store, currentUser } = useApp()
  const accounts = store.accounts.filter((a) => a.customerId === currentUser.customerId)
  const txns     = store.transactions.filter((t) => accounts.some((a) => a.id === t.fromAccountId || a.id === t.toAccountId))

  return (
    <div className="space-y-5">
      {/* Account cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <StatCard
            key={account.id}
            label={`${account.type} · ${maskAccountNumber(account.accountNumber)}`}
            value={formatCurrency(account.balance)}
            hint={account.status === 'Frozen' ? '⚠ Account frozen' : account.product}
            icon={Wallet}
            accent={account.status === 'Frozen' ? 'red' : 'blue'}
          />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Recent transactions" to="/transactions">
          {txns.slice(0, 6).map((txn) => (
            <Row key={txn.id} title={txn.reference} meta={`${txn.type} · ${formatCurrency(txn.amount)}`} badge={txn.status} to={`/transactions/${txn.id}`} />
          ))}
        </Panel>

        <Panel title="Service requests">
          {store.serviceRequests.filter((r) => r.customerId === currentUser.customerId).map((r) => (
            <Row key={r.id} title={r.type} meta={r.note} badge={r.status} />
          ))}
          <Link className="text-xs font-medium text-navy-700 hover:text-navy-900" to="/profile">
            Manage profile &amp; requests →
          </Link>
        </Panel>
      </div>

      <Link className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-900" to="/transactions">
        Request a transfer
      </Link>
    </div>
  )
}

/* ── Auditor ──────────────────────────────────────────────── */
function AuditorDashboard() {
  const { store } = useApp()
  const denied = store.auditLogs.filter((item) => item.action === 'ACCESS_DENIED' || item.status === 'Denied')

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total audit events"  value={store.auditLogs.length}                                                                                     accent="blue" />
        <StatCard label="Denied attempts"     value={denied.length}                hint="Access blocked"                                                          accent="red" />
        <StatCard label="High severity"       value={store.auditLogs.filter((l) => l.severity === 'High').length}                                                 accent="amber" />
        <StatCard label="Admin actions"       value={store.auditLogs.filter((l) => l.action.includes('USER') || l.action.includes('PERMISSION')).length}          accent="purple" />
      </div>

      <Panel title="Recent administrative events" to="/audit-logs">
        {store.auditLogs.slice(0, 8).map((item) => (
          <Row key={item.id} title={item.action} meta={item.details} badge={item.severity} />
        ))}
      </Panel>
    </div>
  )
}

/* ── Loan Officer ─────────────────────────────────────────── */
function LoanDashboard() {
  const { store, currentUser } = useApp()
  const mine = store.loans.filter((l) => l.reviewedBy === currentUser.id)
  const dist = ['Pending', 'Under Review', 'Approved', 'Rejected'].map((status) => ({
    status, count: store.loans.filter((l) => l.status === status).length,
  }))

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending applications" value={store.loans.filter((l) => l.status === 'Pending').length}     accent="amber" />
        <StatCard label="Assigned reviews"     value={mine.length}                                                   accent="blue" />
        <StatCard label="Reviewed"             value={store.loans.filter((l) => ['Approved','Rejected'].includes(l.status)).length} accent="green" />
      </div>

      <ChartCard title="Application status distribution">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dist} barCategoryGap="40%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="status" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#24508e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Panel title="Loan applications" to="/loans">
        {store.loans.map((loan) => (
          <Row key={loan.id} title={loan.applicationNo} meta={`${loan.type} · ${formatCurrency(loan.amount)}`} badge={loan.status} to="/loans" />
        ))}
      </Panel>
    </div>
  )
}

/* ── Relationship Manager ─────────────────────────────────── */
function RmDashboard() {
  const { store, currentUser } = useApp()
  const assigned  = store.customers.filter((c) => c.rmId === currentUser.id)
  const ids       = assigned.map((c) => c.id)
  const portfolio = store.accounts.filter((a) => ids.includes(a.customerId)).reduce((s, a) => s + a.balance, 0)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Assigned customers"  value={assigned.length}                                                                                              accent="blue" />
        <StatCard label="Portfolio AUM"       value={formatCurrency(portfolio)}     hint="Across all accounts"                                                     accent="green" />
        <StatCard label="Pending follow-ups"  value={store.followUps.filter((f) => f.rmId === currentUser.id && f.status === 'Pending').length}                    accent="amber" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Customer service requests">
          {store.serviceRequests.filter((r) => ids.includes(r.customerId)).map((r) => (
            <Row key={r.id} title={r.type} meta={r.note} badge={r.status} />
          ))}
          {!store.serviceRequests.filter((r) => ids.includes(r.customerId)).length && (
            <p className="text-sm text-slate-500">No open service requests.</p>
          )}
        </Panel>

        <Panel title="Loan pipeline" to="/loans">
          {store.loans.filter((l) => ids.includes(l.customerId)).map((l) => (
            <Row key={l.id} title={l.applicationNo} meta={`${l.type} · ${formatCurrency(l.amount)}`} badge={l.status} />
          ))}
          {!store.loans.filter((l) => ids.includes(l.customerId)).length && (
            <p className="text-sm text-slate-500">No active loan applications.</p>
          )}
        </Panel>
      </div>
    </div>
  )
}
