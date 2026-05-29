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
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"
import { getLocale } from "@lib/data/locale-actions"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string, expand?: string) {
  const id = cartId || (await getCartId())
  expand ??=
    "items,items.variant,items.variant.product,region,shipping_methods,payment_sessions,shipping_address,billing_address"

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  return await sdk.client
    .fetch<{ cart: HttpTypes.StoreCart }>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        expand,
      },
      headers,
      next,
    })
    .then(({ cart }) => cart)
    .catch(() => null)
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart()

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    const locale = await getLocale()
    const cartResp = await (sdk as any).store.cart.create(
      { region_id: region.id, locale: locale || undefined },
      {},
      headers
    )
    const createdCart = cartResp.cart as HttpTypes.StoreCart
    await setCartId(createdCart.id)
    cart = createdCart

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (!cart) {
    throw new Error("Unable to initialize cart")
  }

  if (cart.region_id !== region.id) {
    await (sdk as any).store.cart.update(cart.id, { region_id: region.id }, {}, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  return cart
}

export async function updateCart(data: any) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const { cart } = await (sdk as any).store.cart
      .update(cartId, data, {}, headers) as { cart: HttpTypes.StoreCart }

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)

    return cart
  } catch (e: any) {
    throw new Error("Error al actualizar el carrito. Intenta de nuevo.")
  }
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await (sdk as any).store.cart
      .createLineItem(
        cart.id,
        {
          variant_id: variantId,
          quantity,
        },
        {},
        headers
      )

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)
  } catch (e: any) {
    const isNotFound = e?.response?.status === 404 || e?.type === "not_found"
    if (isNotFound) {
      console.error(
        "addToCart failed: variant not found",
        JSON.stringify({ variantId, cartId: cart.id, countryCode })
      )
      try {
        const productsCacheTag = await getCacheTag("products")
        revalidateTag(productsCacheTag)
      } catch {}
      throw new Error(
        "Este producto ya no está disponible. Por favor, recarga la página para ver los productos actualizados."
      )
    }
    throw new Error("Error al agregar el producto al carrito. Intenta de nuevo.")
  }

  return await retrieveCart(cart.id)
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await (sdk as any).store.cart
      .updateLineItem(cartId, lineId, { quantity }, {}, headers)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)
  } catch (e: any) {
    throw new Error("Error al actualizar el producto. Intenta de nuevo.")
  }

  return await retrieveCart(cartId)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await (sdk as any).store.cart
      .deleteLineItem(cartId, lineId, {}, headers)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)
  } catch (e: any) {
    throw new Error("Error al eliminar el producto. Intenta de nuevo.")
  }

  return await retrieveCart(cartId)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await (sdk as any).store.cart
      .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  } catch (e: any) {
    if (e?.response?.status === 404) {
      throw new Error(
        "El método de envío seleccionado no está disponible en este momento. Intenta con otra opción."
      )
    }
    throw new Error("Error al seleccionar método de envío. Intenta de nuevo.")
  }
}

export async function initiatePaymentSession(
  cart: any,
  data: any
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await (sdk as any).store.payment
      .initiatePaymentSession(cart, data, {}, headers)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  } catch (e: any) {
    throw new Error("Error al iniciar sesión de pago. Intenta de nuevo.")
  }
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cart = await retrieveCart(cartId)
  const existingCodes = cart?.discounts?.map((d: any) => d.code) || []
  const mergedCodes = Array.from(new Set([...existingCodes, ...codes]))

  try {
    await (sdk as any).store.cart
      .update(cartId, { discount_codes: mergedCodes }, {}, headers)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)
  } catch (e: any) {
    throw new Error("Error al aplicar código de descuento. Intenta de nuevo.")
  }
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: formData.get("shipping_address.address_2") || "",
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
      email: formData.get("email"),
    } as any

    const sameAsBilling = formData.get("same_as_billing")
    if (sameAsBilling === "on") data.billing_address = data.shipping_address

    if (sameAsBilling !== "on")
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: formData.get("billing_address.address_2") || "",
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      }
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  const countryCode = formData.get("shipping_address.country_code") || formData.get("billing_address.country_code") || "gb"
  redirect(
    `/${countryCode}/checkout?step=delivery`
  )
}

export async function setDigitalInfo(currentState: unknown, formData: FormData) {
  try {
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error("No existing cart found")
    }

    const email = formData.get("email") as string
    const firstName = formData.get("first_name") as string
    const lastName = formData.get("last_name") as string

    if (!email) {
      throw new Error("El email es obligatorio")
    }

    const cart = await retrieveCart(cartId)
    if (!cart) {
      throw new Error("Cart not found")
    }

    const countryCode = cart.region?.countries?.[0]?.iso_2 || "gb"

    await updateCart({
      email,
      shipping_address: {
        first_name: firstName,
        last_name: lastName,
        address_1: "-",
        city: "-",
        postal_code: "-",
        country_code: countryCode,
        province: "",
        phone: "",
      },
      billing_address: {
        first_name: firstName,
        last_name: lastName,
        address_1: "-",
        city: "-",
        postal_code: "-",
        country_code: countryCode,
        province: "",
        phone: "",
      },
    })

    const { shipping_options } = await listCartOptions()
    if (shipping_options?.length > 0) {
      await setShippingMethod({
        cartId,
        shippingMethodId: shipping_options[0].id,
      })
    }
  } catch (e: any) {
    return e.message
  }

  redirect(`/gb/checkout?step=payment`)
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  let cartRes: any
  try {
    cartRes = await (sdk as any).store.cart
      .complete(id, {}, headers)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  } catch (e: any) {
    throw new Error("Error al procesar el pedido. Intenta de nuevo.")
  }

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase() || "gb"

    const orderCacheTag = await getCacheTag("orders")
    revalidateTag(orderCacheTag)

    await removeCartId()
    redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`)
  }

  return cartRes.cart
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()
  if (!cartId) {
    return { shipping_options: [] }
  }
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>(`/store/shipping-options/${cartId}`, {
    next,
    headers,
  })
}
