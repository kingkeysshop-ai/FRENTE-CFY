import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const RELEVANT_ENVS = [
  "AURPAY_API_KEY", "AURPAY_WEBHOOK_SECRET", "AURPAY_API_URL",
  "BOLD_API_KEY", "BOLD_WEBHOOK_SECRET", "BOLD_API_URL",
  "CRYPTOMUS_API_KEY", "CRYPTOMUS_WEBHOOK_SECRET", "CRYPTOMUS_API_URL", "CRYPTOMUS_MERCHANT_ID",
  "BTCPAY_API_KEY", "BTCPAY_STORE_ID", "BTCPAY_WEBHOOK_SECRET", "BTCPAY_API_URL",
  "STRIPE_API_KEY", "STRIPE_WEBHOOK_SECRET",
  "BACKEND_URL", "STORE_URL", "STORE_CORS",
  "NODE_ENV",
]

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const envStatus: Record<string, string> = {}
    for (const env of RELEVANT_ENVS) {
      envStatus[env] = process.env[env] ? "set" : "not set"
    }

    res.status(200).json({
      environment: envStatus,
      timestamp: new Date().toISOString(),
      message: "Payment diagnostics endpoint",
    })
  } catch (error: any) {
    res.status(500).json({ error: "Failed to run payment diagnostics", detail: error.message })
  }
}
