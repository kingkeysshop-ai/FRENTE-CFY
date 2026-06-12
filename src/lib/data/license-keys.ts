"use server"

import { getAuthHeaders } from "./cookies"

export type LicenseKey = {
  id: string
  key: string
  product_id: string
  status: string
  delivery_status: string
  delivery_error?: string
}

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

async function apiFetch<T>(
  path: string,
  options: { method?: string; headers?: Record<string, string>; body?: unknown } = {}
): Promise<T> {
  const { method = "GET", headers = {}, body } = options
  const authHeaders = await getAuthHeaders()
  const merged: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeaders,
    ...headers,
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: merged,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
  }

  return res.json()
}

export async function fetchOrderLicenses(
  orderId: string,
  email?: string
): Promise<{
  keys: LicenseKey[]
  error?: string
}> {
  try {
    const params = email ? `?email=${encodeURIComponent(email)}` : ""
    const data = await apiFetch<{ license_keys: LicenseKey[] }>(
      `/store/license-keys/${orderId}${params}`
    )
    return { keys: data?.license_keys || [] }
  } catch (err: any) {
    const msg = err?.message || "Error fetching licenses"
    console.error(`[license-keys] fetchOrderLicenses failed for order ${orderId}:`, msg)
    return { keys: [], error: msg }
  }
}

export async function resendLicense(orderId: string): Promise<{
  results: Array<{ id: string; success: boolean; error?: string }>
  error?: string
}> {
  try {
    const data = await apiFetch<{ results: Array<{ id: string; success: boolean; error?: string }> }>(
      `/store/license-keys/${orderId}/resend`,
      { method: "POST" }
    )
    return { results: data?.results || [] }
  } catch (err: any) {
    const msg = err?.message || "Error resending license"
    console.error(`[license-keys] resendLicense failed for order ${orderId}:`, msg)
    return { results: [], error: msg }
  }
}
