import { Link } from 'react-router-dom'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useApp } from '../../context/AppContext'
import { downloadCsv } from '../../utils/csv'
import { formatDate } from '../../utils/format'
import PermissionGate from '../../components/common/PermissionGate'
import { PERMISSIONS } from '../../utils/permissions'

export default function SecurityMonitoringPage() {
  const { store } = useApp()
  const denied = store.auditLogs.filter((item) => item.action === 'ACCESS_DENIED' || item.status === 'Denied')
  const failedLogins = store.auditLogs.filter((item) => item.action === 'LOGIN' && item.status === 'Failed')
  const permChanges = store.auditLogs.filter((item) => item.action === 'PERMISSION_CHANGE')
  const alerts = [...denied, ...failedLogins, ...permChanges].sort((a, b) => new Date(b.at) - new Date(a.at))

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Denied access attempts" value={denied.length} />
        <StatCard label="Failed logins" value={failedLogins.length} />
        <StatCard label="Permission changes" value={permChanges.length} />
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-navy-900">Security alerts</h2>
          <PermissionGate permission={PERMISSIONS.AUDIT_EXPORT}>
            <button type="button" className="text-sm text-navy-700" onClick={() => downloadCsv('accessguard-alerts.csv', alerts.map((item) => ({ at: item.at, action: item.action, status: item.status, details: item.details })))}>Export alerts CSV</button>
          </PermissionGate>
        </div>
        <div className="space-y-2">
          {alerts.length ? alerts.slice(0, 12).map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2">
              <div>
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-xs text-slate-500">{formatDate(item.at)} · {item.details}</p>
              </div>
              <StatusBadge value={item.severity} />
            </div>
          )) : <p className="text-sm text-slate-500">No alerts yet. Trigger Access Denied from a teller session to populate this list.</p>}
        </div>
        <Link to="/audit-logs" className="mt-3 inline-block text-sm text-navy-700">Open full audit log</Link>
      </section>
    </div>
  )
}
