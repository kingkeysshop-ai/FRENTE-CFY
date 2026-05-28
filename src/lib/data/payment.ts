"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listCartPaymentMethods = async (regionId: string) => {
  if (!regionId) return null

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(
      `/store/regions/${regionId}`,
      {
        method: "GET",
        headers,
        next,
      }
    )
    .then(({ region }) =>
      (region.payment_providers || []).sort((a: any, b: any) => {
        return a.id > b.id ? 1 : -1
      })
    )
    .catch(() => {
      return null
    })
}
