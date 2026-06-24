import { Module } from "@medusajs/framework/utils"
import LicenseNotificationService from "./service"

export const LICENSE_NOTIFICATION_MODULE = "licenseNotification"

export default Module(LICENSE_NOTIFICATION_MODULE, {
  service: LicenseNotificationService,
})
