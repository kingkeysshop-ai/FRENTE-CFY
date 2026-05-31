"use server"

import { sdk } from "@lib/config"
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
      })
      .then(({ customer }: any) => customer)
      .catch(() => null)
  }

// ─── Actualizar datos del cliente ─────────────────────────────────────────────
export const updateCustomer = async (body: any) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  let updateRes: any
  try {
    const res = await sdk.customers.update(body, headers) as any
    updateRes = res.customer
  } catch (e: any) {
    throw new Error("Error al actualizar datos del cliente. Intenta de nuevo.")
  }

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
    await sdk.customers.create({
      email: customerForm.email,
      first_name: customerForm.first_name,
      last_name: customerForm.last_name,
      phone: customerForm.phone,
      password,
    })

    const token = await (sdk.auth as any).login("emailpass", "customer", { email: customerForm.email, password })
    await setAuthToken(token)
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    return null
  } catch (error: any) {
    console.error("Error en registro de cliente (SDK V1):", error.response?.data || error.message)
    return error.response?.data?.message || error.message || "Error al crear la cuenta"
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
  const headers = await getAuthHeaders()
  await (sdk as any).auth.logout(headers)

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

  await (sdk as any).store.cart.transferCart(cartId, {}, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

// ─── Actualizar contraseña del cliente autenticado ────────────────────────────
export const updateCustomerPassword = async (
  _currentState: Record<string, unknown>,
  formData: FormData
): Promise<{ success: boolean; error: string | null }> => {
  const oldPassword = formData.get("old_password") as string
  const newPassword = formData.get("new_password") as string
  const confirmPassword = formData.get("confirm_password") as string

  if (!oldPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "Todos los campos son obligatorios" }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Las contraseñas nuevas no coinciden" }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.customers.update(
      { password: newPassword, old_password: oldPassword } as any,
      headers
    )
    const cacheTag = await getCacheTag("customers")
    revalidateTag(cacheTag)
    return { success: true, error: null }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Error al actualizar la contraseña",
    }
  }
}

// ─── Generar token de recuperación de contraseña ───────────────────────────────
export async function generatePasswordToken(
  _currentState: { error: string | null; submitted: boolean },
  formData: FormData
): Promise<{ error: string | null; submitted: boolean }> {
  const email = formData.get("email") as string
  if (!email) return { error: "El correo electrónico es obligatorio", submitted: true }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await (sdk as any).store.customer.generatePasswordToken(email, {}, headers)
    return { error: null, submitted: true }
  } catch (error: any) {
    return {
      error: error.response?.data?.message || error.message || "Error al enviar el correo de recuperación",
      submitted: true,
    }
  }
}

// ─── Restablecer contraseña ───────────────────────────────────────────────────
export async function resetPassword(
  _currentState: { error: string | null; submitted: boolean },
  formData: FormData
): Promise<{ error: string | null; submitted: boolean }> {
  const email = formData.get("email") as string
  const token = formData.get("token") as string
  const password = formData.get("password") as string
  const passwordConfirm = formData.get("password_confirm") as string

  if (!email || !token || !password) return { error: "Todos los campos son obligatorios", submitted: true }
  if (password !== passwordConfirm) return { error: "Las contraseñas no coinciden", submitted: true }

  try {
    await (sdk as any).store.customer.resetPassword({ email, token, password }, {}, {})
    return { error: null, submitted: true }
  } catch (error: any) {
    return {
      error: error.response?.data?.message || error.message || "Error al restablecer la contraseña",
      submitted: true,
    }
  }
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
): Promise<{ success: boolean; error: string | null }> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await sdk.client.fetch(`/store/customers/me/addresses/${addressId}`, {
      method: "DELETE",
      headers,
    })
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.toString() }
  }
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