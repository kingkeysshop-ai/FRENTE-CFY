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

class OxapayPaymentService extends AbstractPaymentProvider {
  static identifier = "oxapay"

  constructor(container: Record<string, unknown>, options: Record<string, unknown> = {}) {
    super(container, options)
  }

  private getApiKey(): string {
    return process.env.OXAPAY_MERCHANT_API_KEY || ""
  }

  private getBaseUrl(): string {
    return process.env.OXAPAY_API_BASE || "https://api.oxapay.com/v1"
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const storeUrl = process.env.STORE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
    const backendUrl = process.env.BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

    const payload: Record<string, unknown> = {
      amount: input.amount,
      currency: input.currency_code?.toUpperCase() || "USD",
      order_id: (input.context as any)?.order_id || (input.context as any)?.cart_id,
      callback_url: `${backendUrl}/api/hooks/oxapay`,
      return_url: (input.context as any)?.success_url || `${storeUrl}/payment/success?cart_id=${(input.context as any)?.cart_id}&provider=oxapay`,
      description: (input.context as any)?.description || `Order ${(input.context as any)?.cart_id}`,
      email: (input.context as any)?.email,
      lifetime: 60,
      fee_paid_by_payer: 1,
      under_paid_coverage: 0,
      sandbox: process.env.NODE_ENV !== "production",
    }

    const response = await fetch(`${this.getBaseUrl()}/payment/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "merchant_api_key": this.getApiKey(),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Oxapay initiation failed: ${JSON.stringify(errBody)}`)
    }

    const result = await response.json()

    return {
      id: result.data?.track_id || "",
      data: {
        redirect_url: result.data?.payment_url,
        track_id: result.data?.track_id,
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
    if (data?.status === "Paid") {
      return {
        action: "captured",
        data: {
          session_id: data.track_id || "",
          amount: data.amount || 0,
        },
      }
    }
    return { action: "not_supported", data: { session_id: "", amount: 0 } }
  }
}

export default ModuleProvider(Modules.PAYMENT, {
  services: [OxapayPaymentService],
})
