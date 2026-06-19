import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { checkRateLimit } from "@lib/rate-limit"

const BOLD_WEBHOOK_SECRET = process.env.BOLD_WEBHOOK_SECRET
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY

const PROCESSED_EVENTS = new Set<string>()

function verifyBoldSignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const encoded = Buffer.from(rawBody).toString("base64")
    const expected = crypto.createHmac("sha256", secret).update(encoded).digest("hex")
    if (expected.length !== signature.length) return false
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

async function completeCart(cartId: string): Promise<{ ok: boolean; orderId?: string; alreadyCompleted?: boolean }> {
  try {
    const checkRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}`,
      { headers: { "x-publishable-api-key": MEDUSA_API_KEY! } }
    )
    if (checkRes.ok) {
      const { cart } = await checkRes.json()
      if (cart?.completed_at) {
        const orderCheck = await fetch(
          `${MEDUSA_BACKEND_URL}/store/orders?cart_id=${cartId}`,
          { headers: { "x-publishable-api-key": MEDUSA_API_KEY! } }
        )
        if (orderCheck.ok) {
          const { orders } = await orderCheck.json()
          if (orders?.length > 0) {
            console.log(`[Bold Webhook] Cart ${cartId} already completed (order ${orders[0].id})`)
            return { ok: true, orderId: orders[0].id, alreadyCompleted: true }
          }
        }
      }
    }
  } catch (e: any) {
    console.warn(`[Bold Webhook] Could not check cart status for ${cartId}: ${e.message}`)
  }

  try {
    const medusaRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": MEDUSA_API_KEY!,
        },
      }
    )

    const medusaData = await medusaRes.json()

    if (!medusaRes.ok) {
      const isCompleted = medusaData?.type === "order"
      if (isCompleted) {
        console.log(`[Bold Webhook] Cart ${cartId} completed on retry (order ${medusaData?.data?.id})`)
        return { ok: true, orderId: medusaData?.data?.id }
      }
      console.error(`[Bold Webhook] Failed to complete cart ${cartId}: ${JSON.stringify(medusaData)}`)
      return { ok: false }
    }

    console.log(`[Bold Webhook] Cart ${cartId} completed successfully (order ${medusaData?.data?.id})`)
    return { ok: true, orderId: medusaData?.data?.id }
  } catch (e: any) {
    console.error(`[Bold Webhook] Error completing cart ${cartId}: ${e.message}`)
    return { ok: false }
  }
}

function extractCartId(data: any): string | null {
  const ref = data?.metadata?.reference || ""
  if (ref.startsWith("cart_") || ref.startsWith("ord_")) return ref
  return ref || null
}

export async function POST(req: NextRequest) {
  if (!MEDUSA_BACKEND_URL || !MEDUSA_API_KEY) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`bold-webhook:${ip}`, 20, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const rawBody = await req.text()
    let body: any
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const signature = req.headers.get("x-bold-signature") || ""
    const secret = BOLD_WEBHOOK_SECRET || ""

    if (signature) {
      const isValid = verifyBoldSignature(rawBody, signature, secret)
      if (!isValid) {
        console.warn(`[Bold Webhook] Invalid signature`)
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
      }
    }

    const eventType = body.type || ""
    const eventData = body.data || body
    const notificationId = body.id || ""
    const paymentId = eventData.payment_id || ""

    if (notificationId && PROCESSED_EVENTS.has(notificationId)) {
      console.log(`[Bold Webhook] Duplicate event ${notificationId}, skipping`)
      return NextResponse.json({ received: true })
    }

    if (notificationId) {
      PROCESSED_EVENTS.add(notificationId)
      if (PROCESSED_EVENTS.size > 1000) {
        const arr = Array.from(PROCESSED_EVENTS)
        const toRemove = arr.slice(0, 500)
        toRemove.forEach(id => PROCESSED_EVENTS.delete(id))
      }
    }

    console.log(`[Bold Webhook] Event: ${eventType} | payment: ${paymentId} | ref: ${eventData?.metadata?.reference}`)

    if (eventType === "SALE_APPROVED" || eventType === "sale.approved") {
      const cartId = extractCartId(eventData)
      if (!cartId) {
        console.warn(`[Bold Webhook] No cartId found in event data`)
        return NextResponse.json({ received: true })
      }

      const result = await completeCart(cartId)
      if (result.ok) {
        return NextResponse.json({ received: true, orderId: result.orderId })
      }
      return NextResponse.json(
        { error: "Failed to complete order" },
        { status: 500 }
      )
    }

    if (eventType === "SALE_REJECTED" || eventType === "sale.rejected") {
      console.log(`[Bold Webhook] Payment ${paymentId} rejected — no action needed`)
      return NextResponse.json({ received: true, status: "rejected" })
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error(`[Bold Webhook] Internal error:`, err.message)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
