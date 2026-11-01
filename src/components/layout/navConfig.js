import {
  LayoutDashboard,
  Users,
  Shield,
  KeyRound,
  Wallet,
  ArrowLeftRight,
  ClipboardCheck,
  Landmark,
  Building2,
  IdCard,
  ScrollText,
  Bell,
  UserRound,
} from 'lucide-react'
import { PERMISSIONS } from '../../utils/permissions'

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permissions: [PERMISSIONS.DASHBOARD_VIEW] },
  { to: '/users', label: 'Users', icon: Users, permissions: [PERMISSIONS.USERS_VIEW] },
  { to: '/roles-permissions', label: 'Roles & Permissions', icon: Shield, permissions: [PERMISSIONS.ROLES_VIEW] },
  { to: '/authorization', label: 'Authorization Engine', icon: KeyRound, permissions: [PERMISSIONS.AUTHORIZATION_VIEW] },
  { to: '/accounts', label: 'Accounts', icon: Wallet, permissions: [PERMISSIONS.ACCOUNTS_VIEW, PERMISSIONS.ACCOUNTS_VIEW_OWN] },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight, permissions: [PERMISSIONS.TRANSACTIONS_VIEW, PERMISSIONS.TRANSACTIONS_VIEW_OWN] },
  { to: '/approvals', label: 'Approvals', icon: ClipboardCheck, permissions: [PERMISSIONS.APPROVALS_VIEW] },
  { to: '/loans', label: 'Loans', icon: Landmark, permissions: [PERMISSIONS.LOANS_VIEW, PERMISSIONS.LOANS_VIEW_OWN] },
  { to: '/customers', label: 'Customers', icon: UserRound, permissions: [PERMISSIONS.CUSTOMERS_VIEW] },
  { to: '/branches', label: 'Branches', icon: Building2, permissions: [PERMISSIONS.BRANCHES_VIEW] },
  { to: '/employees', label: 'Employees', icon: IdCard, permissions: [PERMISSIONS.EMPLOYEES_VIEW] },
  { to: '/audit-logs', label: 'Audit Logs', icon: ScrollText, permissions: [PERMISSIONS.AUDIT_VIEW] },
  { to: '/security-monitoring', label: 'Security Monitoring', icon: Bell, permissions: [PERMISSIONS.SECURITY_VIEW] },
]
