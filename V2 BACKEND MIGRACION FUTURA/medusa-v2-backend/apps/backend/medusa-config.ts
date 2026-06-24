import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  modules: [
    {
      resolve: "./src/modules/license-key",
    },
    {
      resolve: "./src/modules/license-notification",
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          { resolve: "./src/modules/aurpay", options: {} },
          { resolve: "./src/modules/bold", options: {} },
          { resolve: "./src/modules/cryptomus", options: {} },
          { resolve: "./src/modules/btcpay", options: {} },
          { resolve: "./src/modules/test-payment", options: {} },
          { resolve: "./src/modules/oxapay", options: {} },
        ],
      },
    },

  ],
  plugins: [
    {
      resolve: "@medusajs/payment-stripe",
      options: {
        apiKey: process.env.STRIPE_API_KEY || "",
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
      },
    },
  ],
  admin: {
    backendUrl: process.env.MEDUSA_ADMIN_BACKEND_URL || "http://localhost:9000",
  },
})
