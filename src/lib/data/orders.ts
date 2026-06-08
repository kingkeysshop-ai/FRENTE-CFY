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
export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
) => {
  const authHeaders = await getAuthHeaders()
  if (!authHeaders?.authorization) {
    return []
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  const query: Record<string, any> = {
    limit,
    offset,
    expand: "items,shipping_address,billing_address,payment_collections",
  }

  if (filters?.status) {
    query.status = filters.status
  }
  if (filters?.["created_at[gte]"]) {
    query["created_at[gte]"] = filters["created_at[gte]"]
  }
  if (filters?.["created_at[lte]"]) {
    query["created_at[lte]"] = filters["created_at[lte]"]
  }

  try {
    const { orders } = await sdk.client
      .fetch<{ orders: HttpTypes.StoreOrder[] }>(
        `/store/orders`,
        {
          method: "GET",
          query,
          headers: {
            ...authHeaders,
          },
          next,
          cache: "force-cache",
        }
      )
    return orders || []
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