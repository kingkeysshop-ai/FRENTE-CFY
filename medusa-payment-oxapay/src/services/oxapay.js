const { AbstractPaymentProcessor } = require("@medusajs/medusa")
const crypto = require("crypto")

class OxapayPaymentService extends AbstractPaymentProcessor {
  static identifier = "oxapay"

  constructor(container, options) {
    super(container, options)
    this.oxapayApiKey = options.api_key || process.env.OXAPAY_MERCHANT_API_KEY
    this.oxapayApiBase = options.api_base || "https://api.oxapay.com/v1"
    this.storeUrl = options.store_url || process.env.STORE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
  }

  async initiatePayment(context) {
    const { amount, currency_code, resource_id, customer } = context

    const payload = {
      amount: amount / 100,
      currency: (currency_code || "USD").toUpperCase(),
      order_id: resource_id,
      callback_url: `${this.storeUrl}/api/oxapay/webhook`,
      return_url: `${this.storeUrl}/payment/success?cart_id=${resource_id}&provider=oxapay`,
      description: `Order ${resource_id}`,
      lifetime: 60,
      fee_paid_by_payer: 1,
      sandbox: process.env.NODE_ENV !== "production",
    }

    if (customer?.email) {
      payload.email = customer.email
    }

    const response = await fetch(`${this.oxapayApiBase}/payment/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant_api_key: this.oxapayApiKey,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("Oxapay payment initiation failed")
    }

    const data = await response.json()

    return {
      id: data.data.track_id,
      data: {
        redirect_url: data.data.payment_url,
        track_id: data.data.track_id,
      },
    }
  }

  async authorizePayment(sessionData, context) {
    return { status: "authorized", data: sessionData.data }
  }

  async getPaymentStatus(sessionData) {
    return { status: "authorized" }
  }

  async retrievePayment(sessionData) {
    return { data: sessionData.data }
  }

  async updatePayment(sessionData, context) {
    return { data: sessionData.data }
  }

  async deletePayment(sessionData) {
    return { data: sessionData.data }
  }

  async capturePayment(sessionData) {
    return { status: "captured", data: sessionData.data }
  }

  async cancelPayment(sessionData) {
    return { data: sessionData.data }
  }

  async refundPayment(sessionData, refundAmount) {
    return { data: sessionData.data }
  }
}

module.exports = { OxapayPaymentService }
