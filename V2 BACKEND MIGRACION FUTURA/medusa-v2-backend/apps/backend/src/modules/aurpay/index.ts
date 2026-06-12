import { AbstractPaymentProvider, ModuleProvider, Modules } from "@medusajs/framework/utils"
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

class AurpayPaymentService extends AbstractPaymentProvider {
  static identifier = "aurpay"

  constructor(container: Record<string, unknown>, options: Record<string, unknown> = {}) {
    super(container, options)
  }

  private getBaseUrl(): string {
    return process.env.AURPAY_API_BASE || "https://api.aurpay.net"
  }

  private getApiKey(): string {
    return process.env.AURPAY_API_KEY || ""
  }

  private getWebhookSecret(): string {
    return process.env.AURPAY_WEBHOOK_SECRET || ""
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const webhookToken = crypto.randomBytes(32).toString("hex")
    const hmac = crypto
      .createHmac("sha256", this.getWebhookSecret())
      .update(webhookToken)
      .digest("hex")

    const callbackUrl = `${process.env.BACKEND_URL}/hooks/aurpay/webhook?token=${webhookToken}&hmac=${hmac}`

    const response = await fetch(`${this.getBaseUrl()}/api/order/pay-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": this.getApiKey(),
      },
      body: JSON.stringify({
        price_amount: input.amount,
        price_currency: input.currency_code,
        order_id: (input.context as any)?.order_id || (input.context as any)?.cart_id,
        callback_url: callbackUrl,
        success_url: (input.context as any)?.success_url,
        cancel_url: (input.context as any)?.cancel_url,
      }),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      throw new Error(`Aurpay initiation failed: ${JSON.stringify(errBody)}`)
    }

    const data = await response.json()

    return {
      id: data.id || data.invoice_id || webhookToken,
      data: {
        redirect_url: data.url,
        invoice_id: data.invoice_id || data.id,
        webhook_token: webhookToken,
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
    const data = payload.data as any
    if (data?.status === "SUCCEED") {
      return {
        action: "captured",
        data: {
          session_id: data.session_id || "",
          amount: data.amount || 0,
        },
      }
    }
    return { action: "not_supported", data: { session_id: "", amount: 0 } }
  }
}

export default ModuleProvider(Modules.PAYMENT, {
  services: [AurpayPaymentService],
})
