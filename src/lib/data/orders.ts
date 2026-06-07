"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions, getAuthHeaders } from "./cookies"

// ─── Recuperar una orden por ID ───────────────────────────────────────────────
export const retrieveOrder = async (id: string) => {
  const next = {
    ...(await getCacheOptions("orders")),
  }

  return sdk.client
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
    .then(({ order }) => order)
}

// ─── Listar órdenes del cliente (Medusa v1) ──────────────────────────────────
export const listOrders = async (
  _limit: number = 10,
  _offset: number = 0,
  filters?: Record<string, any>
) => {
  const authHeaders = await getAuthHeaders()
  if (!authHeaders) {
    return []
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  const orders = await sdk.client
    .fetch<{ orders: HttpTypes.StoreOrder[] }>(
      `/store/orders`,
      {
        method: "GET",
        query: {
          expand: "items,shipping_address,billing_address,payment_collections",
        },
        headers: {
          ...authHeaders,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ orders }) => orders)

  if (!filters || Object.keys(filters).length === 0) {
    return orders
  }

  return orders.filter((order) => {
    let match = true
    if (filters.status && order.status !== filters.status) {
      match = false
    }
    if (filters["created_at[gte]"]) {
      const from = new Date(filters["created_at[gte]"])
      if (new Date(order.created_at) < from) {
        match = false
      }
    }
    if (filters["created_at[lte]"]) {
      const to = new Date(filters["created_at[lte]"])
      if (new Date(order.created_at) > to) {
        match = false
      }
    }
    return match
  })
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