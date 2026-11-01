import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { hasPermission } from '../../utils/permissions'
import { NAV_ITEMS } from './navConfig'
import Logo from './Logo'

export default function Sidebar({ collapsed, onToggle, mobileOpen, onClose }) {
  const { currentRole, store } = useApp()
  const items = NAV_ITEMS.filter((item) => item.permissions.some((permission) => hasPermission(currentRole, permission, store.rolePermissions)))

  return (
    <>
      {mobileOpen ? <button type="button" className="fixed inset-0 z-30 bg-navy-950/40 lg:hidden" aria-label="Close navigation overlay" onClick={onClose} /> : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-navy-900 text-white transition-all duration-200 ${
          collapsed ? 'w-[4.5rem]' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex h-16 items-center justify-between px-3">
          <Logo compact={collapsed} />
          <button type="button" className="hidden rounded-md p-1 text-navy-200 hover:bg-navy-800 lg:block" onClick={onToggle} aria-label="Collapse sidebar">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-800'}`
                }
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </NavLink>
            )
          })}
        </nav>
        <p className="px-4 py-3 text-[11px] text-navy-300">Frontend RBAC · not production security</p>
      </aside>
    </>
  )
}
