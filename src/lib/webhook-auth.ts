import { NextRequest } from "next/server"

export function validateWebhookSecret(
  req: NextRequest,
  envSecret?: string
): { valid: boolean; reason?: string } {
  if (!envSecret) {
    return { valid: false, reason: "AURPAY_WEBHOOK_SECRET not configured on server" }
  }

  const secret = req.nextUrl.searchParams.get("secret")
  if (!secret) {
    return { valid: false, reason: "Missing webhook secret" }
  }

  if (secret !== envSecret) {
    return { valid: false, reason: "Invalid webhook secret" }
  }

  return { valid: true }
}
