import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20250601000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "license_key" (
        "id" TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "key_hash" TEXT NULL,
        "product_id" TEXT NOT NULL,
        "variant_id" TEXT NULL,
        "order_id" TEXT NULL,
        "customer_email" TEXT NULL,
        "assigned_at" TIMESTAMPTZ NULL,
        "status" TEXT NOT NULL DEFAULT 'available',
        "delivery_status" TEXT NOT NULL DEFAULT 'pending',
        "delivery_error" TEXT NULL,
        "metadata" JSONB NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ NULL,
        CONSTRAINT "license_key_pkey" PRIMARY KEY ("id")
      );
    `)

    this.addSql(`
      CREATE UNIQUE INDEX IF NOT EXISTS "license_key_key_hash_unique" ON "license_key" ("key_hash");
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "license_key_product_id_idx" ON "license_key" ("product_id");
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "license_key_order_id_idx" ON "license_key" ("order_id");
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "license_key_status_idx" ON "license_key" ("status");
    `)
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "license_key" CASCADE;`)
  }
}
