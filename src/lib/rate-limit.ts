const store = new Map<string, { count: number; resetAt: number }>()

const cleanupId = setInterval(() => {
  const now = Date.now()
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key)
  })
  if (store.size === 0 && cleanupId.unref) cleanupId.unref()
}, 30000)

if (cleanupId.unref) cleanupId.unref()

export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count++
  return true
}

export function getRateLimitStoreSize(): number {
  return store.size
}
