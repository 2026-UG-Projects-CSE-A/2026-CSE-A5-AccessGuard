/**
 * Logo — AccessGuard brand mark.
 * compact=true  → shield icon only (for collapsed sidebar)
 * dark=false    → white text (default for sidebar)
 * dark=true     → dark text (for light backgrounds)
 */
export default function Logo({ compact = false, dark = false }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Shield icon */}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M12 3L20 7V13C20 17.4 16.5 21 12 22.5C7.5 21 4 17.4 4 13V7L12 3Z"
            fill="currentColor"
            className="text-white"
            opacity="0.2"
          />
          <path
            d="M12 5.5L18 8.5V13C18 16.5 15.3 19.3 12 20.5C8.7 19.3 6 16.5 6 13V8.5L12 5.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-white"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 12.5L11.5 14.5L14.8 10.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          />
        </svg>
      </span>

      {!compact && (
        <span>
          <span className={`block text-sm font-semibold leading-tight tracking-tight ${dark ? 'text-navy-900' : 'text-white'}`}>
            AccessGuard
          </span>
          <span className={`block text-[11px] leading-tight ${dark ? 'text-slate-500' : 'text-navy-300'}`}>
            Secure Banking RBAC
          </span>
        </span>
      )}
    </div>
  )
}
