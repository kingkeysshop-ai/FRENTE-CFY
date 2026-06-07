"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export async function fetchOrderLicenses(orderId: string) {
  try {
    const headers = { ...(await getAuthHeaders()) }
    const res = await (sdk as any).client.fetch(
      `/store/license-keys/${orderId}`,
      {
        method: "GET",
        headers,
      }
    )
    return (res?.license_keys || []) as Array<{
      id: string
      key: string
      product_id: string
      status: string
      delivery_status: string
      delivery_error?: string
    }>
  } catch {
    return []
  }
}

export async function resendLicense(orderId: string) {
  try {
    const headers = { ...(await getAuthHeaders()) }
    const res = await (sdk as any).client.fetch(
      `/store/license-keys/${orderId}/resend`,
      {
        method: "POST",
        headers,
      }
    )
    return res?.results || []
  } catch {
    return []
  }
}
