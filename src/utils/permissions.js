export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  BANK_TELLER: 'BANK_TELLER',
  CUSTOMER: 'CUSTOMER',
  AUDITOR: 'AUDITOR',
  LOAN_OFFICER: 'LOAN_OFFICER',
  RELATIONSHIP_MANAGER: 'RELATIONSHIP_MANAGER',
}

export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  BRANCH_MANAGER: 'Branch Manager',
  BANK_TELLER: 'Bank Teller',
  CUSTOMER: 'Customer',
  AUDITOR: 'Auditor',
  LOAN_OFFICER: 'Loan Officer',
  RELATIONSHIP_MANAGER: 'Relationship Manager',
}

export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  USERS_VIEW: 'users.view',
  USERS_MANAGE: 'users.manage',
  ROLES_VIEW: 'roles.view',
  ROLES_MANAGE: 'roles.manage',
  AUTHORIZATION_VIEW: 'authorization.view',
  ACCOUNTS_VIEW: 'accounts.view',
  ACCOUNTS_VIEW_OWN: 'accounts.viewOwn',
  ACCOUNTS_CREATE: 'accounts.create',
  ACCOUNTS_MANAGE_STATUS: 'accounts.manageStatus',
  TRANSACTIONS_VIEW: 'transactions.view',
  TRANSACTIONS_VIEW_OWN: 'transactions.viewOwn',
  TRANSACTIONS_SUBMIT: 'transactions.submit',
  TRANSACTIONS_APPROVE: 'transactions.approve',
  TRANSACTIONS_COMPLETE: 'transactions.complete',
  APPROVALS_VIEW: 'approvals.view',
  LOANS_VIEW: 'loans.view',
  LOANS_VIEW_OWN: 'loans.viewOwn',
  LOANS_APPLY: 'loans.apply',
  LOANS_REVIEW: 'loans.review',
  CUSTOMERS_VIEW: 'customers.view',
  BRANCHES_VIEW: 'branches.view',
  BRANCHES_MANAGE: 'branches.manage',
  EMPLOYEES_VIEW: 'employees.view',
  EMPLOYEES_MANAGE: 'employees.manage',
  AUDIT_VIEW: 'audit.view',
  AUDIT_EXPORT: 'audit.export',
  SECURITY_VIEW: 'security.view',
  PROFILE_VIEW: 'profile.view',
}

export const PERMISSION_META = [
  { id: PERMISSIONS.DASHBOARD_VIEW, module: 'Dashboard', action: 'View role dashboard', sensitive: false },
  { id: PERMISSIONS.USERS_VIEW, module: 'Users', action: 'View user records', sensitive: false },
  { id: PERMISSIONS.USERS_MANAGE, module: 'Users', action: 'Create, edit, activate or deactivate users', sensitive: true },
  { id: PERMISSIONS.ROLES_VIEW, module: 'Roles', action: 'View roles and permission matrix', sensitive: false },
  { id: PERMISSIONS.ROLES_MANAGE, module: 'Roles', action: 'Assign or revoke permissions', sensitive: true },
  { id: PERMISSIONS.AUTHORIZATION_VIEW, module: 'Authorization', action: 'Inspect allow/deny decisions', sensitive: false },
  { id: PERMISSIONS.ACCOUNTS_VIEW, module: 'Accounts', action: 'View all branch accounts', sensitive: false },
  { id: PERMISSIONS.ACCOUNTS_VIEW_OWN, module: 'Accounts', action: 'View own customer accounts', sensitive: false },
  { id: PERMISSIONS.ACCOUNTS_CREATE, module: 'Accounts', action: 'Create accounts', sensitive: true },
  { id: PERMISSIONS.ACCOUNTS_MANAGE_STATUS, module: 'Accounts', action: 'Freeze or activate accounts', sensitive: true },
  { id: PERMISSIONS.TRANSACTIONS_VIEW, module: 'Transactions', action: 'View all transactions', sensitive: false },
  { id: PERMISSIONS.TRANSACTIONS_VIEW_OWN, module: 'Transactions', action: 'View own transactions', sensitive: false },
  { id: PERMISSIONS.TRANSACTIONS_SUBMIT, module: 'Transactions', action: 'Submit deposits, withdrawals, transfers', sensitive: false },
  { id: PERMISSIONS.TRANSACTIONS_APPROVE, module: 'Transactions', action: 'Approve or reject pending transactions', sensitive: true },
  { id: PERMISSIONS.TRANSACTIONS_COMPLETE, module: 'Transactions', action: 'Complete approved transactions and update balances', sensitive: true },
  { id: PERMISSIONS.APPROVALS_VIEW, module: 'Approvals', action: 'View approval queue', sensitive: false },
  { id: PERMISSIONS.LOANS_VIEW, module: 'Loans', action: 'View loan applications', sensitive: false },
  { id: PERMISSIONS.LOANS_VIEW_OWN, module: 'Loans', action: 'View own loan applications', sensitive: false },
  { id: PERMISSIONS.LOANS_APPLY, module: 'Loans', action: 'Submit a loan application', sensitive: false },
  { id: PERMISSIONS.LOANS_REVIEW, module: 'Loans', action: 'Review, approve or reject loans', sensitive: true },
  { id: PERMISSIONS.CUSTOMERS_VIEW, module: 'Customers', action: 'View customer portfolio', sensitive: false },
  { id: PERMISSIONS.BRANCHES_VIEW, module: 'Branches', action: 'View branches', sensitive: false },
  { id: PERMISSIONS.BRANCHES_MANAGE, module: 'Branches', action: 'Update branch records', sensitive: true },
  { id: PERMISSIONS.EMPLOYEES_VIEW, module: 'Employees', action: 'View employees', sensitive: false },
  { id: PERMISSIONS.EMPLOYEES_MANAGE, module: 'Employees', action: 'Update employee assignments', sensitive: true },
  { id: PERMISSIONS.AUDIT_VIEW, module: 'Audit', action: 'View audit events', sensitive: false },
  { id: PERMISSIONS.AUDIT_EXPORT, module: 'Audit', action: 'Export audit CSV', sensitive: false },
  { id: PERMISSIONS.SECURITY_VIEW, module: 'Security', action: 'View security monitoring', sensitive: false },
  { id: PERMISSIONS.PROFILE_VIEW, module: 'Profile', action: 'View and update own profile', sensitive: false },
]

