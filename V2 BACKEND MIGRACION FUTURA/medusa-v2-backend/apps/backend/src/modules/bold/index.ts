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

class BoldPaymentService extends AbstractPaymentProvider {
  static identifier = "bold"

  constructor(container: Record<string, unknown>, options: Record<string, unknown> = {}) {
    super(container, options)
  }

  private getApiKey(): string {
    return process.env.BOLD_API_KEY || ""
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const response = await fetch("https://api.bold.co/v1/payment-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getApiKey()}`,
      },
      body: JSON.stringify({
        amount: input.amount,
        currency: input.currency_code,
        reference: (input.context as any)?.order_id || (input.context as any)?.cart_id,
        description: (input.context as any)?.description || "Compra en El Reino Digital",
        callback_url: `${process.env.BACKEND_URL}/hooks/bold/webhook`,
        return_url: (input.context as any)?.success_url,
      }),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      throw new Error(`Bold initiation failed: ${JSON.stringify(errBody)}`)
    }

    const data = await response.json()

    return {
      id: data.id || data.payment_id || "",
      data: {
        redirect_url: data.url || data.payment_url,
        payment_id: data.id || data.payment_id,
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
    if (data?.status === "APPROVED" || data?.status === "success") {
      return {
        action: "captured",
        data: {
          session_id: data.payment_id || "",
          amount: data.amount || 0,
        },
      }
    }
    return { action: "not_supported", data: { session_id: "", amount: 0 } }
  }
}

export default ModuleProvider(Modules.PAYMENT, {
  services: [BoldPaymentService],
})
