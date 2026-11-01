import { createSeedData, DEMO_NAME_REPLACEMENTS, SESSION_KEY, STORAGE_KEY } from '../data/seed'

function migrateStoredNames(value) {
  if (typeof value === 'string') {
    const updatedName = DEMO_NAME_REPLACEMENTS[value]
    if (updatedName) return updatedName
    return value
      .replace(/@accessguard\.demo\b/g, '@accessguard.example')
      .replace(/@example\.demo\b/g, '@example.invalid')
      .replace('Inactive Demo User', 'Inactive User')
      .replace('Demo mode active', 'Sample data loaded')
      .replace('This environment uses fictional data. Reset sample data from your profile menu.', 'This environment uses sample records. Reset data from your profile menu.')
      .replace('demo persona for the AccessGuard RBAC prototype.', 'access profile for AccessGuard.')
      .replace('Bank Teller signed in from demo workstation.', 'Bank Teller signed in from the branch workstation.')
  }
  if (Array.isArray(value)) {
    return value.map(migrateStoredNames)
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, migrateStoredNames(entry)]),
    )
  }
  return value
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seed = createSeedData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      return seed
    }
    const stored = JSON.parse(raw)
    const migrated = migrateStoredNames(stored)
    if (JSON.stringify(migrated) !== raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    }
    return migrated
  } catch {
    const seed = createSeedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
}

export function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function resetStore() {
  const seed = createSeedData()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
  return seed
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}