export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.BRANCH_MANAGER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.AUTHORIZATION_VIEW,
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.ACCOUNTS_CREATE,
    PERMISSIONS.ACCOUNTS_MANAGE_STATUS,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.TRANSACTIONS_SUBMIT,
    PERMISSIONS.TRANSACTIONS_APPROVE,
    PERMISSIONS.TRANSACTIONS_COMPLETE,
    PERMISSIONS.APPROVALS_VIEW,
    PERMISSIONS.LOANS_VIEW,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.BRANCHES_VIEW,
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.PROFILE_VIEW,
  ],
  [ROLES.BANK_TELLER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.AUTHORIZATION_VIEW,
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.TRANSACTIONS_SUBMIT,
    PERMISSIONS.LOANS_VIEW,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.BRANCHES_VIEW,
    PERMISSIONS.PROFILE_VIEW,
  ],
  [ROLES.CUSTOMER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ACCOUNTS_VIEW_OWN,
    PERMISSIONS.TRANSACTIONS_VIEW_OWN,
    PERMISSIONS.TRANSACTIONS_SUBMIT,
    PERMISSIONS.LOANS_VIEW_OWN,
    PERMISSIONS.LOANS_APPLY,
    PERMISSIONS.PROFILE_VIEW,
  ],
  [ROLES.AUDITOR]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.AUTHORIZATION_VIEW,
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.LOANS_VIEW,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.BRANCHES_VIEW,
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_EXPORT,
    PERMISSIONS.SECURITY_VIEW,
    PERMISSIONS.PROFILE_VIEW,
  ],
  [ROLES.LOAN_OFFICER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.AUTHORIZATION_VIEW,
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.LOANS_VIEW,
    PERMISSIONS.LOANS_REVIEW,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.PROFILE_VIEW,
  ],
  [ROLES.RELATIONSHIP_MANAGER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.AUTHORIZATION_VIEW,
    PERMISSIONS.ACCOUNTS_VIEW,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.LOANS_VIEW,
    PERMISSIONS.LOANS_APPLY,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.PROFILE_VIEW,
  ],
}

export function getRolePermissions(role, overrides = {}) {
  if (overrides[role]) return overrides[role]
  return DEFAULT_ROLE_PERMISSIONS[role] || []
}

export function hasPermission(role, permission, overrides = {}) {
  if (!role || !permission) return false
  return getRolePermissions(role, overrides).includes(permission)
}

export function explainPermission(role, permission, overrides = {}) {
  const meta = PERMISSION_META.find((item) => item.id === permission)
  const allowed = hasPermission(role, permission, overrides)
  const label = ROLE_LABELS[role] || role
  const action = meta ? `${meta.module}: ${meta.action}` : permission
  if (allowed) {
    return {
      allowed: true,
      reason: `${label} is granted “${action}” by the current permission matrix.`,
    }
  }
  return {
    allowed: false,
    reason: `${label} is denied “${action}”`,
  }
}

export function canAccessAny(role, permissions, overrides = {}) {
  return permissions.some((permission) => hasPermission(role, permission, overrides))
}
