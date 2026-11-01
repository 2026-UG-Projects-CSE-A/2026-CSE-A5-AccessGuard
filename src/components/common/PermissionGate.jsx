import { useApp } from '../../context/AppContext'

export default function PermissionGate({ permission, children, fallback = null }) {
  const { can } = useApp()
  if (!can(permission)) return fallback
  return children
}
