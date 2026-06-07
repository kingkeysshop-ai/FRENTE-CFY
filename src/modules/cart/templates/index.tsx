import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SignInPrompt from "../components/sign-in-prompt"
import Breadcrumbs from "@modules/common/components/breadcrumbs"
import { HttpTypes } from "@medusajs/types"
import ShoppingCart from "@modules/common/icons/shopping-cart"
import User from "@modules/common/icons/user"
import CheckCircle from "@modules/common/icons/check-circle"
import Lightning from "@modules/common/icons/lightning"
import ShieldCheck from "@modules/common/icons/shield-check"
import Headset from "@modules/common/icons/headset"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Breadcrumbs */}
      <div className="content-container pt-4">
        <Breadcrumbs crumbs={[{ label: "Carrito" }]} />
      </div>

      {/* Header */}
      <div className="border-b border-[#2a2a2a] bg-[#111111]">
        <div className="content-container py-8 flex flex-col gap-2">
          <span className="text-xs text-[#facc15] font-bold uppercase tracking-widest inline-flex items-center gap-1"><ShoppingCart size="14" color="#facc15" /> King Keys</span>
          <h1 className="text-3xl font-black text-white">Tu <span className="text-[#facc15]">Carrito</span></h1>
        </div>
      </div>

      <div className="content-container py-8" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_380px] gap-8">

            {/* Items */}
            <div className="flex flex-col gap-y-4">
              {!customer && (
                <div className="bg-[#facc15]/10 border border-[#facc15]/30 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <User size="24" color="#facc15" />
                    <div>
                      <p className="text-white text-sm font-bold">¿Ya tienes cuenta?</p>
                      <p className="text-[#888888] text-xs">Inicia sesión para ver tus pedidos anteriores</p>
                    </div>
                  </div>
                  <SignInPrompt />
                </div>
              )}
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
                <ItemsTemplate cart={cart} />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">¿Buscas más productos?</p>
                <LocalizedClientLink href="/store" className="text-[#F5C518] font-semibold text-sm hover:underline">
                  Ver toda la tienda →
                </LocalizedClientLink>
              </div>

              <LocalizedClientLink
                href="/store"
                className="flex items-center justify-center gap-2 py-3 px-6 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-[#888888] hover:text-white text-sm font-semibold transition-all duration-200 w-full small:w-fit"
              >
                ← Seguir Comprando
              </LocalizedClientLink>
            </div>

            {/* Resumen */}
            <div className="relative">
              <div className="sticky top-20 flex flex-col gap-4">
                <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
                  <Summary cart={cart as any} />
                </div>
                {/* Garantias */}
                <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex flex-col gap-3">
                  {[
                    { icon: CheckCircle, text: "Licencias 100% Originales" },
                    { icon: Lightning, text: "Entrega Inmediata por Email" },
                    { icon: ShieldCheck, text: "Pago 100% Seguro" },
                    { icon: Headset, text: "Soporte 24/7" },
                  ].map((g) => (
                    <div key={g.text} className="flex items-center gap-3">
                      <g.icon size="18" color="#888888" />
                      <span className="text-[#888888] text-xs">{g.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
    </div>
  )
}

export default CartTemplate
