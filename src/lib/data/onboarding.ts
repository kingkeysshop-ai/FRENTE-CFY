"use server"
import { cookies as nextCookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_URL = process.env.ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:7001"

export async function resetOnboardingState(orderId: string) {
  const cookies = await nextCookies()
  cookies.set("_medusa_onboarding", "false", { maxAge: -1 })
  redirect(`${ADMIN_URL}/a/orders/${orderId}`)
}
