const RESET_TOKENS = new Map<string, { email: string; createdAt: number }>()

const CLEANUP = setInterval(() => {
  const now = Date.now()
  RESET_TOKENS.forEach((data, token) => {
    if (now - data.createdAt > 3600000) RESET_TOKENS.delete(token)
  })
}, 60000)
if (CLEANUP.unref) CLEANUP.unref()

export function setResetToken(token: string, email: string) {
  RESET_TOKENS.set(token, { email: email.toLowerCase(), createdAt: Date.now() })
  if (RESET_TOKENS.size > 5000) {
    const keys = Array.from(RESET_TOKENS.keys()).slice(0, 1000)
    keys.forEach(k => RESET_TOKENS.delete(k))
  }
}

export function getResetTokenData(token: string): { email: string; createdAt: number } | undefined {
  const data = RESET_TOKENS.get(token)
  if (!data) return undefined
  if (Date.now() - data.createdAt > 3600000) {
    RESET_TOKENS.delete(token)
    return undefined
  }
  return data
}

export function deleteResetToken(token: string) {
  RESET_TOKENS.delete(token)
}
