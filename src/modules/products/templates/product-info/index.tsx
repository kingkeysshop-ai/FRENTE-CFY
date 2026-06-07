import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Box from "@modules/common/icons/box"
import Key from "@modules/common/icons/key"
import Lightning from "@modules/common/icons/lightning"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
      {/* Coleccion */}
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-xs text-[#facc15]/70 hover:text-[#facc15] uppercase tracking-widest font-bold transition-colors"
        >
          <Box size="14" color="#facc15" /> {product.collection.title}
        </LocalizedClientLink>
      )}

      {/* Titulo */}
      <h2
        className="text-3xl font-black text-white leading-tight"
        data-testid="product-title"
      >
        {product.title}
      </h2>

      {/* Badge digital */}
      <div className="flex gap-2 flex-wrap">
        <span className="px-3 py-1 bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] text-xs rounded-full font-bold inline-flex items-center gap-1">
          <Key size="12" color="#facc15" /> Licencia Digital
        </span>
        <span className="px-3 py-1 bg-green-400/10 border border-green-400/30 text-green-400 text-xs rounded-full font-bold inline-flex items-center gap-1">
          <Lightning size="12" color="#22c55e" /> Entrega Inmediata
        </span>
      </div>

      {/* Descripcion */}
      <p
        className="text-sm text-[#888888] leading-relaxed whitespace-pre-line"
        data-testid="product-description"
      >
        {product.description}
      </p>
    </div>
  )
}

export default ProductInfo
