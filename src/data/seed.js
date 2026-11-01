import { DEFAULT_ROLE_PERMISSIONS, ROLE_LABELS, ROLES } from '../utils/permissions'

export const DEMO_PASSWORD = 'demo'
export const STORAGE_KEY = 'accessguard-demo-v1'
export const SESSION_KEY = 'accessguard-session-v1'
export const DEMO_NAME_REPLACEMENTS = {
  'Priya Sharma': 'admin',
  priya: 'admin',
  'Rajesh Iyer': 'Anu',
  'Ananya Patel': 'Adithya',
  'Arjun Mehta': 'Arjun',
  'Kavita Rao': 'auditor',
  Archana: 'auditor',
  'Vikram Singh': 'Anargha',
  'Neha Kapoor': 'Neha',
}

export const DEMO_ACCOUNTS = [
  { email: 'admin@accessguard.example', role: ROLES.SUPER_ADMIN, name: 'admin' },
  { email: 'manager@accessguard.example', role: ROLES.BRANCH_MANAGER, name: 'Anu' },
  { email: 'teller@accessguard.example', role: ROLES.BANK_TELLER, name: 'Adithya' },
  { email: 'customer@accessguard.example', role: ROLES.CUSTOMER, name: 'Arjun' },
  { email: 'auditor@accessguard.example', role: ROLES.AUDITOR, name: 'auditor' },
  { email: 'loan@accessguard.example', role: ROLES.LOAN_OFFICER, name: 'Anargha' },
  { email: 'rm@accessguard.example', role: ROLES.RELATIONSHIP_MANAGER, name: 'Neha' },
]

const now = Date.now()
const hoursAgo = (hours) => new Date(now - hours * 3600000).toISOString()
const daysAgo = (days) => new Date(now - days * 86400000).toISOString()

