import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { HttpTypes } from "@medusajs/types"
import { ToastProvider } from "@lib/context/toast-context"
import ToastContainer from "@modules/common/components/toast"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import AbandonedCartPopup from "@modules/common/components/abandoned-cart-popup"
import AnnouncementBar from "@modules/common/components/announcement-bar"
import RecentActivityToast from "@modules/common/components/recent-activity"
import ScrollToTop from "@components/ScrollToTop"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer().catch(() => null)
  const cart = await retrieveCart().catch(() => null)
  let shippingOptions: HttpTypes.StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions().catch(() => ({ shipping_options: [] }))

    shippingOptions = shipping_options
  }

  return (
    <ToastProvider>
      <AnnouncementBar />
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <Footer />
      <ScrollToTop />
      <ToastContainer />
      <AbandonedCartPopup itemCount={cart?.items?.length ?? 0} />
      <RecentActivityToast />
    </ToastProvider>
  )
}
