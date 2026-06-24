const memoryStore = new Map<string, { count: number; resetAt: number }>()

const cleanupId = setInterval(() => {
  const now = Date.now()
  memoryStore.forEach((entry, key) => {
    if (now > entry.resetAt) memoryStore.delete(key)
  })
}, 60000)

if (cleanupId.unref) cleanupId.unref()

function memoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) return false

  entry.count++
  return true
}

export function checkRateLimitSync(
  key: string,
  maxRequests: number = 20,
  windowMs: number = 60000
): boolean {
  return memoryRateLimit(key, maxRequests, windowMs)
}
