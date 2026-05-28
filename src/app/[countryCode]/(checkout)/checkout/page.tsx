import { Suspense } from "react"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import SkeletonCheckoutForm from "@modules/skeletons/components/skeleton-checkout-form"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart().catch(() => null)

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer().catch(() => null)

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-12 gap-y-8 py-8 small:py-12">
      <PaymentWrapper cart={cart}>
        <Suspense fallback={<SkeletonCheckoutForm />}>
          <CheckoutForm cart={cart} customer={customer} />
        </Suspense>
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
