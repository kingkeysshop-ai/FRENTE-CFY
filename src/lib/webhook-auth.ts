import crypto from "crypto"
import { NextRequest } from "next/server"

export function validateWebhookSecret(
  req: NextRequest,
  envSecret?: string
): { valid: boolean; reason?: string } {
  if (!envSecret) {
    return { valid: false, reason: "AURPAY_WEBHOOK_SECRET not configured on server" }
  }

  const token = req.nextUrl.searchParams.get("token")
  const cartId = req.nextUrl.searchParams.get("cart_id")

  if (!token || !cartId) {
    return { valid: false, reason: "Missing webhook token or cart_id" }
  }

  const expected = crypto
    .createHmac("sha256", envSecret)
    .update(cartId)
    .digest("hex")

  try {
    if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
      return { valid: false, reason: "Invalid webhook token" }
    }
  } catch {
    return { valid: false, reason: "Invalid webhook token format" }
  }

  return { valid: true }
}
