import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileBottomNav from "@modules/layout/components/mobile-bottom-nav"
import NavLinks from "@modules/layout/components/nav-links"
import SideMenu from "@modules/layout/components/side-menu"
import ScrollAwareHeader from "@modules/layout/components/scroll-aware-header"
import SearchBar from "@modules/layout/components/search-bar"
import Heart from "@modules/common/icons/heart"
import ShoppingCart from "@modules/common/icons/shopping-cart"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: any[] | null) => regions ?? []).catch(() => []),
    listLocales().catch(() => []),
    getLocale().catch(() => null),
  ])

  return (
    <>
      {/* Navbar desktop/mobile top */}
      <ScrollAwareHeader>
        <nav className="content-container flex items-center justify-between w-full h-full">

            {/* Izquierda - Menu hamburguesa */}
            <div className="flex-1 basis-0 h-full flex items-center">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>

            {/* Centro - Logo */}
            <LocalizedClientLink
              href="/"
              className="text-2xl font-black tracking-normal uppercase hover:opacity-90 transition-opacity duration-200"
              data-testid="nav-store-link"
            >
              <span className="text-white">KING</span>
              <span className="text-[#facc15]"> KEYS</span>
            </LocalizedClientLink>

            {/* Derecha */}
            <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
              <LocalizedClientLink
                href="/wishlist"
                className="flex items-center gap-1 text-sm text-[#888888] hover:text-[#facc15] transition-colors"
                aria-label="Favoritos"
              >
                <Heart size="18" color="currentColor" />
                <span className="hidden small:inline">Favoritos</span>
              </LocalizedClientLink>
              <NavLinks />
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#facc15] transition-colors"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    <ShoppingCart size="18" color="currentColor" />
                    <span className="hidden small:inline">Carrito</span>
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>

        </nav>
      </ScrollAwareHeader>

      <MobileBottomNav />

      {/* Espaciado inferior movil */}
      <div className="h-16 small:hidden" />
    </>
  )
}
