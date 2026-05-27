const checkEnvVariables = require("./check-env-variables")

if (process.env.NEXT_PHASE !== "phase-export") {
  checkEnvVariables()
}

const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME
  ? `${process.env.MEDUSA_CLOUD_S3_PATHNAME}/**`
  : undefined

const isDev = process.env.NODE_ENV === "development"

module.exports = {
  transpilePackages: ["@medusajs/ui"],
  experimental: { serverActions: { allowedOrigins: ["*"] } },
}
