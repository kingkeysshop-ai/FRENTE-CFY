"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions, getAuthHeaders } from "./cookies"

// ─── Recuperar una orden por ID ───────────────────────────────────────────────
export const retrieveOrder = async (id: string) => {
  const next = {
    ...(await getCacheOptions("orders")),
  }

  try {
    const { order } = await sdk.client
      .fetch<{ order: HttpTypes.StoreOrder }>(
        `/store/orders/${id}`,
        {
          method: "GET",
          query: {
            expand: "items,items.variant,items.variant.product,items.thumbnail,shipping_address,billing_address,shipping_methods,payment_collections,fulfillments,fulfillments.tracking_links",
          },
          headers: {
            ...(await getAuthHeaders()),
          },
          next,
          cache: "force-cache",
        }
      )
    return order
  } catch (e: any) {
    return null
  }
}

// ─── Listar órdenes del cliente (Medusa v1) ──────────────────────────────────
// Medusa v1 /store/orders only supports lookup by display_id+email, not listing.
// Use the customer's orders from the authenticated user endpoint.
export const listOrders = async (
  _limit: number = 10,
  _offset: number = 0,
  filters?: Record<string, any>
) => {
  const authHeaders = await getAuthHeaders()
  if (!authHeaders?.authorization) {
    return []
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  try {
    const { customer } = await sdk.client
      .fetch<{ customer: { orders?: HttpTypes.StoreOrder[] } }>(
        `/store/customers/me`,
        {
          method: "GET",
          query: {
            expand: "orders,orders.items,orders.items.variant,orders.items.variant.product,orders.shipping_address,orders.billing_address,orders.payment_collections",
          },
          headers: {
            ...authHeaders,
          },
          next,
          cache: "force-cache",
        }
      )
    let orders = customer?.orders || []

    if (filters?.status) {
      orders = orders.filter((o: any) => o.status === filters.status)
    }
    if (filters?.["created_at[gte]"]) {
      const from = new Date(filters["created_at[gte]"])
      orders = orders.filter((o: any) => new Date(o.created_at) >= from)
    }
    if (filters?.["created_at[lte]"]) {
      const to = new Date(filters["created_at[lte]"])
      orders = orders.filter((o: any) => new Date(o.created_at) <= to)
    }

    return orders
  } catch (e: any) {
    return []
  }
}

// ─── Crear solicitud de transferencia de orden ────────────────────────────────
export const createTransferRequest = async (
  _currentState: {
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
  },
  formData: FormData
): Promise<{ success: true; error: null; order: HttpTypes.StoreOrder } | { success: false; error: string; order: null }> => {
  const orderId = formData.get("order_id") as string
  const headers = await getAuthHeaders()

  try {
    const { order } = await (sdk as any).store.order.requestTransfer(orderId, {}, {}, headers)

    return { success: true, error: null, order }
  } catch (error: any) {
    console.error("Error en transferencia de orden:", error.response?.data || error.message)
    return {
      success: false,
      error: "No se pudo transferir la orden. Intenta de nuevo.",
      order: null,
    }
  }
}

// ─── Aceptar solicitud de transferencia ──────────────────────────────────────
export const acceptTransferRequest = async (
  orderId: string,
  token: string
): Promise<{ order: HttpTypes.StoreOrder }> => {
  const headers = await getAuthHeaders()

  return (sdk as any).store.order.acceptTransfer(orderId, { token }, {}, headers)
}

// ─── Rechazar solicitud de transferencia ─────────────────────────────────────
export const declineTransferRequest = async (
  orderId: string,
  token: string
): Promise<{ order: HttpTypes.StoreOrder }> => {
  const headers = await getAuthHeaders()

  return (sdk as any).store.order.declineTransfer(orderId, { token }, {}, headers)
}