import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { canAccessAny } from '../utils/permissions'
import { useEffect, useRef } from 'react'

export default function ProtectedRoute({ permissions, children }) {
  const { currentUser, currentRole, store, logDenied } = useApp()
  const location = useLocation()
  const logged = useRef('')

  useEffect(() => {
    if (currentUser && permissions?.length && !canAccessAny(currentRole, permissions, store.rolePermissions)) {
      const key = `${currentUser.id}:${location.pathname}`
      if (logged.current !== key) {
        logged.current = key
        logDenied(permissions.join(', '), location.pathname)
      }
    }
  }, [currentRole, currentUser, location.pathname, logDenied, permissions, store.rolePermissions])

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (permissions?.length && !canAccessAny(currentRole, permissions, store.rolePermissions)) {
    return <Navigate to="/access-denied" replace state={{ from: location.pathname, permissions }} />
  }
  return children
}