export function createSeedData() {
  const branches = [
    {
      id: 'b1',
      code: 'MUM-FT',
      name: 'Mumbai Fort Branch',
      city: 'Mumbai',
      address: '12 Horniman Circle, Fort, Mumbai 400001',
      ifsc: 'AGBN0001121',
      phone: '+91 22 4001 1121',
      status: 'Active',
      openedOn: '2014-03-12',
    },
    {
      id: 'b2',
      code: 'BLR-KG',
      name: 'Bengaluru Koramangala',
      city: 'Bengaluru',
      address: '80 Feet Road, Koramangala, Bengaluru 560034',
      ifsc: 'AGBN0002208',
      phone: '+91 80 4120 2208',
      status: 'Active',
      openedOn: '2017-08-01',
    },
    {
      id: 'b3',
      code: 'DEL-CP',
      name: 'Delhi Connaught Place',
      city: 'New Delhi',
      address: 'Block A, Connaught Place, New Delhi 110001',
      ifsc: 'AGBN0003304',
      phone: '+91 11 4350 3304',
      status: 'Active',
      openedOn: '2012-11-20',
    },
    {
      id: 'b4',
      code: 'PUN-FC',
      name: 'Pune FC Road',
      city: 'Pune',
      address: '1186 FC Road, Shivajinagar, Pune 411005',
      ifsc: 'AGBN0004419',
      phone: '+91 20 2553 4419',
      status: 'Active',
      openedOn: '2019-02-04',
    },
  ]

  const users = [
    { id: 'u1', name: 'admin', email: 'admin@accessguard.example', username: 'admin', role: ROLES.SUPER_ADMIN, branchId: null, customerId: null, status: 'Active', department: 'Head Office', lastLogin: hoursAgo(1) },
    { id: 'u2', name: 'Anu', email: 'manager@accessguard.example', username: 'manager', role: ROLES.BRANCH_MANAGER, branchId: 'b1', customerId: null, status: 'Active', department: 'Branch Operations', lastLogin: hoursAgo(3) },
    { id: 'u3', name: 'Adithya', email: 'teller@accessguard.example', username: 'teller', role: ROLES.BANK_TELLER, branchId: 'b1', customerId: null, status: 'Active', department: 'Cash Operations', lastLogin: hoursAgo(2) },
    { id: 'u4', name: 'Arjun', email: 'customer@accessguard.example', username: 'customer', role: ROLES.CUSTOMER, branchId: 'b1', customerId: 'c1', status: 'Active', department: 'Retail Banking', lastLogin: hoursAgo(8) },
    { id: 'u5', name: 'auditor', email: 'auditor@accessguard.example', username: 'auditor', role: ROLES.AUDITOR, branchId: null, customerId: null, status: 'Active', department: 'Internal Audit', lastLogin: daysAgo(1) },
    { id: 'u6', name: 'Anargha', email: 'loan@accessguard.example', username: 'loanofficer', role: ROLES.LOAN_OFFICER, branchId: 'b1', customerId: null, status: 'Active', department: 'Credit', lastLogin: hoursAgo(5) },
    { id: 'u7', name: 'Neha', email: 'rm@accessguard.example', username: 'rm', role: ROLES.RELATIONSHIP_MANAGER, branchId: 'b1', customerId: null, status: 'Active', department: 'Wealth & RM', lastLogin: hoursAgo(4) },
    { id: 'u8', name: 'Sanjay Nair', email: 'sanjay.nair@accessguard.example', username: 'sanjay', role: ROLES.BANK_TELLER, branchId: 'b2', customerId: null, status: 'Active', department: 'Cash Operations', lastLogin: daysAgo(2) },
    { id: 'u9', name: 'Meera Joshi', email: 'meera.joshi@accessguard.example', username: 'meera', role: ROLES.CUSTOMER, branchId: 'b2', customerId: 'c2', status: 'Active', department: 'Retail Banking', lastLogin: daysAgo(4) },
    { id: 'u10', name: 'Inactive User', email: 'inactive@accessguard.example', username: 'inactive', role: ROLES.BANK_TELLER, branchId: 'b3', customerId: null, status: 'Inactive', department: 'Cash Operations', lastLogin: daysAgo(40) },
  ]

  const employees = [
    { id: 'e1', userId: 'u1', name: 'admin', employeeCode: 'AG-1001', department: 'Head Office', jobRole: 'Super Admin', branchId: null, status: 'Active', joinedOn: '2016-01-10', email: 'admin@accessguard.example' },
    { id: 'e2', userId: 'u2', name: 'Anu', employeeCode: 'AG-2044', department: 'Branch Operations', jobRole: 'Branch Manager', branchId: 'b1', status: 'Active', joinedOn: '2018-04-02', email: 'manager@accessguard.example' },
    { id: 'e3', userId: 'u3', name: 'Adithya', employeeCode: 'AG-3112', department: 'Cash Operations', jobRole: 'Bank Teller', branchId: 'b1', status: 'Active', joinedOn: '2021-07-15', email: 'teller@accessguard.example' },
    { id: 'e4', userId: 'u6', name: 'Anargha', employeeCode: 'AG-4088', department: 'Credit', jobRole: 'Loan Officer', branchId: 'b1', status: 'Active', joinedOn: '2019-09-21', email: 'loan@accessguard.example' },
    { id: 'e5', userId: 'u7', name: 'Neha', employeeCode: 'AG-5120', department: 'Wealth & RM', jobRole: 'Relationship Manager', branchId: 'b1', status: 'Active', joinedOn: '2020-02-11', email: 'rm@accessguard.example' },
    { id: 'e6', userId: 'u5', name: 'auditor', employeeCode: 'AG-0904', department: 'Internal Audit', jobRole: 'Auditor', branchId: null, status: 'Active', joinedOn: '2015-06-18', email: 'auditor@accessguard.example' },
    { id: 'e7', userId: 'u8', name: 'Sanjay Nair', employeeCode: 'AG-3220', department: 'Cash Operations', jobRole: 'Bank Teller', branchId: 'b2', status: 'Active', joinedOn: '2022-01-09', email: 'sanjay.nair@accessguard.example' },
    { id: 'e8', userId: null, name: 'Deepa Menon', employeeCode: 'AG-2211', department: 'Branch Operations', jobRole: 'Assistant Manager', branchId: 'b2', status: 'Active', joinedOn: '2019-12-01', email: 'deepa.menon@accessguard.example' },
    { id: 'e9', userId: null, name: 'Imran Qureshi', employeeCode: 'AG-3301', department: 'Operations', jobRole: 'Branch Manager', branchId: 'b3', status: 'Active', joinedOn: '2017-03-14', email: 'imran.qureshi@accessguard.example' },
    { id: 'e10', userId: 'u10', name: 'Inactive User', employeeCode: 'AG-3490', department: 'Cash Operations', jobRole: 'Bank Teller', branchId: 'b3', status: 'Inactive', joinedOn: '2023-05-01', email: 'inactive@accessguard.example' },
  ]

  const customers = [
    { id: 'c1', userId: 'u4', name: 'Arjun', email: 'customer@accessguard.example', phone: '+91 98200 11121', kyc: 'Verified', city: 'Mumbai', rmId: 'u7', branchId: 'b1', since: '2019-04-18', risk: 'Low', occupation: 'Software Engineer' },
    { id: 'c2', userId: 'u9', name: 'Meera Joshi', email: 'meera.joshi@accessguard.example', phone: '+91 98450 22008', kyc: 'Verified', city: 'Bengaluru', rmId: 'u7', branchId: 'b2', since: '2021-01-09', risk: 'Low', occupation: 'Consultant' },
    { id: 'c3', userId: null, name: 'Rohan Desai', email: 'rohan.desai@example.invalid', phone: '+91 98700 44190', kyc: 'Verified', city: 'Pune', rmId: 'u7', branchId: 'b4', since: '2020-11-02', risk: 'Medium', occupation: 'Business Owner' },
    { id: 'c4', userId: null, name: 'Fatima Khan', email: 'fatima.khan@example.invalid', phone: '+91 98110 33041', kyc: 'Pending', city: 'New Delhi', rmId: null, branchId: 'b3', since: '2024-06-12', risk: 'Low', occupation: 'Doctor' },
    { id: 'c5', userId: null, name: 'Suresh Iyer', email: 'suresh.iyer@example.invalid', phone: '+91 99870 11880', kyc: 'Verified', city: 'Mumbai', rmId: 'u7', branchId: 'b1', since: '2016-08-22', risk: 'Medium', occupation: 'Retail Trader' },
  ]

  const accounts = [
    { id: 'a1', accountNumber: '112100045211', customerId: 'c1', branchId: 'b1', type: 'Savings', status: 'Active', balance: 248650.5, openedOn: '2019-04-18', product: 'AccessGuard Savings Plus' },
    { id: 'a2', accountNumber: '112100045298', customerId: 'c1', branchId: 'b1', type: 'Current', status: 'Active', balance: 81240, openedOn: '2022-02-01', product: 'AccessGuard Current Lite' },
    { id: 'a3', accountNumber: '220800078341', customerId: 'c2', branchId: 'b2', type: 'Savings', status: 'Active', balance: 156900, openedOn: '2021-01-09', product: 'AccessGuard Savings Plus' },
    { id: 'a4', accountNumber: '441900091102', customerId: 'c3', branchId: 'b4', type: 'Current', status: 'Active', balance: 430000, openedOn: '2020-11-02', product: 'AccessGuard Business Current' },
    { id: 'a5', accountNumber: '330400055018', customerId: 'c4', branchId: 'b3', type: 'Savings', status: 'Frozen', balance: 27500, openedOn: '2024-06-12', product: 'AccessGuard Savings Plus' },
    { id: 'a6', accountNumber: '112100066774', customerId: 'c5', branchId: 'b1', type: 'Savings', status: 'Active', balance: 98000, openedOn: '2016-08-22', product: 'AccessGuard Savings Plus' },
  ]

  const transactions = [
    { id: 't1', reference: 'TXN-88421', type: 'Deposit', fromAccountId: null, toAccountId: 'a1', amount: 25000, status: 'Completed', submittedBy: 'u3', approvedBy: 'u2', completedBy: 'u2', branchId: 'b1', createdAt: daysAgo(6), updatedAt: daysAgo(6), note: 'Cash deposit at Fort branch', requiresIndependentApproval: true },
    { id: 't2', reference: 'TXN-88490', type: 'Withdrawal', fromAccountId: 'a1', toAccountId: null, amount: 8000, status: 'Completed', submittedBy: 'u3', approvedBy: 'u2', completedBy: 'u2', branchId: 'b1', createdAt: daysAgo(4), updatedAt: daysAgo(4), note: 'ATM cash pickup', requiresIndependentApproval: true },
    { id: 't3', reference: 'TXN-88512', type: 'Transfer', fromAccountId: 'a1', toAccountId: 'a2', amount: 12000, status: 'Completed', submittedBy: 'u4', approvedBy: 'u2', completedBy: 'u2', branchId: 'b1', createdAt: daysAgo(2), updatedAt: daysAgo(2), note: 'Own-account sweep', requiresIndependentApproval: true },
    { id: 't4', reference: 'TXN-88601', type: 'Deposit', fromAccountId: null, toAccountId: 'a1', amount: 15000, status: 'Pending', submittedBy: 'u3', approvedBy: null, completedBy: null, branchId: 'b1', createdAt: hoursAgo(5), updatedAt: hoursAgo(5), note: 'Cheque deposit — awaiting approval', requiresIndependentApproval: true },
    { id: 't5', reference: 'TXN-88614', type: 'Withdrawal', fromAccountId: 'a6', toAccountId: null, amount: 40000, status: 'Pending', submittedBy: 'u3', approvedBy: null, completedBy: null, branchId: 'b1', createdAt: hoursAgo(3), updatedAt: hoursAgo(3), note: 'Large cash withdrawal', requiresIndependentApproval: true },
    { id: 't6', reference: 'TXN-88620', type: 'Transfer', fromAccountId: 'a3', toAccountId: 'a1', amount: 5000, status: 'Rejected', submittedBy: 'u8', approvedBy: 'u2', completedBy: null, branchId: 'b2', createdAt: daysAgo(1), updatedAt: hoursAgo(20), note: 'Beneficiary mismatch', requiresIndependentApproval: true },
    { id: 't7', reference: 'TXN-88631', type: 'Deposit', fromAccountId: null, toAccountId: 'a4', amount: 75000, status: 'Approved', submittedBy: 'u8', approvedBy: 'u2', completedBy: null, branchId: 'b4', createdAt: hoursAgo(10), updatedAt: hoursAgo(6), note: 'Business receipt — approved, not completed', requiresIndependentApproval: true },
  ]

  const loans = [
    { id: 'l1', applicationNo: 'LN-2026-014', customerId: 'c1', type: 'Home Loan', amount: 3500000, tenureMonths: 240, status: 'Under Review', submittedAt: daysAgo(8), reviewedBy: 'u6', notes: 'Salary slips received. Property papers pending.', documents: [{ name: 'PAN Card', status: 'Received' }, { name: 'Salary slips (3 months)', status: 'Received' }, { name: 'Property papers', status: 'Pending' }, { name: 'ITR', status: 'Received' }] },
    { id: 'l2', applicationNo: 'LN-2026-021', customerId: 'c3', type: 'Business Loan', amount: 1200000, tenureMonths: 48, status: 'Pending', submittedAt: daysAgo(3), reviewedBy: null, notes: '', documents: [{ name: 'GST returns', status: 'Received' }, { name: 'Bank statements', status: 'Received' }, { name: 'KYC pack', status: 'Received' }] },
    { id: 'l3', applicationNo: 'LN-2025-198', customerId: 'c5', type: 'Personal Loan', amount: 250000, tenureMonths: 24, status: 'Approved', submittedAt: daysAgo(40), reviewedBy: 'u6', notes: 'Approved with standard rate.', documents: [{ name: 'KYC pack', status: 'Received' }, { name: 'Income proof', status: 'Received' }] },
    { id: 'l4', applicationNo: 'LN-2026-009', customerId: 'c2', type: 'Vehicle Loan', amount: 680000, tenureMonths: 60, status: 'Rejected', submittedAt: daysAgo(20), reviewedBy: 'u6', notes: 'Existing obligation ratio too high.', documents: [{ name: 'KYC pack', status: 'Received' }, { name: 'Quotation', status: 'Received' }] },
  ]

  const serviceRequests = [
    { id: 'sr1', customerId: 'c1', type: 'Cheque book', status: 'Open', createdAt: daysAgo(1), note: 'Request 25-leaf cheque book for savings account.' },
    { id: 'sr2', customerId: 'c1', type: 'Address update', status: 'In Progress', createdAt: daysAgo(5), note: 'New address in Andheri West.' },
    { id: 'sr3', customerId: 'c3', type: 'Trade finance call', status: 'Open', createdAt: hoursAgo(12), note: 'Wants LC discussion for import shipment.' },
  ]

  const followUps = [
    { id: 'f1', customerId: 'c1', rmId: 'u7', title: 'Home loan document chase', dueAt: hoursAgo(-24), status: 'Pending' },
    { id: 'f2', customerId: 'c3', rmId: 'u7', title: 'Business current upsell', dueAt: hoursAgo(-8), status: 'Pending' },
    { id: 'f3', customerId: 'c5', rmId: 'u7', title: 'FD renewal reminder', dueAt: daysAgo(2), status: 'Done' },
  ]

  const notifications = [
    { id: 'n1', title: 'Pending deposit TXN-88601', body: 'Cheque deposit of ₹15,000 awaits independent approval.', createdAt: hoursAgo(5), read: false },
    { id: 'n2', title: 'Sample data loaded', body: 'This environment uses sample records. Reset data from your profile menu.', createdAt: hoursAgo(24), read: true },
    { id: 'n3', title: 'Loan LN-2026-021 submitted', body: 'Business loan application is waiting for a loan officer review.', createdAt: daysAgo(3), read: false },
  ]

  const roles = Object.values(ROLES).map((id) => ({
    id,
    name: ROLE_LABELS[id],
    description: `${ROLE_LABELS[id]} access profile for AccessGuard.`,
    locked: id === ROLES.SUPER_ADMIN,
  }))

  const auditLogs = [
    { id: 'au1', at: hoursAgo(26), actorId: 'u3', actorRole: ROLES.BANK_TELLER, action: 'LOGIN', target: 'Session', status: 'Success', severity: 'Info', details: 'Bank Teller signed in from the branch workstation.' },
    { id: 'au2', at: hoursAgo(5), actorId: 'u3', actorRole: ROLES.BANK_TELLER, action: 'TRANSACTION_SUBMIT', target: 'TXN-88601', status: 'Success', severity: 'Info', details: 'Submitted deposit of ₹15,000 to account XXXX 4521.' },
    { id: 'au3', at: hoursAgo(3), actorId: 'u3', actorRole: ROLES.BANK_TELLER, action: 'TRANSACTION_SUBMIT', target: 'TXN-88614', status: 'Success', severity: 'Medium', details: 'Submitted withdrawal of ₹40,000 from XXXX 6774.' },
    { id: 'au4', at: hoursAgo(20), actorId: 'u2', actorRole: ROLES.BRANCH_MANAGER, action: 'TRANSACTION_REJECT', target: 'TXN-88620', status: 'Success', severity: 'Medium', details: 'Rejected transfer due to beneficiary mismatch.' },
    { id: 'au5', at: daysAgo(8), actorId: 'u4', actorRole: ROLES.CUSTOMER, action: 'LOAN_SUBMIT', target: 'LN-2026-014', status: 'Success', severity: 'Info', details: 'Customer submitted a home loan application.' },
  ]

  return {
    users,
    employees,
    customers,
    branches,
    accounts,
    transactions,
    loans,
    serviceRequests,
    followUps,
    notifications,
    roles,
    auditLogs,
    rolePermissions: { ...DEFAULT_ROLE_PERMISSIONS },
    limits: {
      tellerMaxAmount: 200000,
      customerTransferMax: 50000,
      independentApprovalAbove: 10000,
    },
  }
}
