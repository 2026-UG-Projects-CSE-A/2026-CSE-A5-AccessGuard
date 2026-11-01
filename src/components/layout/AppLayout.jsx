import { Bell, ChevronDown, LogOut, Menu, RotateCcw, Search, ShieldAlert, UserRound, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { canAccessAny, ROLE_LABELS } from '../../utils/permissions'
import { initials } from '../../utils/format'
import ConfirmDialog from '../common/ConfirmDialog'
import Logo from './Logo'
import { NAV_ITEMS } from './navConfig'

const TITLES = {
  '/dashboard':            'Dashboard',
  '/users':                'User Management',
  '/roles-permissions':    'Roles & Permissions',
  '/authorization':        'Authorization Engine',
  '/accounts':             'Accounts',
  '/transactions':         'Transactions',
  '/approvals':            'Approval Queue',
  '/loans':                'Loan Management',
  '/customers':            'Customers',
  '/branches':             'Branches',
  '/employees':            'Employees',
  '/audit-logs':           'Audit Logs',
  '/security-monitoring':  'Security Monitoring',
  '/profile':              'My Profile',
  '/access-denied':        'Access Denied',
}

const ROLE_BADGE_STYLE = {
  SUPER_ADMIN:           'bg-purple-100 text-purple-800',
  BRANCH_MANAGER:        'bg-navy-100 text-navy-800',
  BANK_TELLER:           'bg-sky-100 text-sky-800',
  CUSTOMER:              'bg-emerald-100 text-emerald-800',
  AUDITOR:               'bg-amber-100 text-amber-800',
  LOAN_OFFICER:          'bg-orange-100 text-orange-800',
  RELATIONSHIP_MANAGER:  'bg-indigo-100 text-indigo-800',
}

export default function AppLayout() {
  const { store, currentUser, currentRole, can, logout, switchRole, resetDemo, markNotificationsRead } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed]     = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [notesOpen, setNotesOpen]     = useState(false)
  const [switchOpen, setSwitchOpen]   = useState(false)
  const [resetOpen, setResetOpen]     = useState(false)
  const [query, setQuery]             = useState('')

  const visibleNav = NAV_ITEMS.filter((item) => canAccessAny(currentRole, item.permissions, store.rolePermissions))
  const title      = Object.entries(TITLES).find(([path]) => location.pathname === path || location.pathname.startsWith(`${path}/`))?.[1] || 'AccessGuard'
  const unread     = store.notifications.filter((item) => !item.read).length
  const activeUsers  = store.users.filter((user) => user.status === 'Active')
  const roleBadge  = ROLE_BADGE_STYLE[currentRole] || 'bg-slate-100 text-slate-700'

  const searchHits = useMemo(() => {
    if (query.trim().length < 2) return []
    const q = query.toLowerCase()
    return [
      ...store.customers.filter((item) => item.name.toLowerCase().includes(q)).map((item) => ({ to: '/customers', label: `Customer · ${item.name}` })),
      ...store.accounts.filter((item) => item.accountNumber.includes(q.replace(/\s/g, ''))).map((item) => ({ to: `/accounts/${item.id}`, label: `Account · ${item.accountNumber}` })),
      ...store.transactions.filter((item) => item.reference.toLowerCase().includes(q)).map((item) => ({ to: `/transactions/${item.id}`, label: item.reference })),
    ].slice(0, 6)
  }, [query, store.accounts, store.customers, store.transactions])

  /* ── Sidebar markup (shared between desktop & mobile overlay) ── */
  const sidebar = (
    <aside
      className={`sidebar-gradient flex h-full flex-col text-navy-50 transition-all duration-200 ${collapsed ? 'w-[72px]' : 'w-64'}`}
    >
      {/* Logo row */}
      <div className={`flex h-16 items-center border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
        <Logo compact={collapsed} />
        <button
          type="button"
          className="hidden rounded-md p-1.5 text-navy-300 hover:bg-white/10 lg:flex"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {visibleNav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-navy-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed ? <span>{item.label}</span> : <span className="sr-only">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3 text-[11px] text-navy-400">
        {!collapsed ? 'AccessGuard · Role-based access' : '•••'}
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-svh bg-surface">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden animate-fade-in">
          <div className="h-full">{sidebar}</div>
          <button
            type="button"
            className="flex-1 bg-navy-950/50 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* ── Top Header ────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">

          {/* Mobile menu button */}
          <button
            type="button"
            className="rounded-md p-2 text-navy-700 hover:bg-navy-50 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb / page title */}
          <div className="min-w-0 flex-1">
            <p className="hidden text-xs text-slate-400 md:block">
              AccessGuard <span className="mx-1 text-slate-300">/</span>
              <span className="text-slate-600">{title}</span>
            </p>
            <h1 className="truncate text-sm font-semibold text-navy-900 md:text-base">{title}</h1>
          </div>

          {/* Search bar */}
          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers, accounts, TXN…"
              className="w-72 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm placeholder:text-slate-400 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-400"
            />
            {searchHits.length > 0 && (
              <div className="absolute top-11 w-full rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
                {searchHits.map((hit) => (
                  <button
                    key={hit.to + hit.label}
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-navy-900 hover:bg-navy-50"
                    onClick={() => { navigate(hit.to); setQuery('') }}
                  >
                    {hit.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role badge */}
          <span className={`hidden shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${roleBadge}`}>
            {ROLE_LABELS[currentRole]}
          </span>

          {/* Notifications bell */}
          <div className="relative">
            <button
              type="button"
              className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100"
              onClick={() => { setNotesOpen((v) => !v); markNotificationsRead() }}
              aria-label="View notifications"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white pulse-dot" />
              )}
            </button>

            {notesOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white py-2 shadow-xl animate-fade-in">
                <p className="px-4 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Notifications</p>
                {store.notifications.map((item) => (
                  <div key={item.id} className={`px-4 py-2.5 hover:bg-slate-50 ${!item.read ? 'border-l-2 border-navy-600' : ''}`}>
                    <p className="text-sm font-medium text-navy-900">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile / account menu */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 hover:border-slate-300 hover:bg-slate-50"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open account menu"
              aria-expanded={menuOpen}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white">
                {initials(currentUser.name)}
              </span>
              <span className="hidden text-left lg:block">
                <span className="block text-sm font-medium text-navy-900 leading-tight">{currentUser.name}</span>
                <span className="block text-xs text-slate-500 leading-tight">{currentUser.email}</span>
              </span>
              <ChevronDown size={15} className="text-slate-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl animate-fade-in">
                {/* Identity row */}
                <div className="px-4 pb-2 pt-1 border-b border-slate-100">
                  <p className="text-sm font-semibold text-navy-900">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-navy-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserRound size={16} /> My Profile
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-navy-50"
                  onClick={() => { setMenuOpen(false); setSwitchOpen(true) }}
                >
                  <ShieldAlert size={16} /> Switch role
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-navy-50"
                  onClick={() => { setMenuOpen(false); setResetOpen(true) }}
                >
                  <RotateCcw size={16} /> Reset sample data
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── Page content ─────────────────────────────────────── */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* ── Role Switch Dialog ────────────────────────────────── */}
      {switchOpen === true && (
        <ConfirmDialog
          title="Switch role"
          message="This shortcut signs you in as another account without a password. The action is recorded in the audit log."
          confirmLabel="Open role list"
          onClose={() => setSwitchOpen(false)}
          onConfirm={() => setSwitchOpen('list')}
        />
      )}
      {switchOpen === 'list' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-base font-semibold text-navy-900">Switch role</h2>
            <p className="mt-1 text-sm text-slate-500">Select a persona — no password required for this shortcut.</p>
            <div className="mt-4 space-y-2">
              {activeUsers.filter((u) => ['u1','u2','u3','u4','u5','u6','u7'].includes(u.id)).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left hover:border-navy-300 hover:bg-navy-50 ${currentUser.id === user.id ? 'border-navy-400 bg-navy-50' : 'border-slate-200'}`}
                  onClick={() => { switchRole(user.id); setSwitchOpen(false); navigate('/dashboard') }}
                >
                  <span>
                    <span className="block text-sm font-medium text-navy-900">{user.name}</span>
                    <span className="block text-xs text-slate-500">{ROLE_LABELS[user.role]}</span>
                  </span>
                  {currentUser.id === user.id && (
                    <span className="rounded-full bg-navy-800 px-2 py-0.5 text-xs text-white">Current</span>
                  )}
                </button>
              ))}
            </div>
            <button type="button" className="mt-4 text-sm text-slate-500 hover:text-slate-700" onClick={() => setSwitchOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Reset Confirm ─────────────────────────────────────── */}
      {resetOpen && (
        <ConfirmDialog
          title="Reset sample data"
          message="This restores the original sample records and removes locally saved changes."
          confirmLabel="Reset data"
          tone="danger"
          onClose={() => setResetOpen(false)}
          onConfirm={() => { resetDemo(); setResetOpen(false); navigate('/dashboard') }}
        />
      )}
    </div>
  )
}
