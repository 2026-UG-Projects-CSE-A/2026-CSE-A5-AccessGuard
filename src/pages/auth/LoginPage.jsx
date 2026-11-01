import { Eye, EyeOff, Shield, ShieldCheck, Lock, Users, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../../data/seed'
import { ROLE_LABELS } from '../../utils/permissions'
import Logo from '../../components/layout/Logo'

const FEATURE_BULLETS = [
  { icon: Shield,    text: 'Role-based permission engine' },
  { icon: ShieldCheck, text: 'Independent transaction approvals' },
  { icon: Lock,      text: 'Append-only audit trail' },
  { icon: Users,     text: 'Multi-role personas' },
  { icon: BarChart3, text: 'Branch & portfolio dashboards' },
]

export default function LoginPage() {
  const { currentUser, login, loading } = useApp()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  if (currentUser) return <Navigate to="/dashboard" replace />

  const validate = () => {
    const next = {}
    if (!identifier.trim()) next.identifier = 'Enter your email or username.'
    if (!password) next.password = 'Enter the password.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!validate()) return
    const result = await login({ identifier, password })
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/dashboard')
  }

  const fill = (email) => {
    setIdentifier(email)
    setPassword(DEMO_PASSWORD)
    setError('')
    setFieldErrors({})
  }

  return (
    <div className="min-h-svh bg-navy-950 lg:grid lg:grid-cols-[1fr_480px]">

      {/* ── Hero / Branding Panel ─────────────────────────────── */}
      <section className="login-hero relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex">

        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white opacity-[0.03]" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white opacity-[0.04]" />
        <div className="pointer-events-none absolute bottom-48 right-8 h-48 w-48 rounded-full bg-navy-600 opacity-20" />

        {/* Logo */}
        <div className="relative z-10">
          <Logo />
        </div>

        {/* Main copy */}
        <div className="relative z-10 max-w-lg">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-navy-300">
            Banking Management · Role-based access
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            Secure banking operations with&nbsp;
            <span className="text-navy-300">role-aware access</span>.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-navy-200">
            AccessGuard gives Super Admins, branch staff, customers, auditors,
            and credit teams role-specific modules and actions through a single
            permission engine.
          </p>

          <ul className="mt-8 space-y-3">
            {FEATURE_BULLETS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-navy-100">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={14} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

      </section>

      {/* ── Login Form Panel ──────────────────────────────────── */}
      <section className="flex min-h-svh items-center justify-center bg-white px-6 py-10 lg:min-h-0">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <div className="inline-flex rounded-xl bg-navy-900 p-3">
              <Logo />
            </div>
          </div>

          {/* Status badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber-500" />
            active
          </span>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-navy-900">
            Sign in to AccessGuard
          </h2>

          {/* ── Form ── */}
          <form className="mt-7 space-y-4" onSubmit={submit} noValidate>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="login-identifier">
                Email or username
              </label>
              <input
                id="login-identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. admin@accessguard.example"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-600 ${fieldErrors.identifier ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
              />
              {fieldErrors.identifier && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.identifier}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full rounded-lg border px-3.5 py-2.5 pr-11 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-600 ${fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-navy-800 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* ── Quick sign-in ── */}
          <div className="mt-8">
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-slate-200" />
              <p className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-400">
                Quick sign-in
              </p>
              <hr className="flex-1 border-slate-200" />
            </div>

            <div className="mt-3 grid gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fill(account.email)}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left hover:border-navy-300 hover:bg-navy-50"
                >
                  <span>
                    <span className="block text-sm font-medium text-navy-900">{account.name}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-700">
                    {ROLE_LABELS[account.role]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
