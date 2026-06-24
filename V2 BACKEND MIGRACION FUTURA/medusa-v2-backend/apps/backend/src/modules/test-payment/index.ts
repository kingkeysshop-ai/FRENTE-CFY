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

class TestPaymentService extends AbstractPaymentProvider {
  static identifier = "test-payment"

  constructor(container: Record<string, unknown>, options: Record<string, unknown> = {}) {
    super(container, options)
    if (process.env.NODE_ENV === "production") {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "TestPaymentService cannot be used in production")
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    if (process.env.NODE_ENV === "production") {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Test payment provider is not available in production")
    }

    return {
      id: `test_${Date.now()}`,
      data: { status: "authorized" },
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    return { status: "authorized", data: input.data as Record<string, unknown> }
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
    return { status: "authorized" }
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
    return {
      action: "captured",
      data: {
        session_id: (payload.data as any)?.session_id || "",
        amount: (payload.data as any)?.amount || 0,
      },
    }
  }
}

export default ModuleProvider(Modules.PAYMENT, {
  services: [TestPaymentService],
})
