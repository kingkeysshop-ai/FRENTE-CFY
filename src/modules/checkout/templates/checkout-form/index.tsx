import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { isCartAllDigital } from "@lib/util/is-digital-cart"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import DigitalInfo from "@modules/checkout/components/digital-info"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import ShieldCheck from "@modules/common/icons/shield-check"
import Star from "@modules/common/icons/star"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return (
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 text-center">
        <p className="text-[#888888]">No hay carrito activo. Agrega productos primero.</p>
      </div>
    )
  }

  if (!cart.region?.id) {
    return (
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 text-center">
        <p className="text-[#888888]">Error: región del carrito no disponible. Intenta recargar.</p>
      </div>
    )
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region.id)

  if (!paymentMethods) {
    return (
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 text-center">
        <p className="text-[#888888]">Error al cargar opciones de envío o pago. Intenta recargar.</p>
      </div>
    )
  }

  const isDigital = isCartAllDigital(cart)

  return (
    <div className="w-full grid grid-cols-1 gap-y-6">

      {isDigital ? (
        <>
          {/* Productos digitales: solo email + nombre */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2a2a2a] bg-[#1a1a1a]/50">
              <span className="w-7 h-7 rounded-full bg-[#facc15] text-[#0a0a0a] text-xs font-black flex items-center justify-center">1</span>
              <span className="text-white font-bold text-sm uppercase tracking-wider">📧 Tu Información</span>
            </div>
            <div className="p-6">
              <DigitalInfo cart={cart} customer={customer} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Paso 1 - Direccion (productos fisicos) */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2a2a2a] bg-[#1a1a1a]/50">
              <span className="w-7 h-7 rounded-full bg-[#facc15] text-[#0a0a0a] text-xs font-black flex items-center justify-center">1</span>
              <span className="text-white font-bold text-sm uppercase tracking-wider">Dirección de Entrega</span>
            </div>
            <div className="p-6">
              <Addresses cart={cart} customer={customer} />
            </div>
          </div>

          {/* Paso 2 - Envio */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2a2a2a] bg-[#1a1a1a]/50">
              <span className="w-7 h-7 rounded-full bg-[#facc15] text-[#0a0a0a] text-xs font-black flex items-center justify-center">2</span>
              <span className="text-white font-bold text-sm uppercase tracking-wider">Método de Envío</span>
            </div>
            <div className="p-6">
              <Shipping cart={cart} availableShippingMethods={shippingMethods} />
            </div>
          </div>
        </>
      )}

      {/* Paso de Pago (3 o 2 dependiendo del tipo) */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2a2a2a] bg-[#1a1a1a]/50">
          <span className={`w-7 h-7 rounded-full bg-[#facc15] text-[#0a0a0a] text-xs font-black flex items-center justify-center`}>
            {isDigital ? 2 : 3}
          </span>
          <span className="text-white font-bold text-sm uppercase tracking-wider inline-flex items-center gap-1.5"><ShieldCheck size="16" color="white" /> Método de Pago</span>
        </div>
        <div className="p-6">
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
        </div>
      </div>

      {/* Paso de Revision (4 o 3 dependiendo del tipo) */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2a2a2a] bg-[#facc15]/5">
          <span className={`w-7 h-7 rounded-full bg-[#facc15] text-[#0a0a0a] text-xs font-black flex items-center justify-center`}>
            {isDigital ? 3 : 4}
          </span>
          <span className="text-white font-bold text-sm uppercase tracking-wider inline-flex items-center gap-1.5"><Star size="16" color="white" /> Revisar y Confirmar</span>
        </div>
        <div className="p-6">
          <Review cart={cart} />
        </div>
      </div>

    </div>
  )
}
