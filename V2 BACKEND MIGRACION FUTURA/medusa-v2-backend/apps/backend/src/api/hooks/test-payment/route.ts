import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { order_id } = req.body || {}

  try {
    res.json({
      success: true,
      message: "Test payment captured",
      order_id,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Test payment capture failed",
    })
  }
}
