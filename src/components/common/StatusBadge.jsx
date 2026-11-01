const STYLES = {
  Active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  Frozen: 'bg-amber-50 text-amber-800 border-amber-200',
  Pending: 'bg-amber-50 text-amber-800 border-amber-200',
  Approved: 'bg-sky-50 text-sky-800 border-sky-200',
  Rejected: 'bg-red-50 text-red-800 border-red-200',
  Completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Under Review': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  Success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Failed: 'bg-red-50 text-red-800 border-red-200',
  Denied: 'bg-red-50 text-red-800 border-red-200',
  Info: 'bg-slate-100 text-slate-700 border-slate-200',
  Medium: 'bg-amber-50 text-amber-800 border-amber-200',
  High: 'bg-red-50 text-red-800 border-red-200',
  Low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Open: 'bg-sky-50 text-sky-800 border-sky-200',
  'In Progress': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  Done: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Verified: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Received: 'bg-emerald-50 text-emerald-800 border-emerald-200',
}

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[value] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {value}
    </span>
  )
}
