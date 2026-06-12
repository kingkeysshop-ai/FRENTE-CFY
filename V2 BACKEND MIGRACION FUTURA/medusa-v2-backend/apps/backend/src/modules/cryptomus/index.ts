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

class CryptomusPaymentService extends AbstractPaymentProvider {
  static identifier = "cryptomus"

  constructor(container: Record<string, unknown>, options: Record<string, unknown> = {}) {
    super(container, options)
  }

  private getMerchantId(): string {
    return process.env.CRYPTOMUS_MERCHANT_ID || ""
  }

  private getApiKey(): string {
    return process.env.CRYPTOMUS_API_KEY || ""
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const payload = {
      amount: input.amount,
      currency: input.currency_code,
      order_id: (input.context as any)?.order_id || (input.context as any)?.cart_id,
      url_callback: `${process.env.BACKEND_URL}/hooks/cryptomus/webhook`,
      url_return: (input.context as any)?.success_url,
      url_success: (input.context as any)?.success_url,
    }

    const sign = crypto
      .createHash("md5")
      .update(Buffer.from(JSON.stringify(payload)).toString("base64") + this.getApiKey())
      .digest("hex")

    const response = await fetch("https://api.cryptomus.com/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant: this.getMerchantId(),
        sign,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      throw new Error(`Cryptomus initiation failed: ${JSON.stringify(errBody)}`)
    }

    const data = await response.json()

    return {
      id: data.result?.uuid || data.result?.order_id || "",
      data: {
        redirect_url: data.result?.url,
        uuid: data.result?.uuid,
        order_id: data.result?.order_id,
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
    if (data?.status === "paid" || data?.status === "success") {
      return {
        action: "captured",
        data: {
          session_id: data.uuid || "",
          amount: data.amount || 0,
        },
      }
    }
    return { action: "not_supported", data: { session_id: "", amount: 0 } }
  }
}

export default ModuleProvider(Modules.PAYMENT, {
  services: [CryptomusPaymentService],
})
