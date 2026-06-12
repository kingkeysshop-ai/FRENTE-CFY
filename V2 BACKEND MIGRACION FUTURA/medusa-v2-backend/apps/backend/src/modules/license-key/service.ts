import { MedusaService } from "@medusajs/framework/utils"
import LicenseKey from "./models/license-key"

class LicenseKeyService extends MedusaService({
  LicenseKey,
}) {
  async generateKeys(
    productId: string,
    count: number,
    keys?: string[]
  ): Promise<any[]> {
    const generated: any[] = []

    for (let i = 0; i < count; i++) {
      const key = keys?.[i] || this.generateLicenseKeyString()
      const licenseKey = await this.createLicenseKeys({
        key,
        product_id: productId,
        status: "available",
        delivery_status: "pending",
      })
      generated.push(licenseKey)
    }

    return generated
  }

  private generateLicenseKeyString(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const segments = 5
    const segmentLength = 5
    return Array.from({ length: segments }, () =>
      Array.from({ length: segmentLength }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("")
    ).join("-")
  }

  async assignKeysToOrder(
    orderId: string,
    items: Array<{ product_id: string; quantity: number }>
  ): Promise<any[]> {
    const assigned: any[] = []

    for (const item of items) {
      const availableKeys = await this.listLicenseKeys({
        product_id: item.product_id,
        status: "available",
      })

      const keysToAssign = availableKeys.slice(0, item.quantity)

      for (const licenseKey of keysToAssign) {
        const updated = await this.updateLicenseKeys({
          id: licenseKey.id,
          order_id: orderId,
          status: "assigned",
        })
        assigned.push(updated)
      }
    }

    return assigned
  }

  async getKeysByOrder(orderId: string) {
    return this.listLicenseKeys({ order_id: orderId })
  }

  async resendKeys(
    orderId: string,
    keyIds?: string[]
  ): Promise<Array<{ id: string; success: boolean; error?: string }>> {
    const filters: any = { order_id: orderId }
    if (keyIds && keyIds.length > 0) {
      filters.id = keyIds
    }

    const keys = await this.listLicenseKeys(filters)
    const results: Array<{ id: string; success: boolean; error?: string }> = []

    for (const key of keys) {
      try {
        await this.updateLicenseKeys({
          id: key.id,
          delivery_status: "sent",
        })
        results.push({ id: key.id, success: true })
      } catch (err: any) {
        results.push({
          id: key.id,
          success: false,
          error: err.message || "Unknown error",
        })
      }
    }

    return results
  }

  async markAsDelivered(orderId: string) {
    const keys = await this.listLicenseKeys({ order_id: orderId })
    for (const key of keys) {
      await this.updateLicenseKeys({
        id: key.id,
        status: "delivered",
        delivery_status: "sent",
      })
    }
    return keys
  }

  async revokeKey(keyId: string) {
    return this.updateLicenseKeys({
      id: keyId,
      status: "revoked",
    })
  }

  async resetOrderKeys(orderId: string) {
    const keys = await this.listLicenseKeys({ order_id: orderId })
    for (const key of keys) {
      await this.updateLicenseKeys({
        id: key.id,
        order_id: null,
        status: "available",
        delivery_status: "pending",
      })
    }
    return keys
  }
}

export default LicenseKeyService
