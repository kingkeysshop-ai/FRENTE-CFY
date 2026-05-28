"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: any[] }>(`/store/regions`, {
      method: "GET",
      next,
    })
    .then(({ regions }) => regions)
    .catch(() => null)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: any }>(`/store/regions/${id}`, {
      method: "GET",
      next,
    })
    .then(({ region }) => region)
    .catch(() => null)
}

export const getRegion = async (countryCode: string) => {
  try {
    const regions = await listRegions()

    if (!regions || !countryCode) {
      return null
    }

    const found = regions.find((r: any) =>
      r.countries?.some((c: any) => c?.iso_2?.toLowerCase() === countryCode.toLowerCase())
    )

    return found || regions[0] || null
  } catch (e: any) {
    return null
  }
}
