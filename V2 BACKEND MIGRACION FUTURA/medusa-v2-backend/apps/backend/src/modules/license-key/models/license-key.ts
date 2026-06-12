import { model } from "@medusajs/framework/utils"

const LicenseKey = model.define("license_key", {
  id: model.id().primaryKey(),
  key: model.text(),
  product_id: model.text(),
  order_id: model.text().nullable(),
  status: model.enum(["available", "assigned", "delivered", "revoked"]).default("available"),
  delivery_status: model.enum(["pending", "sent", "failed"]).default("pending"),
  delivery_error: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default LicenseKey
