import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import ShieldCheck from "@modules/common/icons/shield-check"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-[#0a0a0a] relative min-h-screen">

      {/* Navbar del checkout */}
      <div className="h-16 bg-[#111111]/95 backdrop-blur-md border-b border-[#facc15]/20 sticky top-0 z-50">
        <nav className="flex h-full items-center content-container justify-between">

          {/* Volver al carrito */}
          <LocalizedClientLink
            href="/cart"
            className="flex items-center gap-x-2 text-[#888888] hover:text-[#facc15] transition-colors duration-200 flex-1 basis-0 text-sm"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:block">Volver al carrito</span>
            <span className="block small:hidden">Volver</span>
          </LocalizedClientLink>

          {/* Logo */}
          <LocalizedClientLink
            href="/"
            className="text-xl font-black tracking-normal uppercase"
            data-testid="store-link"
          >
            <span className="text-white">KING</span>
            <span className="text-[#facc15]"> KEYS</span>
          </LocalizedClientLink>

          {/* Seguridad */}
          <div className="flex-1 basis-0 flex justify-end">
            <span className="text-xs text-[#888888] flex items-center gap-1">
              <ShieldCheck size="14" color="#888888" /> Pago Seguro
            </span>
          </div>

        </nav>
      </div>

      {/* Contenido */}
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>

      {/* Footer minimo */}
      <div className="py-6 w-full flex items-center justify-center border-t border-[#1a1a1a]">
        <span className="text-xs text-[#888888]">
          © {new Date().getFullYear()} <span className="font-bold text-gold">King Keys</span> · Todos los derechos reservados
        </span>
      </div>

    </div>
  )
}
