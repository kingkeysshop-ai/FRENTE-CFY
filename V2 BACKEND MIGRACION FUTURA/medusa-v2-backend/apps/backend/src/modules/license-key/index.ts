import { Module } from "@medusajs/framework/utils"
import LicenseKeyService from "./service"

export const LICENSE_KEY_MODULE = "licenseKey"

export default Module(LICENSE_KEY_MODULE, {
  service: LicenseKeyService,
})
