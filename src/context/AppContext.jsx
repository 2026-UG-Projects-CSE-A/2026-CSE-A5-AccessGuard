import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { DEMO_PASSWORD } from '../data/seed'
import { loadSession, loadStore, resetStore, saveSession, saveStore } from '../services/storage'
import { explainPermission, hasPermission, PERMISSIONS, ROLE_LABELS } from '../utils/permissions'
import { createId } from '../utils/format'
import { useToast } from './ToastContext'

const AppContext = createContext(null)

function persist(next) {
  saveStore(next)
  return next
}

function addAudit(store, entry) {
  const event = {
    id: createId('au'),
    at: new Date().toISOString(),
    status: 'Success',
    severity: 'Info',
    ...entry,
  }
  return { ...store, auditLogs: [event, ...store.auditLogs] }
}

export function AppProvider({ children }) {
  const { push } = useToast()
  const [store, setStore] = useState(() => loadStore())
  const [session, setSession] = useState(() => loadSession())
  const [loading, setLoading] = useState(false)

  const currentUser = store.users.find((user) => user.id === session?.userId) || null
  const currentRole = currentUser?.role || null

  const can = useCallback(
    (permission) => hasPermission(currentRole, permission, store.rolePermissions),
    [currentRole, store.rolePermissions],
  )

  const explain = useCallback(
    (permission) => explainPermission(currentRole, permission, store.rolePermissions),
    [currentRole, store.rolePermissions],
  )

  const mutate = useCallback((updater) => {
    setStore((current) => persist(updater(current)))
  }, [])

  const logDenied = useCallback(
    (permission, path) => {
      if (!currentUser) return
      mutate((current) =>
        addAudit(current, {
          actorId: currentUser.id,
          actorRole: currentUser.role,
          action: 'ACCESS_DENIED',
          target: path || permission,
          status: 'Denied',
          severity: 'High',
          details: `Attempted “${permission}” without authorization.`,
        }),
      )
    },
    [currentUser, mutate],
  )

  const login = useCallback(
    async ({ identifier, password }) => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 400))
      const match = store.users.find(
        (user) =>
          user.email.toLowerCase() === identifier.trim().toLowerCase() ||
          user.username.toLowerCase() === identifier.trim().toLowerCase(),
      )
      if (!match) {
        setLoading(false)
        return { ok: false, error: 'No account matches that email or username.' }
      }
      if (match.status !== 'Active') {
        setLoading(false)
        return { ok: false, error: 'This account is deactivated.' }
      }
      if (password !== DEMO_PASSWORD) {
        setLoading(false)
        mutate((current) =>
          addAudit(current, {
            actorId: match.id,
            actorRole: match.role,
            action: 'LOGIN',
            target: 'Session',
            status: 'Failed',
            severity: 'Medium',
            details: 'Incorrect password.',
          }),
        )
        return { ok: false, error: 'Incorrect password.' }
      }
      const nextSession = { userId: match.id, startedAt: new Date().toISOString() }
      setSession(nextSession)
      saveSession(nextSession)
      mutate((current) => {
        const withLogin = {
          ...current,
          users: current.users.map((user) => (user.id === match.id ? { ...user, lastLogin: new Date().toISOString() } : user)),
        }
        return addAudit(withLogin, {
          actorId: match.id,
          actorRole: match.role,
          action: 'LOGIN',
          target: 'Session',
          details: `${match.name} signed in as ${ROLE_LABELS[match.role]}.`,
        })
      })
      setLoading(false)
      push(`Signed in as ${ROLE_LABELS[match.role]}`)
      return { ok: true, user: match }
    },
    [mutate, push, store.users],
  )

  const logout = useCallback(() => {
    if (currentUser) {
      mutate((current) =>
        addAudit(current, {
          actorId: currentUser.id,
          actorRole: currentUser.role,
          action: 'LOGOUT',
          target: 'Session',
          details: `${currentUser.name} signed out.`,
        }),
      )
    }
    setSession(null)
    saveSession(null)
    push('Signed out of the session')
  }, [currentUser, mutate, push])

  const switchRole = useCallback(
    (userId) => {
      const user = store.users.find((item) => item.id === userId)
      if (!user || user.status !== 'Active') {
        push('Cannot switch to an inactive account', 'error')
        return
      }
      const nextSession = { userId: user.id, startedAt: new Date().toISOString() }
      setSession(nextSession)
      saveSession(nextSession)
      mutate((current) =>
        addAudit(current, {
          actorId: user.id,
          actorRole: user.role,
          action: 'DEMO_ROLE_SWITCH',
          target: user.email,
          severity: 'Medium',
          details: `Role switched to ${ROLE_LABELS[user.role]}. `,
        }),
      )
      push(`Now presenting as ${ROLE_LABELS[user.role]}`, 'warning')
    },
    [mutate, push, store.users],
  )

  const resetDemo = useCallback(() => {
    const seed = resetStore()
    setStore(seed)
    if (session?.userId) {
      const stillExists = seed.users.find((user) => user.id === session.userId)
      if (!stillExists) {
        setSession(null)
        saveSession(null)
      }
    }
    push('Sample data restored to the original dataset')
  }, [push, session])

  const recordAudit = useCallback(
    (entry) => {
      mutate((current) => addAudit(current, entry))
    },
    [mutate],
  )

  const saveUser = useCallback(
    (payload) => {
      if (!can(PERMISSIONS.USERS_MANAGE)) return { ok: false, error: 'You cannot manage users.' }
      mutate((current) => {
        const exists = current.users.find((user) => user.id === payload.id)
        let users
        if (exists) {
          users = current.users.map((user) => (user.id === payload.id ? { ...user, ...payload } : user))
        } else {
          users = [
            ...current.users,
            {
              id: createId('u'),
              status: 'Active',
              lastLogin: null,
              customerId: null,
              ...payload,
            },
          ]
        }
        return addAudit(
          { ...current, users },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: exists ? 'USER_UPDATE' : 'USER_CREATE',
            target: payload.email,
            details: exists ? `Updated user ${payload.name}.` : `Created user ${payload.name}.`,
          },
        )
      })
      push('User saved')
      return { ok: true }
    },
    [can, currentUser, mutate, push],
  )

  const setUserStatus = useCallback(
    (userId, status) => {
      if (!can(PERMISSIONS.USERS_MANAGE)) return { ok: false, error: 'Denied' }
      mutate((current) => {
        const users = current.users.map((user) => (user.id === userId ? { ...user, status } : user))
        const target = current.users.find((user) => user.id === userId)
        return addAudit(
          { ...current, users },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: status === 'Active' ? 'USER_ACTIVATE' : 'USER_DEACTIVATE',
            target: target?.email,
            severity: 'Medium',
            details: `${status === 'Active' ? 'Activated' : 'Deactivated'} ${target?.name}.`,
          },
        )
      })
      push(`User ${status === 'Active' ? 'activated' : 'deactivated'}`)
      return { ok: true }
    },
    [can, currentUser, mutate, push],
  )

  const updateRolePermissions = useCallback(
    (role, permissions) => {
      if (!can(PERMISSIONS.ROLES_MANAGE)) return { ok: false, error: 'Denied' }
      if (role === 'SUPER_ADMIN') return { ok: false, error: 'Super Admin permissions are locked.' }
      mutate((current) =>
        addAudit(
          { ...current, rolePermissions: { ...current.rolePermissions, [role]: permissions } },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: 'PERMISSION_CHANGE',
            target: role,
            severity: 'High',
            details: `Updated permissions for ${ROLE_LABELS[role]}.`,
          },
        ),
      )
      push(`Permissions updated for ${ROLE_LABELS[role]}`, 'warning')
      return { ok: true }
    },
    [can, currentUser, mutate, push],
  )

  const createAccount = useCallback(
    (payload) => {
      if (!can(PERMISSIONS.ACCOUNTS_CREATE)) return { ok: false, error: 'You cannot create accounts.' }
      const account = {
        id: createId('a'),
        accountNumber: `${Math.floor(100000000000 + Math.random() * 899999999999)}`,
        status: 'Active',
        openedOn: new Date().toISOString().slice(0, 10),
        balance: Number(payload.openingBalance) || 0,
        ...payload,
      }
      mutate((current) =>
        addAudit(
          { ...current, accounts: [account, ...current.accounts] },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: 'ACCOUNT_CREATE',
            target: account.accountNumber,
            details: `Opened ${account.type} account for customer ${payload.customerId}.`,
          },
        ),
      )
      push('Account created')
      return { ok: true, account }
    },
    [can, currentUser, mutate, push],
  )

  const setAccountStatus = useCallback(
    (accountId, status) => {
      if (!can(PERMISSIONS.ACCOUNTS_MANAGE_STATUS)) return { ok: false, error: 'Denied' }
      mutate((current) => {
        const accounts = current.accounts.map((account) => (account.id === accountId ? { ...account, status } : account))
        const account = current.accounts.find((item) => item.id === accountId)
        return addAudit(
          { ...current, accounts },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: 'ACCOUNT_STATUS',
            target: account?.accountNumber,
            severity: 'Medium',
            details: `Set account status to ${status}.`,
          },
        )
      })
      push(`Account marked ${status}`)
      return { ok: true }
    },
    [can, currentUser, mutate, push],
  )

  const submitTransaction = useCallback(
    (payload) => {
      if (!can(PERMISSIONS.TRANSACTIONS_SUBMIT)) return { ok: false, error: 'You cannot submit transactions.' }
      const amount = Number(payload.amount)
      if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: 'Enter a positive amount.' }

      const isCustomer = currentUser.role === 'CUSTOMER'
      const max = isCustomer ? store.limits.customerTransferMax : store.limits.tellerMaxAmount
      if (amount > max) return { ok: false, error: `Amount exceeds the configured limit of ₹${max.toLocaleString('en-IN')}.` }

      if (payload.type === 'Transfer' && payload.fromAccountId === payload.toAccountId) {
        return { ok: false, error: 'Choose two different accounts for a transfer.' }
      }

      const source = store.accounts.find((account) => account.id === payload.fromAccountId)
      const dest = store.accounts.find((account) => account.id === payload.toAccountId)
      if (payload.type !== 'Deposit' && !source) return { ok: false, error: 'Select a source account.' }
      if (payload.type !== 'Withdrawal' && !dest) return { ok: false, error: 'Select a destination account.' }
      if (source && source.status !== 'Active') return { ok: false, error: 'Source account is not active.' }
      if (dest && dest.status !== 'Active') return { ok: false, error: 'Destination account is not active.' }
      if (payload.type !== 'Deposit' && source && source.balance < amount) {
        return { ok: false, error: 'Insufficient balance. Balance is not reserved until completion.' }
      }

      if (isCustomer) {
        const ownIds = store.accounts.filter((account) => account.customerId === currentUser.customerId).map((account) => account.id)
        if (payload.fromAccountId && !ownIds.includes(payload.fromAccountId)) {
          return { ok: false, error: 'Customers may only transact on their own accounts.' }
        }
      }

      const duplicate = store.transactions.find((txn) => {
        const recent = Date.now() - new Date(txn.createdAt).getTime() < 60000
        return (
          recent &&
          txn.type === payload.type &&
          txn.amount === amount &&
          txn.fromAccountId === (payload.fromAccountId || null) &&
          txn.toAccountId === (payload.toAccountId || null) &&
          txn.submittedBy === currentUser.id &&
          txn.status === 'Pending'
        )
      })
      if (duplicate) return { ok: false, error: 'Duplicate submission blocked. The same pending request was sent within the last minute.' }

      const txn = {
        id: createId('t'),
        reference: `TXN-${Math.floor(88000 + Math.random() * 999)}`,
        type: payload.type,
        fromAccountId: payload.fromAccountId || null,
        toAccountId: payload.toAccountId || null,
        amount,
        status: 'Pending',
        submittedBy: currentUser.id,
        approvedBy: null,
        completedBy: null,
        branchId: currentUser.branchId || dest?.branchId || source?.branchId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        note: payload.note || '',
        requiresIndependentApproval: true,
      }

      mutate((current) =>
        addAudit(
          { ...current, transactions: [txn, ...current.transactions] },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: 'TRANSACTION_SUBMIT',
            target: txn.reference,
            details: `Submitted ${txn.type.toLowerCase()} of ₹${amount.toLocaleString('en-IN')}. Balance is unchanged until completion.`,
          },
        ),
      )
      push('Transaction submitted for approval. Account balances are unchanged.')
      return { ok: true, txn }
    },
    [can, currentUser, mutate, push, store.accounts, store.limits, store.transactions],
  )

  const decideTransaction = useCallback(
    (transactionId, decision) => {
      if (!can(PERMISSIONS.TRANSACTIONS_APPROVE)) return { ok: false, error: 'You cannot approve transactions.' }
      const txn = store.transactions.find((item) => item.id === transactionId)
      if (!txn) return { ok: false, error: 'Transaction not found.' }
      if (txn.status !== 'Pending') return { ok: false, error: 'Only pending transactions can be decided.' }
      if (txn.requiresIndependentApproval && txn.submittedBy === currentUser.id) {
        return { ok: false, error: 'Independent approval is required. You cannot approve your own submission.' }
      }
      mutate((current) => {
        const transactions = current.transactions.map((item) =>
          item.id === transactionId
            ? { ...item, status: decision, approvedBy: currentUser.id, updatedAt: new Date().toISOString() }
            : item,
        )
        return addAudit(
          { ...current, transactions },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: decision === 'Approved' ? 'TRANSACTION_APPROVE' : 'TRANSACTION_REJECT',
            target: txn.reference,
            severity: 'Medium',
            details: `${decision} ${txn.reference}. Balances still unchanged until completion.`,
          },
        )
      })
      push(`Transaction ${decision.toLowerCase()}`)
      return { ok: true }
    },
    [can, currentUser, mutate, push, store.transactions],
  )

  const completeTransaction = useCallback(
    (transactionId) => {
      if (!can(PERMISSIONS.TRANSACTIONS_COMPLETE)) return { ok: false, error: 'You cannot complete transactions.' }
      const txn = store.transactions.find((item) => item.id === transactionId)
      if (!txn) return { ok: false, error: 'Transaction not found.' }
      if (txn.status !== 'Approved') return { ok: false, error: 'Complete only after independent approval.' }

      const source = store.accounts.find((account) => account.id === txn.fromAccountId)
      if (txn.type !== 'Deposit' && source && source.balance < txn.amount) {
        return { ok: false, error: 'Source balance is no longer sufficient.' }
      }

      mutate((current) => {
        const accounts = current.accounts.map((account) => {
          if (account.id === txn.fromAccountId) return { ...account, balance: Number((account.balance - txn.amount).toFixed(2)) }
          if (account.id === txn.toAccountId) return { ...account, balance: Number((account.balance + txn.amount).toFixed(2)) }
          return account
        })
        const transactions = current.transactions.map((item) =>
          item.id === transactionId
            ? { ...item, status: 'Completed', completedBy: currentUser.id, updatedAt: new Date().toISOString() }
            : item,
        )
        return addAudit(
          { ...current, accounts, transactions },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: 'TRANSACTION_COMPLETE',
            target: txn.reference,
            details: `Completed ${txn.reference} and posted ledger balances.`,
          },
        )
      })
      push('Transaction completed and balances updated')
      return { ok: true }
    },
    [can, currentUser, mutate, push, store.accounts, store.transactions],
  )

  const submitLoan = useCallback(
    (payload) => {
      if (!can(PERMISSIONS.LOANS_APPLY)) return { ok: false, error: 'You cannot submit loan applications.' }
      const amount = Number(payload.amount)
      if (!amount || amount <= 0) return { ok: false, error: 'Enter a valid requested amount.' }
      const loan = {
        id: createId('l'),
        applicationNo: `LN-2026-${Math.floor(30 + Math.random() * 70)}`,
        customerId: payload.customerId,
        type: payload.type,
        amount,
        tenureMonths: Number(payload.tenureMonths) || 12,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        reviewedBy: null,
        notes: '',
        documents: [
          { name: 'KYC pack', status: 'Received' },
          { name: 'Income proof', status: payload.incomeProof ? 'Received' : 'Pending' },
          { name: 'Application form', status: 'Received' },
        ],
      }
      mutate((current) =>
        addAudit(
          { ...current, loans: [loan, ...current.loans] },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: 'LOAN_SUBMIT',
            target: loan.applicationNo,
            details: `Submitted ${loan.type} application.`,
          },
        ),
      )
      push('Loan application submitted')
      return { ok: true }
    },
    [can, currentUser, mutate, push],
  )

  const reviewLoan = useCallback(
    (loanId, { status, notes }) => {
      if (!can(PERMISSIONS.LOANS_REVIEW)) return { ok: false, error: 'You cannot review loans.' }
      mutate((current) => {
        const loan = current.loans.find((item) => item.id === loanId)
        const loans = current.loans.map((item) =>
          item.id === loanId ? { ...item, status, notes, reviewedBy: currentUser.id } : item,
        )
        return addAudit(
          { ...current, loans },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: 'LOAN_REVIEW',
            target: loan?.applicationNo,
            severity: 'Medium',
            details: `Set loan status to ${status}. ${notes || ''}`.trim(),
          },
        )
      })
      push('Loan review saved')
      return { ok: true }
    },
    [can, currentUser, mutate, push],
  )

  const saveCustomerRequest = useCallback(
    (payload) => {
      const request = {
        id: createId('sr'),
        customerId: currentUser.customerId,
        status: 'Open',
        createdAt: new Date().toISOString(),
        ...payload,
      }
      mutate((current) => ({ ...current, serviceRequests: [request, ...current.serviceRequests] }))
      push('Service request submitted')
      return { ok: true }
    },
    [currentUser, mutate, push],
  )

  const updateFollowUp = useCallback(
    (id, status) => {
      mutate((current) => ({
        ...current,
        followUps: current.followUps.map((item) => (item.id === id ? { ...item, status } : item)),
      }))
      push('Follow-up updated')
    },
    [mutate, push],
  )

  const updateProfile = useCallback(
    (patch) => {
      mutate((current) => ({
        ...current,
        users: current.users.map((user) => (user.id === currentUser.id ? { ...user, ...patch } : user)),
      }))
      push('Profile updated')
    },
    [currentUser, mutate, push],
  )

  const updateEmployee = useCallback(
    (employeeId, patch) => {
      if (!can(PERMISSIONS.EMPLOYEES_MANAGE)) return { ok: false, error: 'Denied' }
      mutate((current) => {
        const employees = current.employees.map((item) => (item.id === employeeId ? { ...item, ...patch } : item))
        return addAudit(
          { ...current, employees },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: 'EMPLOYEE_UPDATE',
            target: employeeId,
            details: 'Updated employee assignment or status.',
          },
        )
      })
      push('Employee record updated')
      return { ok: true }
    },
    [can, currentUser, mutate, push],
  )

  const updateBranch = useCallback(
    (branchId, patch) => {
      if (!can(PERMISSIONS.BRANCHES_MANAGE)) return { ok: false, error: 'Denied' }
      mutate((current) => {
        const branches = current.branches.map((item) => (item.id === branchId ? { ...item, ...patch } : item))
        return addAudit(
          { ...current, branches },
          {
            actorId: currentUser.id,
            actorRole: currentUser.role,
            action: 'BRANCH_UPDATE',
            target: branchId,
            details: 'Updated branch details.',
          },
        )
      })
      push('Branch updated')
      return { ok: true }
    },
    [can, currentUser, mutate, push],
  )

  const markNotificationsRead = useCallback(() => {
    mutate((current) => ({
      ...current,
      notifications: current.notifications.map((item) => ({ ...item, read: true })),
    }))
  }, [mutate])

  const value = useMemo(
    () => ({
      store,
      loading,
      currentUser,
      currentRole,
      can,
      explain,
      login,
      logout,
      switchRole,
      resetDemo,
      logDenied,
      recordAudit,
      saveUser,
      setUserStatus,
      updateRolePermissions,
      createAccount,
      setAccountStatus,
      submitTransaction,
      decideTransaction,
      completeTransaction,
      submitLoan,
      reviewLoan,
      saveCustomerRequest,
      updateFollowUp,
      updateProfile,
      updateEmployee,
      updateBranch,
      markNotificationsRead,
    }),
    [
      store,
      loading,
      currentUser,
      currentRole,
      can,
      explain,
      login,
      logout,
      switchRole,
      resetDemo,
      logDenied,
      recordAudit,
      saveUser,
      setUserStatus,
      updateRolePermissions,
      createAccount,
      setAccountStatus,
      submitTransaction,
      decideTransaction,
      completeTransaction,
      submitLoan,
      reviewLoan,
      saveCustomerRequest,
      updateFollowUp,
      updateProfile,
      updateEmployee,
      updateBranch,
      markNotificationsRead,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
