import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="w-full">
      {/* Tabla header - solo desktop */}
      <div className="hidden small:grid grid-cols-[64px_1fr_96px_80px_64px] gap-4 px-6 py-3 border-b border-[#2a2a2a] text-xs text-[#888888] font-bold uppercase tracking-widest">
        <span></span>
        <span>Producto</span>
        <span className="text-center">Cantidad</span>
        <span className="text-right">Precio</span>
        <span className="text-right">Total</span>
      </div>
      <div className="block divide-y divide-[#2a2a2a]">
        {items
          ? items
              .sort((a: any, b: any) => (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1)
              .map((item: any) => (
                <Item key={item.id} item={item} currencyCode={cart?.currency_code} />
              ))
          : repeat(5).map((i: any) => <SkeletonLineItem key={i} />)}
      </div>
    </div>
  )
}

export default ItemsTemplate
