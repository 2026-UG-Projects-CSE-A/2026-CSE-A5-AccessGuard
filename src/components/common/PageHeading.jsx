/**
 * PageHeading — Reusable section heading with optional breadcrumb, description, and action slot.
 *
 * Props:
 *   title        string  — main heading text
 *   description  string  — optional subtitle / description
 *   breadcrumb   Array<{ label, to? }>  — breadcrumb trail (optional)
 *   actions      ReactNode — right-side action buttons slot
 */
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PageHeading({ title, description, breadcrumb, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 animate-fade-in">
      <div>
        {breadcrumb?.length ? (
          <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-1 text-xs text-slate-500">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="text-slate-400" />}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-navy-700">{crumb.label}</Link>
                ) : (
                  <span className="text-slate-700 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        <h1 className="text-xl font-semibold tracking-tight text-navy-900">{title}</h1>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
