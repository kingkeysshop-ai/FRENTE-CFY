"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export type LicenseKey = {
  id: string
  key: string
  product_id: string
  status: string
  delivery_status: string
  delivery_error?: string
}

export async function fetchOrderLicenses(orderId: string): Promise<{
  keys: LicenseKey[]
  error?: string
}> {
  try {
    const headers = { ...(await getAuthHeaders()) }
    const res = await (sdk as any).client.fetch(
      `/store/license-keys/${orderId}`,
      {
        method: "GET",
        headers,
      }
    )
    const keys = (res?.license_keys || []) as LicenseKey[]
    return { keys }
  } catch (err: any) {
    const msg = err?.message || err?.response?.data?.message || "Error fetching licenses"
    console.error(`[license-keys] fetchOrderLicenses failed for order ${orderId}:`, msg)
    return { keys: [], error: msg }
  }
}

export async function resendLicense(orderId: string): Promise<{
  results: Array<{ id: string; success: boolean; error?: string }>
  error?: string
}> {
  try {
    const headers = { ...(await getAuthHeaders()) }
    const res = await (sdk as any).client.fetch(
      `/store/license-keys/${orderId}/resend`,
      {
        method: "POST",
        headers,
      }
    )
    return { results: res?.results || [] }
  } catch (err: any) {
    const msg = err?.message || "Error resending license"
    console.error(`[license-keys] resendLicense failed for order ${orderId}:`, msg)
    return { results: [], error: msg }
  }
}
