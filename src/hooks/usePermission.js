import { useApp } from '../context/AppContext'

export function usePermission(permission) {
  const { can, explain } = useApp()
  return {
    allowed: can(permission),
    ...explain(permission),
  }
}
