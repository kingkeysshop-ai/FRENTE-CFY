"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"

// ─── Recuperar cliente autenticado ───────────────────────────────────────────
export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("customers")),
    }

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ customer }: any) => customer)
      .catch(() => null)
  }

// ─── Actualizar datos del cliente ─────────────────────────────────────────────
export const updateCustomer = async (body: any) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // ✅ SDK v2 — .update() solo acepta (body, headers)
  const updateRes = await sdk.customers
    .update(body, headers)
    .then(({ customer }: any) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

// ─── Registro de nuevo cliente ────────────────────────────────────────────────
export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    // ✅ CORRECCIÓN PARA SDK V1: Usar sdk.customers.create en lugar de sdk.store.customer
    // El recurso de clientes en Medusa V1 se crea con sdk.customers.create
    const customerResponse = await sdk.customers.create({
      email: customerForm.email,
      first_name: customerForm.first_name,
      last_name: customerForm.last_name,
      phone: customerForm.phone,
      password,
    })

    // Opcional: Si el backend requiere confirmación de email,
    // el usuario no estará logueado automáticamente.
    // Aquí podrías lanzar un error personalizado o manejar la respuesta.

    return null
  } catch (error: any) {
    console.error("Error en registro de cliente (SDK V1):", error.response?.data || error.message)
    throw error
  }
}

// ─── Login de cliente ─────────────────────────────────────────────────────────
export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // ✅ FIX SDK v2: login(provider, actor_type, body)
    // El método se inyecta en runtime desde la adaptación V1, así que forzamos el tipo aquí.
    await (sdk.auth as any)
      .login("emailpass", "customer", { email, password })
      .then(async (token: any) => {
        await setAuthToken(token as unknown as string)
        const customerCacheTag = await getCacheTag("customers")
        revalidateTag(customerCacheTag)
      })
  } catch (error: any) {
    return error.toString()
  }

  try {
    await transferCart()
  } catch (error: any) {
    return error.toString()
  }
}

// ─── Cerrar sesión ────────────────────────────────────────────────────────────
export async function signout(countryCode: string) {
  await sdk.auth.deleteSession()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

// ─── Transferir carrito al cliente autenticado ────────────────────────────────
export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.client.fetch(`/store/carts/${cartId}/transfer`, {
    method: "POST",
    headers: {
      ...headers,
    },
  })

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

// ─── Agregar dirección al cliente ─────────────────────────────────────────────
export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch(`/store/customers/me/addresses`, {
      method: "POST",
      headers,
      body: address,
    })
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err: any) => {
      return { success: false, error: err.toString() }
    })
}

// ─── Eliminar dirección del cliente ──────────────────────────────────────────
export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.client
    .fetch(`/store/customers/me/addresses/${addressId}`, {
      method: "DELETE",
      headers,
    })
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err: any) => {
      return { success: false, error: err.toString() }
    })
}

// ─── Actualizar dirección del cliente ────────────────────────────────────────
export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as any

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch(`/store/customers/me/addresses/${addressId}`, {
      method: "POST",
      headers,
      body: address,
    })
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err: any) => {
      return { success: false, error: err.toString() }
    })
}