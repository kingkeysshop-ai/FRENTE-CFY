import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLicenseKey1716630000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "license_key_status_enum" AS ENUM ('available', 'assigned', 'revoked')
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "license_key" (
      "id" character varying NOT NULL,
      "key" character varying NOT NULL,
      "product_id" character varying,
      "variant_id" character varying,
      "status" "license_key_status_enum" NOT NULL DEFAULT 'available',
      "order_id" character varying,
      "customer_email" character varying,
      "assigned_at" timestamp,
      "metadata" jsonb,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now(),
      CONSTRAINT "pk_license_key" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "idx_license_key_key" ON "license_key" ("key")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_license_key_product" ON "license_key" ("product_id", "status")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_license_key_order" ON "license_key" ("order_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_license_key_email" ON "license_key" ("customer_email")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "license_key"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "license_key_status_enum"`);
  }
}
