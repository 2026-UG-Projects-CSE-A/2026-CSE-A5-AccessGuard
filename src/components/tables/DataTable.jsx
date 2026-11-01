import { useMemo, useState } from 'react'
import EmptyState from '../common/EmptyState'

export default function DataTable({ columns, rows, pageSize = 8, emptyTitle = 'No records found' }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    if (!sortKey) return rows
    return [...rows].sort((a, b) => {
      const left = a[sortKey]
      const right = b[sortKey]
      if (left == null) return 1
      if (right == null) return -1
      if (typeof left === 'number' && typeof right === 'number') return sortDir === 'asc' ? left - right : right - left
      return sortDir === 'asc' ? String(left).localeCompare(String(right)) : String(right).localeCompare(String(left))
    })
  }, [rows, sortKey, sortDir])

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, pages - 1)
  const slice = sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize)

  const toggleSort = (key, sortable) => {
    if (!sortable) return
    if (sortKey === key) setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (!rows.length) return <EmptyState title={emptyTitle} description="Try another search or filter." />

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    className={`text-left ${column.sortable ? 'hover:text-navy-800' : 'cursor-default'}`}
                    onClick={() => toggleSort(column.key, column.sortable)}
                  >
                    {column.header}
                    {sortKey === column.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 hover:bg-navy-50/40">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 align-middle text-slate-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
        <span>
          {sorted.length} record{sorted.length === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded border border-slate-300 px-2 py-1 disabled:opacity-40" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>
            Previous
          </button>
          <span>
            {currentPage + 1} / {pages}
          </span>
          <button type="button" className="rounded border border-slate-300 px-2 py-1 disabled:opacity-40" disabled={currentPage >= pages - 1} onClick={() => setPage(currentPage + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
