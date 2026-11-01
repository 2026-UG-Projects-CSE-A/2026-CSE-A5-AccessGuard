/**
 * StatCard — Metric summary card with optional icon, hint, trend, and color accent.
 *
 * Props:
 *   label       string  — descriptive label shown above the value
 *   value       string|number
 *   hint        string  — secondary caption below the value
 *   icon        LucideIcon component
 *   accent      'blue' | 'green' | 'amber' | 'red' | 'purple'  (default 'blue')
 *   trend       number  — positive = up arrow, negative = down arrow (optional)
 *   trendLabel  string  — text beside the trend arrow
 */

const ACCENT_ICON = {
  blue:   'bg-navy-100 text-navy-700',
  green:  'bg-emerald-50 text-emerald-700',
  amber:  'bg-amber-50 text-amber-700',
  red:    'bg-red-50 text-red-700',
  purple: 'bg-purple-50 text-purple-700',
}

export default function StatCard({ label, value, hint, icon: Icon, accent = 'blue', trend, trendLabel }) {
  const iconStyle = ACCENT_ICON[accent] || ACCENT_ICON.blue
  const accentBar = `stat-accent stat-accent-${accent}`

  return (
    <article className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm card-hover ${accentBar} animate-fade-in`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-navy-900">{value}</p>

          {/* Trend indicator */}
          {trend !== undefined ? (
            <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              <span>{trend >= 0 ? '▲' : '▼'}</span>
              {trendLabel || `${Math.abs(trend)}%`}
            </p>
          ) : hint ? (
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          ) : null}
        </div>

        {Icon ? (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
            <Icon size={20} />
          </span>
        ) : null}
      </div>
    </article>
  )
}
