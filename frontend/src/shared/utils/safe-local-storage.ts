export function getJSON<T>(key: string): T | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // ignore
    }
    return null
  }
}

export function setJSON<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota or serialization errors
  }
}

export function removeItem(key: string): void {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
