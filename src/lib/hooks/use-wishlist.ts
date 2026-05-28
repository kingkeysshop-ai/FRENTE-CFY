"use client"

import { useCallback, useSyncExternalStore } from "react"

const STORAGE_KEY = "kingkeys_wishlist"

function getSnapshot(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

export function useWishlist() {
  const items = useSyncExternalStore(subscribe, getSnapshot, () => [])

  const toggle = useCallback((productId: string) => {
    const current = getSnapshot()
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event("storage"))
  }, [])

  const isWishlisted = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  )

  return { items, toggle, isWishlisted }
}
