import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@lib/rate-limit"

const BOLD_API_KEY = process.env.BOLD_API_KEY
const BOLD_API_URL = process.env.BOLD_API_URL || "https://integrations.api.bold.co"

async function boldFetch(path: string, options: RequestInit = {}) {
  const url = `${BOLD_API_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `x-api-key ${BOLD_API_KEY!}`,
      ...(options.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(`Bold API error ${res.status}: ${JSON.stringify(data)}`)
  }
  return data
}

export async function GET(req: NextRequest) {
  if (!BOLD_API_KEY) {
    return NextResponse.json({ error: "BOLD_API_KEY not configured" }, { status: 500 })
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`bold-datfono:${ip}`, 10, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const action = req.nextUrl.searchParams.get("action") || "terminals"

    if (action === "payment-methods") {
      const data = await boldFetch("/payments/payment-methods")
      return NextResponse.json(data.payload || data)
    }

    const data = await boldFetch("/payments/binded-terminals")
    return NextResponse.json(data.payload || data)
  } catch (err: any) {
    console.error("[Bold Datáfono] Error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!BOLD_API_KEY) {
    return NextResponse.json({ error: "BOLD_API_KEY not configured" }, { status: 500 })
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`bold-datfono:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const body = await req.json()
    const {
      amount,
      currency,
      payment_method,
      terminal_model,
      terminal_serial,
      reference,
      user_email,
      description,
      payer,
    } = body

    if (!amount || !currency || !terminal_model || !terminal_serial || !reference) {
      return NextResponse.json(
        { error: "Missing required fields: amount, currency, terminal_model, terminal_serial, reference" },
        { status: 400 }
      )
    }

    const payload: Record<string, any> = {
      amount: {
        currency: currency.toUpperCase(),
        total: Math.round(Number(amount)),
        taxes: [],
        tip_amount: 0,
      },
      payment_method: payment_method || "POS",
      terminal_model,
      terminal_serial,
      reference,
      user_email: user_email || "venta@elreino.digital",
      description: description || "Compra en El Reino Digital",
    }

    if (payer) {
      payload.payer = payer
    }

    const data = await boldFetch("/payments/app-checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return NextResponse.json(data.payload || data)
  } catch (err: any) {
    console.error("[Bold Datáfono] Error creating payment:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
