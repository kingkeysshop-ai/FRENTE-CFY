"use client"

import { Button } from "@medusajs/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-[#2a2a2a] pb-6 last:pb-0 last:border-none"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center justify-center py-16 gap-6 text-center"
      data-testid="no-orders-container"
    >
      <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-[#2a2a2a] flex items-center justify-center">
        <span className="text-3xl">📦</span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-white">
          Sin pedidos <span className="text-[#facc15]">aún</span>
        </h2>
        <p className="text-[#888888] text-sm max-w-sm">
          No tienes pedidos registrados. ¡Echa un vistazo a nuestras licencias digitales!
        </p>
      </div>
      <div className="mt-2">
        <LocalizedClientLink href="/store" passHref>
          <Button className="!bg-[#facc15] !text-[#0a0a0a] !font-bold !border-0 hover:!bg-[#e6b800] !px-6 !py-3 !rounded-lg !text-sm">
            Ver Productos
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
