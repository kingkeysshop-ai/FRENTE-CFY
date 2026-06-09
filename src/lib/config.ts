import "server-only"

import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa from "@medusajs/medusa-js"

// Defaults to standard port for Medusa server
const envBackendUrl =
  process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (envBackendUrl) {
  MEDUSA_BACKEND_URL = envBackendUrl

  // Ensure URL has a protocol
  if (!MEDUSA_BACKEND_URL.startsWith("http://") && !MEDUSA_BACKEND_URL.startsWith("https://")) {
    MEDUSA_BACKEND_URL = `https://${MEDUSA_BACKEND_URL}`
  }
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
  publishableApiKey: process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

async function mergeHeaders(headers?: Record<string, string>): Promise<Record<string, string>> {
  const merged: Record<string, string> = { ...(headers || {}) }
  try {
    const localeHeader = await getLocaleHeader()
    if (localeHeader?.["x-medusa-locale"] && !merged["x-medusa-locale"]) {
      merged["x-medusa-locale"] = localeHeader["x-medusa-locale"]
    }
  } catch {}
  return merged
}

const client = sdk.client as any

client.fetch = async <T>(
  input: string,
  init: {
    method?: string
    query?: Record<string, unknown>
    headers?: Record<string, string>
    body?: unknown
    next?: unknown
    cache?: unknown
  } = {}
): Promise<T> => {
  const { method = "GET", query, headers = {}, body } = init

  const mergedHeaders: Record<string, string> = {
    ...headers,
  }

  try {
    const localeHeader = await getLocaleHeader()
    if (localeHeader?.["x-medusa-locale"] && !mergedHeaders["x-medusa-locale"]) {
      mergedHeaders["x-medusa-locale"] = localeHeader["x-medusa-locale"]
    }
  } catch {}

  let path = input

  if (query && Object.keys(query).length > 0) {
    const searchParams: string[] = []
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue
      }
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.push(`${key}[]=${encodeURIComponent(String(item))}`))
      } else {
        searchParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      }
    }
    path = `${path}${path.includes("?") ? "&" : "?"}${searchParams.join("&")}`
  }

  const payload = body ?? undefined

  return client.request(method, path, payload, undefined, mergedHeaders).catch((err: any) => {
    const errBody = err.response?.data
    const errMsg = errBody?.message === null ? "(null)" : errBody?.message
    console.error(
      "API_ERROR:", method, path,
      "status:", err.response?.status,
      "type:", errBody?.type,
      "message:", errMsg,
      "q:", JSON.stringify(query).slice(0,300)
    )
    throw err
  })
}

const store = {
  cart: {
    create: async (payload?: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.carts.create(payload as any, await mergeHeaders(headers)),
    update: async (cartId: string, payload: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.carts.update(cartId, payload as any, await mergeHeaders(headers)),
    createLineItem: async (cartId: string, payload: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.carts.lineItems.create(cartId, payload as any, await mergeHeaders(headers)),
    updateLineItem: async (cartId: string, lineId: string, payload: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.carts.lineItems.update(cartId, lineId, payload as any, await mergeHeaders(headers)),
    deleteLineItem: async (cartId: string, lineId: string, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.carts.lineItems.delete(cartId, lineId, await mergeHeaders(headers)),
    addShippingMethod: async (cartId: string, payload: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.carts.addShippingMethod(cartId, payload as any, await mergeHeaders(headers)),
    complete: async (cartId: string, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.carts.complete(cartId, await mergeHeaders(headers)),
    transferCart: async (cartId: string, _payload?: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) => {
      const merged = await mergeHeaders(headers)
      const { customer } = await sdk.client.fetch<{ customer: any }>("/store/customers/me", { method: "GET", headers: merged }).catch(() => ({ customer: null }))
      if (!customer?.id) {
        throw new Error("No authenticated customer to transfer cart to")
      }
      return sdk.carts.update(cartId, { customer_id: customer.id } as any, merged)
    },
  },
  customer: {
    create: async (payload: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.customers.create(payload as any, await mergeHeaders(headers)),
    update: async (payload: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.customers.update(payload as any, await mergeHeaders(headers)),
    createAddress: async (payload: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.customers.addresses.addAddress({ address: payload } as any, await mergeHeaders(headers)),
    deleteAddress: async (addressId: string, headers?: Record<string, string>) =>
      sdk.customers.addresses.deleteAddress(addressId, await mergeHeaders(headers)),
    updateAddress: async (addressId: string, payload: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.customers.addresses.updateAddress(addressId, payload as any, await mergeHeaders(headers)),
    generatePasswordToken: async (email: string, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.customers.generatePasswordToken({ email } as any, await mergeHeaders(headers)),
    resetPassword: async (payload: { email: string; token: string; password: string }, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.customers.resetPassword(payload as any, await mergeHeaders(headers)),
  },
  order: {
    requestTransfer: async (id: string, _payload?: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.orders.requestCustomerOrders({ order_ids: [id] } as any, await mergeHeaders(headers)),
    acceptTransfer: async (id: string, payload: Record<string, unknown>, _opts?: unknown, headers?: Record<string, string>) =>
      sdk.orders.confirmRequest({ token: payload?.token } as any, await mergeHeaders(headers)),
    declineTransfer: async () => {
      throw new Error("Order transfer decline is not supported in Medusa v1 compatibility mode")
    },
  },
  payment: {
    initiatePaymentSession: async (cart: any, data: { provider_id: string }, _opts?: unknown, headers?: Record<string, string>) => {
      const merged = await mergeHeaders(headers)
      if (!cart?.id) {
        throw new Error("Cart ID is required to initiate payment session")
      }
      try {
        await sdk.carts.createPaymentSessions(cart.id, merged)
      } catch (e: any) {
        const status = e?.response?.status || e?.status
        const data = e?.response?.data || e?.data
        if (status === 409 || data?.type === "duplicate_error") {
          // Payment sessions already exist — continue
        } else {
          console.error("[createPaymentSessions] Error:", JSON.stringify({ status, data, message: e?.message }))
          throw e
        }
      }
      return sdk.carts.setPaymentSession(cart.id, { provider_id: data.provider_id } as any, merged)
    },
  },
}

;(sdk as any).store = store
const auth = sdk.auth as any

auth.getToken = async (
  payload: { email: string; password: string },
  headers: Record<string, string> = {}
) => sdk.client.request("POST", "/store/auth/token", payload, undefined, headers)

auth.register = async (type: string, method: string, payload: any) => {
  if (type !== "customer" || method !== "emailpass") {
    throw new Error("Only customer/emailpass registration is supported in Medusa v1 compatibility mode")
  }

  await sdk.customers.create(payload as any)
  const { access_token } = await auth.getToken({
    email: payload.email,
    password: payload.password,
  })

  return access_token
}

auth.login = async (type: string, method: string, payload: any) => {
  if (type !== "customer" || method !== "emailpass") {
    throw new Error("Only customer/emailpass login is supported in Medusa v1 compatibility mode")
  }

  const { access_token } = await auth.getToken({
    email: payload.email,
    password: payload.password,
  })

  return access_token
}

;(sdk as any).auth.logout = async (headers?: Record<string, string>) => sdk.client.fetch("/store/auth", { method: "DELETE", headers })
