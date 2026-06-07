import { useMemo } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return order.items?.reduce((acc: any, item: any) => acc + item.quantity, 0) ?? 0
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div
      className="bg-[#111111] border border-[#2a2a2a] hover:border-[#facc15]/40 rounded-xl overflow-hidden transition-all duration-200"
      data-testid="order-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a] bg-[#1a1a1a]/50">
        <div className="flex items-center gap-3">
          <span className="text-[#facc15] font-black text-sm" data-testid="order-display-id">
            #{order.display_id}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#2a2a2a]" />
          <span className="text-[#888888] text-xs" data-testid="order-created-at">
            {new Date(order.created_at).toLocaleDateString("es-ES", {
              year: "numeric", month: "long", day: "numeric"
            })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm" data-testid="order-amount">
            {convertToLocale({ amount: order.total, currency_code: order.currency_code })}
          </span>
          <span className="text-xs text-[#888888] bg-[#2a2a2a] px-2 py-0.5 rounded-full">
            {numberOfLines} {numberOfLines > 1 ? "items" : "item"}
          </span>
        </div>
      </div>

      {/* Thumbnails de productos */}
      <div className="p-5">
        <div className="flex gap-3 mb-4">
          {order.items?.slice(0, 3).map((i: any) => (
            <div key={i.id} className="flex flex-col gap-1 w-16" data-testid="order-item">
              <div className="rounded-lg overflow-hidden border border-[#2a2a2a]">
                <Thumbnail thumbnail={i.thumbnail} images={[]} size="square" />
              </div>
              <span className="text-xs text-[#888888] truncate" data-testid="item-title">
                {i.title}
              </span>
            </div>
          ))}
          {numberOfProducts > 3 && (
            <div className="w-16 h-16 flex items-center justify-center bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
              <span className="text-xs text-[#888888] font-bold">+{numberOfProducts - 3}</span>
            </div>
          )}
        </div>

        {/* Boton */}
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <button
            className="w-full py-2.5 border border-[#facc15]/40 text-[#facc15] text-xs font-bold rounded-lg hover:bg-[#facc15] hover:text-[#0a0a0a] transition-all duration-200"
            data-testid="order-details-link"
          >
            Ver Detalles del Pedido →
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
