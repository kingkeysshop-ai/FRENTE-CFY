"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "kingkeys_wishlist"

export function useWishlist() {
  const [items, setItems] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setItems(raw ? JSON.parse(raw) : [])
    } catch {
      setItems([])
    }
  }, [])

  const toggle = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isWishlisted = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  )

  return { items, toggle, isWishlisted }
}
