import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { LICENSE_KEY_MODULE } from "../../modules/license-key"

const getLicenseKeysStep = createStep(
  "get-license-keys",
  async (orderId: string, { container }) => {
    const licenseKeyService: any = container.resolve(LICENSE_KEY_MODULE)
    const keys = await licenseKeyService.getKeysByOrder(orderId)
    return new StepResponse(keys, orderId)
  }
)

const markAsDeliveredStep = createStep(
  "mark-license-keys-delivered",
  async (orderId: string, { container }) => {
    const licenseKeyService: any = container.resolve(LICENSE_KEY_MODULE)
    const keys = await licenseKeyService.markAsDelivered(orderId)
    return new StepResponse(keys)
  }
)

export const deliverLicenseKeysWorkflow = createWorkflow(
  "deliver-license-keys",
  (orderId: string) => {
    const keys = getLicenseKeysStep(orderId)
    const delivered = markAsDeliveredStep(orderId)
    return new WorkflowResponse(delivered)
  }
)
