import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { checkRateLimit } from "@lib/rate-limit"

const OXAPAY_MERCHANT_API_KEY = process.env.OXAPAY_MERCHANT_API_KEY
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY || process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const MEDUSA_ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL || "admin@elreino.digital"
const MEDUSA_ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD

const h = { "Content-Type": "application/json", "x-publishable-api-key": MEDUSA_API_KEY! }

function verifyWebhookSignature(rawBody: string, receivedHmac: string, apiKey: string): boolean {
  try {
    const expectedHmac = crypto.createHmac("sha512", apiKey).update(rawBody).digest("hex")
    if (expectedHmac.length !== receivedHmac.length) return false
    return crypto.timingSafeEqual(Buffer.from(expectedHmac), Buffer.from(receivedHmac))
  } catch { return false }
}

async function completeCart(cartId: string): Promise<{ ok: boolean; orderId?: string; alreadyCompleted?: boolean }> {
  try {
    const checkRes = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, { headers: h })
    if (checkRes.ok) {
      const { cart } = await checkRes.json()
      if (cart?.completed_at) {
        const orderCheck = await fetch(`${MEDUSA_BACKEND_URL}/store/orders?cart_id=${cartId}`, { headers: h })
        if (orderCheck.ok) {
          const { orders } = await orderCheck.json()
          if (orders?.length > 0) {
            console.log(`[Oxapay Webhook] Cart ${cartId} already completed (order ${orders[0].id})`)
            return { ok: true, orderId: orders[0].id, alreadyCompleted: true }
          }
        }
      }
    }
  } catch (e: any) { console.warn(`[Oxapay Webhook] Could not check cart status for ${cartId}: ${e.message}`) }

  // Try to login to admin and add cryptomus to region, then create session and complete
  try {
    if (MEDUSA_ADMIN_PASSWORD) {
      const loginRes = await fetch(`${MEDUSA_BACKEND_URL}/admin/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: MEDUSA_ADMIN_EMAIL, password: MEDUSA_ADMIN_PASSWORD }),
      })
      if (loginRes.ok) {
        const { access_token } = await loginRes.json()
        const auth = { "Content-Type": "application/json", Authorization: `Bearer ${access_token}` }

        // Get cart region
        const cartRes = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, { headers: h })
        if (cartRes.ok) {
          const { cart } = await cartRes.json()
          const regionId = cart?.region_id

          if (regionId) {
            // Add cryptomus to region via admin API
            await fetch(`${MEDUSA_BACKEND_URL}/admin/regions/${regionId}/payment-providers`, {
              method: "POST", headers: auth,
              body: JSON.stringify({ provider_id: "pp_cryptomus_cryptomus" }),
            })

            // Create payment session
            await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/payment-sessions`, {
              method: "POST", headers: h, body: JSON.stringify({}),
            })
            await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/payment-session`, {
              method: "POST", headers: h,
              body: JSON.stringify({ provider_id: "pp_cryptomus_cryptomus" }),
            }).catch(() => {})
          }
        }
      }
    }
  } catch (e: any) { console.warn(`[Oxapay Webhook] Admin setup failed: ${e.message}`) }

  try {
    const medusaRes = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`, {
      method: "POST", headers: h,
    })
    const medusaData = await medusaRes.json()

    if (!medusaRes.ok) {
      if (medusaData?.type === "order") return { ok: true, orderId: medusaData?.data?.id }
      console.error(`[Oxapay Webhook] Failed to complete cart ${cartId}: ${JSON.stringify(medusaData)}`)
      return { ok: false }
    }

    console.log(`[Oxapay Webhook] Cart ${cartId} completed (order ${medusaData?.data?.id})`)
    return { ok: true, orderId: medusaData?.data?.id }
  } catch (e: any) {
    console.error(`[Oxapay Webhook] Error completing cart ${cartId}: ${e.message}`)
    return { ok: false }
  }
}

export async function POST(req: NextRequest) {
  if (!OXAPAY_MERCHANT_API_KEY || !MEDUSA_BACKEND_URL || !MEDUSA_API_KEY) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`oxapay-webhook:${ip}`, 20, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const rawBody = await req.text()
    const hmacHeader = req.headers.get("hmac") || ""

    if (!hmacHeader || !verifyWebhookSignature(rawBody, hmacHeader, OXAPAY_MERCHANT_API_KEY)) {
      console.warn(`[Oxapay Webhook] Invalid HMAC signature`)
      return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    const { status, order_id, track_id, description } = body

    console.log(`[Oxapay Webhook] Received status="${status}" order_id="${order_id}" track_id="${track_id}"`)

    const cartId = order_id || description

    if (status === "Paid") {
      if (!cartId) {
        return NextResponse.json({ error: "Missing cart reference" }, { status: 400 })
      }

      const result = await completeCart(cartId)
      if (result.ok) {
        return new NextResponse("ok", { status: 200 })
      }

      return NextResponse.json(
        { error: "Failed to complete order" },
        { status: 500 }
      )
    }

    return new NextResponse("ok", { status: 200 })
  } catch (err: any) {
    console.error(`[Oxapay Webhook] Internal error:`, err.message)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
