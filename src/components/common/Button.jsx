/**
 * Button — Reusable button component with variants and sizes.
 *
 * Props:
 *   variant  'primary' | 'secondary' | 'ghost' | 'danger'
 *   size     'sm' | 'md' | 'lg'
 *   icon     LucideIcon (shown left of label)
 *   loading  boolean
 *   ...rest  all native button props
 */

const VARIANTS = {
  primary:   'bg-navy-800 text-white hover:bg-navy-900 focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:ring-offset-1 disabled:opacity-60',
  secondary: 'bg-white text-navy-800 border border-slate-300 hover:bg-navy-50 disabled:opacity-60',
  ghost:     'text-navy-700 hover:bg-navy-50 disabled:opacity-60',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 disabled:opacity-60',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
}

export default function Button({ variant = 'primary', size = 'md', icon: Icon, loading, children, className = '', ...rest }) {
  return (
    <button
      type="button"
      disabled={loading || rest.disabled}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : 16} className="shrink-0" />
      ) : null}
      {children}
    </button>
  )
}
