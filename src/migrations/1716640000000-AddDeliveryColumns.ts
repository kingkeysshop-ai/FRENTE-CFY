import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliveryColumns1716640000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "license_key"
      ADD COLUMN IF NOT EXISTS "delivery_status" character varying NOT NULL DEFAULT 'pending'
    `);

    await queryRunner.query(`
      ALTER TABLE "license_key"
      ADD COLUMN IF NOT EXISTS "delivery_error" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "license_key" DROP COLUMN IF EXISTS "delivery_error"
    `);
    await queryRunner.query(`
      ALTER TABLE "license_key" DROP COLUMN IF EXISTS "delivery_status"
    `);
  }
}
