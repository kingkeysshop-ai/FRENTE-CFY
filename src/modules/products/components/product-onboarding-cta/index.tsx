import { Button, Container, Text } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

const ADMIN_URL = process.env.ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:7001"

async function ProductOnboardingCta() {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  if (!isOnboarding) {
    return null
  }

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full p-8">
      <div className="flex flex-col gap-y-4 center">
        <Text className="text-ui-fg-base text-xl">
          Your demo product was successfully created!
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          You can now continue setting up your store in the admin.
        </Text>
        <a href={`${ADMIN_URL}/a/orders?onboarding_step=create_order_nextjs`}>
          <Button className="w-full">Continue setup in admin</Button>
        </a>
      </div>
    </Container>
  )
}

export default ProductOnboardingCta
