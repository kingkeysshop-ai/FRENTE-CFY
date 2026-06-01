import { Suspense } from "react"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import SkeletonCheckoutForm from "@modules/skeletons/components/skeleton-checkout-form"
import ErrorBoundary from "@modules/common/components/error-boundary"
import Breadcrumbs from "@modules/common/components/breadcrumbs"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finaliza tu compra en King Keys de forma segura. Aceptamos tarjeta, criptomonedas y Bold Colombia.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function Checkout(props: Props) {
  const params = await props.params
  const cart = await retrieveCart()

  if (!cart) {
    redirect(`/${params.countryCode}`)
  }

  const customer = await retrieveCustomer().catch(() => null)

  return (
    <>
    <div className="content-container py-4">
      <Breadcrumbs crumbs={[{ label: "Carrito", href: "/cart" }, { label: "Checkout" }]} />
    </div>
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-12 gap-y-8 py-8 small:py-12">
      <PaymentWrapper cart={cart}>
        <ErrorBoundary>
          <Suspense fallback={<SkeletonCheckoutForm />}>
            <CheckoutForm cart={cart} customer={customer} />
          </Suspense>
        </ErrorBoundary>
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
    </>
  )
}
