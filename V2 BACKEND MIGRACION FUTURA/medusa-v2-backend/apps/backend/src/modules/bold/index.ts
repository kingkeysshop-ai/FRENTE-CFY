import { AbstractPaymentProvider, MedusaError, ModuleProvider, Modules } from "@medusajs/framework/utils"
import type {
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  ProviderWebhookPayload,
  WebhookActionResult,
} from "@medusajs/framework/types"
import crypto from "crypto"

class BoldPaymentService extends AbstractPaymentProvider {
  static identifier = "bold"

  constructor(container: Record<string, unknown>, options: Record<string, unknown> = {}) {
    super(container, options)
  }

  private getApiKey(): string {
    return process.env.BOLD_API_KEY || ""
  }

  private getSecretKey(): string {
    return process.env.BOLD_SECRET_KEY || ""
  }

  private getBaseUrl(): string {
    return process.env.BOLD_API_URL || "https://integrations.api.bold.co"
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const totalAmount = Math.round((Number(input.amount) || 0) / 100)
    const reference = (input.context as any)?.order_id || (input.context as any)?.cart_id || `ORD-${Date.now()}`
    const returnUrl = (input.context as any)?.success_url || `${process.env.BACKEND_URL}/payment/success?cart_id=${reference}`
    const callbackUrl = `${process.env.BACKEND_URL}/hooks/bold`

    const response = await fetch(`${this.getBaseUrl()}/online/link/v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `x-api-key ${this.getApiKey()}`,
      },
      body: JSON.stringify({
        amount_type: "CLOSE",
        amount: {
          currency: (input.currency_code || "COP").toUpperCase(),
          total: totalAmount,
          taxes: [],
          tip_amount: 0,
        },
        description: (input.context as any)?.description || "Compra en El Reino Digital",
        reference,
        callback_url: callbackUrl,
        return_url: returnUrl,
        payer_email: (input.context as any)?.email || "",
        payment_methods: ["CREDIT_CARD", "PSE", "NEQUI", "BOTON_BANCOLOMBIA"],
      }),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Bold initiation failed: ${JSON.stringify(errBody)}`)
    }

    const data = await response.json()
    const payload = data.payload || data

    return {
      id: payload.payment_link || payload.id || "",
      data: {
        redirect_url: payload.url || payload.payment_url,
        payment_link: payload.payment_link || payload.id,
      },
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    return { status: "authorized" as const, data: input.data as Record<string, unknown> }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return { data: input.data as Record<string, unknown> }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: {} }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data as Record<string, unknown> }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    return { status: "authorized" as const }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    return { data: input.data as Record<string, unknown> }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return { data: input.data as Record<string, unknown> }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: input.data as Record<string, unknown> }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const rawPayload = payload as any
    const headers = rawPayload?.headers || {}
    const body = rawPayload?.body || rawPayload?.data || {}

    const receivedSignature = headers["x-bold-signature"] || ""
    const secretKey = this.getSecretKey()
    if (secretKey && receivedSignature) {
      const rawBody = typeof rawPayload?.rawBody === "string" ? rawPayload.rawBody : JSON.stringify(body)
      const encoded = Buffer.from(rawBody).toString("base64")
      const expected = crypto.createHmac("sha256", secretKey).update(encoded).digest("hex")
      if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSignature))) {
        console.warn("[Bold Webhook] Invalid signature")
        return { action: "not_supported", data: { session_id: "", amount: 0 } }
      }
    }

    const eventType = body.type || ""
    const eventData = body.data || body

    if (eventType === "SALE_APPROVED") {
      return {
        action: "captured",
        data: {
          session_id: eventData.payment_id || eventData.metadata?.reference || "",
          amount: eventData.amount?.total || 0,
        },
      }
    }

    if (eventType === "SALE_REJECTED") {
      return {
        action: "canceled",
        data: {
          session_id: eventData.payment_id || "",
          amount: 0,
        },
      }
    }

    return { action: "not_supported", data: { session_id: "", amount: 0 } }
  }
}

export default ModuleProvider(Modules.PAYMENT, {
  services: [BoldPaymentService],
})
