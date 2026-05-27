import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { LicenseKey } from "../models/license-key";

const LicenseKeyRepository = dataSource.getRepository(LicenseKey);

export default LicenseKeyRepository;
