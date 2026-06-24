import { createStep, createWorkflow, StepResponse, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import { LICENSE_KEY_MODULE } from "../../modules/license-key"
import { LICENSE_NOTIFICATION_MODULE } from "../../modules/license-notification"

const getOrderDetailsStep = createStep(
  "get-order-details",
  async (orderId: string, { container }) => {
    const orderModuleService: any = container.resolve(Modules.ORDER)
    const order = await orderModuleService.retrieveOrder(orderId, {
      relations: ["items"],
    })
    return new StepResponse(order)
  }
)

const assignLicenseKeysStep = createStep(
  "assign-license-keys",
  async ({ orderId, items, email }: { orderId: string; items: Array<{ product_id: string; quantity: number; variant_id?: string }>; email: string }, { container }) => {
    const licenseKeyService: any = container.resolve(LICENSE_KEY_MODULE)
    const assigned = await licenseKeyService.assignKeysToOrder(orderId, items, email)
    return new StepResponse(assigned)
  }
)

const markAsDeliveredStep = createStep(
  "mark-as-delivered",
  async (orderId: string, { container }) => {
    const licenseKeyService: any = container.resolve(LICENSE_KEY_MODULE)
    const keys = await licenseKeyService.markAsDelivered(orderId)
    return new StepResponse(keys)
  }
)

const sendEmailNotificationStep = createStep(
  "send-email-notification",
  async ({ toEmail, licenseKey, productName, orderId, customerName }: {
    toEmail: string
    licenseKey: string
    productName: string
    orderId: string
    customerName?: string
  }, { container }) => {
    const notificationService: any = container.resolve(LICENSE_NOTIFICATION_MODULE)
    const result = await notificationService.sendLicenseEmail(
      toEmail,
      licenseKey,
      productName,
      orderId,
      customerName
    )
    return new StepResponse(result)
  }
)

export const deliverLicenseKeysWorkflow = createWorkflow(
  "deliver-license-keys",
  (orderId: string) => {
    const order = getOrderDetailsStep(orderId)
    const items = transform({ order }, (data) => {
      const ord = data.order
      if (!ord.items) return []
      return ord.items.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variant_id: item.variant_id,
      }))
    })

    assignLicenseKeysStep({
      orderId: order.id,
      items,
      email: order.email,
    })

    const delivered = markAsDeliveredStep(order.id)

    return new WorkflowResponse(delivered)
  }
)
