import { useMemo, useState } from 'react'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useApp } from '../../context/AppContext'
import { PERMISSION_META, ROLE_LABELS, ROLES } from '../../utils/permissions'

export default function RolesPage() {
  const { store, can, updateRolePermissions } = useApp()
  const [selected, setSelected] = useState(ROLES.BANK_TELLER)
  const [draft, setDraft] = useState(store.rolePermissions[ROLES.BANK_TELLER])
  const [confirm, setConfirm] = useState(false)

  const modules = useMemo(() => [...new Set(PERMISSION_META.map((item) => item.module))], [])

  const selectRole = (role) => {
    setSelected(role)
    setDraft(store.rolePermissions[role])
  }

  const toggle = (permissionId) => {
    setDraft((current) => (current.includes(permissionId) ? current.filter((id) => id !== permissionId) : [...current, permissionId]))
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
      <aside className="space-y-2">
        {store.roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => selectRole(role.id)}
            className={`block w-full rounded-lg border px-3 py-2 text-left text-sm ${selected === role.id ? 'border-navy-700 bg-navy-50' : 'border-slate-200 bg-white'}`}
          >
            <span className="block font-medium text-navy-900">{role.name}</span>
            <span className="text-xs text-slate-500">{store.rolePermissions[role.id].length} permissions</span>
          </button>
        ))}
      </aside>
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-navy-900">{ROLE_LABELS[selected]}</h2>
            <p className="text-sm text-slate-500">{store.roles.find((role) => role.id === selected)?.description}</p>
          </div>
          {can('roles.manage') && selected !== ROLES.SUPER_ADMIN ? (
            <button type="button" className="rounded-lg bg-navy-800 px-3 py-2 text-sm text-white" onClick={() => setConfirm(true)}>Save permission changes</button>
          ) : (
            <p className="text-xs text-slate-500">{selected === ROLES.SUPER_ADMIN ? 'Super Admin permissions are locked.' : 'You can view this matrix but cannot change it.'}</p>
          )}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500">
                <th className="py-2">Module</th>
                <th>Action</th>
                <th>Granted</th>
              </tr>
            </thead>
            <tbody>
              {modules.flatMap((module) =>
                PERMISSION_META.filter((item) => item.module === module).map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="py-2 pr-4 font-medium">{module}</td>
                    <td className="pr-4">{item.action}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={draft.includes(item.id)}
                        disabled={!can('roles.manage') || selected === ROLES.SUPER_ADMIN}
                        onChange={() => toggle(item.id)}
                        aria-label={`Toggle ${item.action}`}
                      />
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </section>
      {confirm ? (
        <ConfirmDialog
          title="Update permissions"
          message={`This revokes or grants frontend permissions for ${ROLE_LABELS[selected]}`}
          onClose={() => setConfirm(false)}
          onConfirm={() => {
            updateRolePermissions(selected, draft)
            setConfirm(false)
          }}
        />
      ) : null}
    </div>
  )
}
