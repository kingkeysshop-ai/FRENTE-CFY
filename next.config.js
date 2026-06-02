const checkEnvVariables = require("./check-env-variables")

if (process.env.NEXT_PHASE !== "phase-export") {
  checkEnvVariables()
}

const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME
  ? `${process.env.MEDUSA_CLOUD_S3_PATHNAME}/**`
  : undefined

const isDev = process.env.NODE_ENV === "development"

const FRONTEND_URL = process.env.NEXT_PUBLIC_BASE_URL || (isDev ? "http://localhost:3000" : "https://front.cfynet.xyz")

const ALLOWED_ORIGINS = isDev
  ? ["localhost:3000", "localhost:8000"]
  : [new URL(FRONTEND_URL).host, "backend.cfynet.xyz"]

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://*.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src 'self' https://js.stripe.com https://*.stripe.com",
      "connect-src 'self' https://backend.cfynet.xyz https://api.stripe.com https://dashboard.aurpay.net https://integrations.api.bold.co https://api.cryptomus.com",
      "base-uri 'self'",
      "form-action 'self' https://dashboard.aurpay.net https://integrations.api.bold.co https://pay.cryptomus.com",
    ].join("; "),
  },
]

module.exports = {
  output: "standalone",
  transpilePackages: ["@medusajs/ui"],
  experimental: {
    serverActions: {
      allowedOrigins: ALLOWED_ORIGINS,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.cfynet.xyz",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "minio.cfynet.xyz",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}
