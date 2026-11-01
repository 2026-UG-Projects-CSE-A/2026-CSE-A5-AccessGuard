import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { useApp } from '../context/AppContext'
import AccessDeniedPage from '../pages/auth/AccessDeniedPage'
import LoginPage from '../pages/auth/LoginPage'
import AccountDetailPage from '../pages/accounts/AccountDetailPage'
import AccountsPage from '../pages/accounts/AccountsPage'
import ApprovalsPage from '../pages/approvals/ApprovalsPage'
import AuditLogsPage from '../pages/audit/AuditLogsPage'
import SecurityMonitoringPage from '../pages/audit/SecurityMonitoringPage'
import BranchesPage from '../pages/branches/BranchesPage'
import CustomersPage from '../pages/customers/CustomersPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import EmployeesPage from '../pages/employees/EmployeesPage'
import LoansPage from '../pages/loans/LoansPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfilePage from '../pages/profile/ProfilePage'
import AuthorizationPage from '../pages/roles/AuthorizationPage'
import RolesPage from '../pages/roles/RolesPage'
import TransactionDetailPage from '../pages/transactions/TransactionDetailPage'
import TransactionsPage from '../pages/transactions/TransactionsPage'
import UsersPage from '../pages/users/UsersPage'
import { PERMISSIONS } from '../utils/permissions'
import ProtectedRoute from './ProtectedRoute'

function Guard({ permissions, children }) {
  return (
    <ProtectedRoute permissions={permissions}>
      {children}
    </ProtectedRoute>
  )
}

export default function AppRoutes() {
  const { currentUser } = useApp()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <Guard permissions={[PERMISSIONS.DASHBOARD_VIEW]}>
            <AppLayout />
          </Guard>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<Guard permissions={[PERMISSIONS.USERS_VIEW]}><UsersPage /></Guard>} />
        <Route path="roles-permissions" element={<Guard permissions={[PERMISSIONS.ROLES_VIEW]}><RolesPage /></Guard>} />
        <Route path="authorization" element={<Guard permissions={[PERMISSIONS.AUTHORIZATION_VIEW]}><AuthorizationPage /></Guard>} />
        <Route path="accounts" element={<Guard permissions={[PERMISSIONS.ACCOUNTS_VIEW, PERMISSIONS.ACCOUNTS_VIEW_OWN]}><AccountsPage /></Guard>} />
        <Route path="accounts/:id" element={<Guard permissions={[PERMISSIONS.ACCOUNTS_VIEW, PERMISSIONS.ACCOUNTS_VIEW_OWN]}><AccountDetailPage /></Guard>} />
        <Route path="transactions" element={<Guard permissions={[PERMISSIONS.TRANSACTIONS_VIEW, PERMISSIONS.TRANSACTIONS_VIEW_OWN]}><TransactionsPage /></Guard>} />
        <Route path="transactions/:id" element={<Guard permissions={[PERMISSIONS.TRANSACTIONS_VIEW, PERMISSIONS.TRANSACTIONS_VIEW_OWN]}><TransactionDetailPage /></Guard>} />
        <Route path="approvals" element={<Guard permissions={[PERMISSIONS.APPROVALS_VIEW]}><ApprovalsPage /></Guard>} />
        <Route path="loans" element={<Guard permissions={[PERMISSIONS.LOANS_VIEW, PERMISSIONS.LOANS_VIEW_OWN]}><LoansPage /></Guard>} />
        <Route path="customers" element={<Guard permissions={[PERMISSIONS.CUSTOMERS_VIEW]}><CustomersPage /></Guard>} />
        <Route path="branches" element={<Guard permissions={[PERMISSIONS.BRANCHES_VIEW]}><BranchesPage /></Guard>} />
        <Route path="employees" element={<Guard permissions={[PERMISSIONS.EMPLOYEES_VIEW]}><EmployeesPage /></Guard>} />
        <Route path="audit-logs" element={<Guard permissions={[PERMISSIONS.AUDIT_VIEW]}><AuditLogsPage /></Guard>} />
        <Route path="security-monitoring" element={<Guard permissions={[PERMISSIONS.SECURITY_VIEW]}><SecurityMonitoringPage /></Guard>} />
        <Route path="profile" element={<Guard permissions={[PERMISSIONS.PROFILE_VIEW]}><ProfilePage /></Guard>} />
        <Route path="access-denied" element={<AccessDeniedPage />} />
      </Route>
      <Route path="*" element={currentUser ? <NotFoundPage /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}
