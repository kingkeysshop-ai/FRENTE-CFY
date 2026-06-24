import { AbstractPaymentProvider, MedusaError, ModuleProvider, Modules } from "@medusajs/framework/utils"
import type {
  PaymentSessionStatus,
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

class BtcpayPaymentService extends AbstractPaymentProvider {
  static identifier = "btcpay"

  constructor(container: Record<string, unknown>, options: Record<string, unknown> = {}) {
    super(container, options)
  }

  private getApiKey(): string {
    return process.env.BTCPAY_API_KEY || ""
  }

  private getStoreId(): string {
    return process.env.BTCPAY_STORE_ID || ""
  }

  private getWebhookSecret(): string {
    return process.env.BTCPAY_WEBHOOK_SECRET || ""
  }

  private getApiUrl(): string {
    return (process.env.BTCPAY_API_URL || "https://btcpay.example.com").replace(/\/+$/, "")
  }

  private getStoreUrl(): string {
    const storeCors = process.env.STORE_CORS || ""
    return process.env.STORE_URL || storeCors.split(",")[0].trim() || "http://localhost:8000"
  }

  private getBackendUrl(): string {
    return process.env.BACKEND_URL || "http://localhost:9000"
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const apiKey = this.getApiKey()
    const storeId = this.getStoreId()
    const webhookSecret = this.getWebhookSecret()

    if (!apiKey) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "BTCPAY_API_KEY not configured")
    }
    if (!storeId) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "BTCPAY_STORE_ID not configured")
    }

    const cartId = (input.data as any)?.cart_id || (input.context as any)?.cart_id || ""
    const amount = Number((Number(input.amount) / 100).toFixed(2))
    const currency = input.currency_code?.toUpperCase() || "USD"
    const email = (input.context as any)?.email || ""

    if (!amount || amount <= 0) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid payment amount")
    }

    const token = crypto
      .createHmac("sha256", webhookSecret)
      .update(cartId)
      .digest("hex")

    const payload: Record<string, any> = {
      amount: String(amount),
      currency,
      metadata: {
        cartId,
        orderId: `cart_${cartId}`,
      },
      checkout: {
        redirectURL: `${this.getStoreUrl()}/payment/success?cart_id=${cartId}`,
      },
      notificationURL: `${this.getBackendUrl()}/hooks/btcpay?cart_id=${cartId}&token=${token}`,
    }

    if (email) {
      payload.notificationEmail = email
    }

    const response = await fetch(
      `${this.getApiUrl()}/api/v1/stores/${storeId}/invoices`,
      {
        method: "POST",
        headers: {
          "Authorization": `token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `BTCPay initiation failed: ${JSON.stringify(errBody)}`)
    }

    const data = await response.json()

    if (!data || !data.checkoutLink) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "BTCPay did not return a checkout link")
    }

    return {
      id: data.id,
      data: {
        redirect_url: data.checkoutLink,
        checkoutLink: data.checkoutLink,
        invoiceId: data.id,
        storeId,
        created_at: Date.now(),
      },
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const status = await this.getInvoiceStatus(input.data as Record<string, any>)
    if (status === "authorized") {
      return { status: "authorized", data: input.data as Record<string, unknown> }
    }
    return { status: "pending", data: input.data as Record<string, unknown> }
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
    const status = await this.getInvoiceStatus(input.data as Record<string, any>)
    return { status: status as PaymentSessionStatus }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    return { data: input.data as Record<string, unknown> }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    if (!input.data?.id) return { data: input.data as Record<string, unknown> }

    try {
      const invoiceId = (input.data as any).id
      const response = await fetch(
        `${this.getApiUrl()}/api/v1/stores/${this.getStoreId()}/invoices/${invoiceId}`,
        {
          headers: {
            "Authorization": `token ${this.getApiKey()}`,
          },
        }
      )
      if (response.ok) {
        const data = await response.json()
        return { data: { ...input.data as Record<string, unknown>, ...data } }
      }
    } catch {}

    return { data: input.data as Record<string, unknown> }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: input.data as Record<string, unknown> }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const data = payload.data as any
    if (data?.type === "InvoiceSettled") {
      return {
        action: "captured",
        data: {
          session_id: data.invoiceId || "",
          amount: data.amount || 0,
        },
      }
    }
    return { action: "not_supported", data: { session_id: "", amount: 0 } }
  }

  private mapBtcpayStatus(btcpayStatus: string): PaymentSessionStatus {
    switch (btcpayStatus) {
      case "Settled": return "authorized"
      case "New":
      case "Processing": return "pending"
      case "Expired":
      case "Invalid": return "error"
      default: return "pending"
    }
  }

  private async getInvoiceStatus(data: Record<string, any>): Promise<PaymentSessionStatus> {
    const invoiceId = data?.id || data?.invoiceId
    if (!invoiceId || !this.getApiKey() || !this.getStoreId()) {
      const s = data?.status
      if (["authorized","captured","pending","requires_more","error","canceled"].includes(s)) {
        return s as PaymentSessionStatus
      }
      return "pending"
    }

    try {
      const response = await fetch(
        `${this.getApiUrl()}/api/v1/stores/${this.getStoreId()}/invoices/${invoiceId}`,
        {
          headers: {
            "Authorization": `token ${this.getApiKey()}`,
          },
        }
      )

      if (response.ok) {
        const invoiceData = await response.json()
        return this.mapBtcpayStatus(invoiceData.status)
      }
    } catch {}

    return "pending"
  }
}

export default ModuleProvider(Modules.PAYMENT, {
  services: [BtcpayPaymentService],
})
