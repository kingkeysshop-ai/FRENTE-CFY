import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { cart_id, order_id } = (req.body || {}) as {
    cart_id?: string
    order_id?: string
  }

  try {
    const orderModuleService: any = req.scope.resolve(Modules.ORDER)
    const paymentModuleService: any = req.scope.resolve(Modules.PAYMENT)
    const licenseKeyModule: any = req.scope.resolve("licenseKey")

    let order: any

    if (order_id) {
      order = await orderModuleService.retrieveOrder(order_id, {
        relations: ["items", "payment_collections", "shipping_address"],
      })
    } else if (cart_id) {
      const cartModuleService: any = req.scope.resolve(Modules.CART)
      const cart = await cartModuleService.retrieveCart(cart_id, {
        relations: ["items", "payment_collection"],
      })

      if (!cart) {
        res.status(400).json({ error: "Cart not found" })
        return
      }

      res.status(400).json({
        error: "Cart completion from admin requires frontend flow",
        cart_id,
      })
      return
    } else {
      res.status(400).json({ error: "cart_id or order_id required" })
      return
    }

    let paymentStatus = "not_available"
    let paymentCollectionId: string | undefined

    if (order.payment_collections?.length > 0) {
      paymentCollectionId = order.payment_collections[0].id
      try {
        const payment = await paymentModuleService.listPayments({
          payment_collection_id: paymentCollectionId,
        })
        paymentStatus = payment?.length > 0 ? payment[0].status : "no_payments"
      } catch {
        paymentStatus = "error"
      }
    }

    const licenseKeys = await licenseKeyModule.listLicenseKeys({ order_id: order.id })
    const summary = {
      total: licenseKeys.length,
      assigned: licenseKeys.filter((k: any) => k.status === "assigned").length,
      available: licenseKeys.filter((k: any) => k.status === "available").length,
      revoked: licenseKeys.filter((k: any) => k.status === "revoked").length,
      sent: licenseKeys.filter((k: any) => k.delivery_status === "sent").length,
      failed: licenseKeys.filter((k: any) => k.delivery_status === "failed").length,
      pending: licenseKeys.filter((k: any) => k.delivery_status === "pending").length,
    }

    const items = (order.items || []).map((item: any) => ({
      id: item.id,
      title: item.title || item.variant_title || "Unknown",
      product_id: item.product_id || item.variant?.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        email: order.email,
        status: order.status,
        payment_status: paymentStatus,
        currency_code: order.currency_code,
        total: order.total,
        subtotal: order.subtotal,
        items,
      },
      license_keys: licenseKeys.map((k: any) => ({
        id: k.id,
        key: k.key,
        product_id: k.product_id,
        status: k.status,
        delivery_status: k.delivery_status,
        delivery_error: k.delivery_error || null,
        customer_email: k.customer_email || null,
      })),
      summary,
      flow: {
        order_created: !!order,
        payment_captured: paymentStatus === "captured",
        subscriber_fired: summary.total > 0,
        license_assigned: summary.assigned > 0,
        email_sent: summary.sent > 0,
        email_failed: summary.failed > 0,
        email_pending: summary.pending > 0,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      error: "Test flow failed",
      message: error.message,
    })
  }
}
