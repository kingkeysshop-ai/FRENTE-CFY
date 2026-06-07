const c = require("ansi-colors")

const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    description:
      "Learn how to create a publishable key: https://docs.medusajs.com/",
  },
]

const recommendedEnvs = [
  {
    key: "NEXT_PUBLIC_BASE_URL",
    description:
      "Public URL of this storefront app, e.g. https://your-storefront.up.railway.app",
  },
]

function checkEnvVariables() {
  const missingRequired = requiredEnvs.filter(function (env) {
    return !process.env[env.key]
  })

  if (!process.env.MEDUSA_BACKEND_URL && !process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
    missingRequired.push({
      key: "MEDUSA_BACKEND_URL or NEXT_PUBLIC_MEDUSA_BACKEND_URL",
      description:
        "Public or private URL of your Medusa v1 backend, e.g. https://your-medusa.up.railway.app",
    })
  }

  const missingRecommended = recommendedEnvs.filter(function (env) {
    return !process.env[env.key]
  })

  if (missingRequired.length > 0) {
    console.error(
      c.red.bold("\n🚫 Error: Missing required environment variables\n")
    )

    missingRequired.forEach(function (env) {
      console.error(c.yellow(`  ${c.bold(env.key)}`))
      if (env.description) {
        console.error(c.dim(`    ${env.description}\n`))
      }
    })

    console.error(
      c.yellow(
        "\nPlease set these variables in your environment before building/starting the application.\n"
      )
    )

    process.exit(1)
  }

  if (missingRecommended.length > 0) {
    console.warn(
      c.yellow.bold("\n⚠️ Warning: Missing recommended environment variables\n")
    )

    missingRecommended.forEach(function (env) {
      console.warn(c.yellow(`  ${c.bold(env.key)}`))
      if (env.description) {
        console.warn(c.dim(`    ${env.description}\n`))
      }
    })
  }
}

module.exports = checkEnvVariables
