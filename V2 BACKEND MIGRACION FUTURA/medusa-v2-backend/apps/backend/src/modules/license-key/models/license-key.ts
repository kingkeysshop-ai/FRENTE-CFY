import { model } from "@medusajs/framework/utils"

const LicenseKey = model.define("license_key", {
  id: model.id().primaryKey(),
  key: model.text(),
  key_hash: model.text().nullable(),
  product_id: model.text(),
  variant_id: model.text().nullable(),
  order_id: model.text().nullable(),
  customer_email: model.text().nullable(),
  assigned_at: model.dateTime().nullable(),
  status: model.enum(["available", "assigned", "delivered", "revoked"]).default("available"),
  delivery_status: model.enum(["pending", "sent", "failed"]).default("pending"),
  delivery_error: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default LicenseKey
