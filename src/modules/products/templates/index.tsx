import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductActionsWrapper from "./product-actions-wrapper"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductUrgency from "@modules/products/components/product-urgency"
import Star from "@modules/common/icons/star"
import CheckCircle from "@modules/common/icons/check-circle"
import Lightning from "@modules/common/icons/lightning"
import ShieldCheck from "@modules/common/icons/shield-check"
import Headset from "@modules/common/icons/headset"
import Key from "@modules/common/icons/key"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: any
  countryCode: string
  images: any[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) return notFound()

  const price = product.variants?.[0]?.prices?.[0]
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || `${product.title} - Licencia digital original`,
    image: product.images?.[0]?.url || product.thumbnail,
    offers: {
      "@type": "Offer",
      price: price ? (price.amount / 100).toFixed(2) : undefined,
      priceCurrency: price?.currency_code || "USD",
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[#1a1a1a] bg-[#111111]">
        <div className="content-container py-3 flex items-center gap-2 text-xs text-[#888888]">
          <LocalizedClientLink href="/" className="hover:text-[#facc15] transition-colors">Inicio</LocalizedClientLink>
          <span>›</span>
          <LocalizedClientLink href="/store" className="hover:text-[#facc15] transition-colors">Tienda</LocalizedClientLink>
          <span>›</span>
          <span className="text-[#facc15] font-medium">{product.title}</span>
        </div>
      </div>

      {/* Contenido principal */}
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-8 gap-8 relative"
        data-testid="product-container"
      >
        {/* Izquierda - Info */}
        <div className="flex flex-col small:sticky small:top-20 small:max-w-[300px] w-full gap-y-6">
          <ProductInfo product={product} />
          <div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
            <ProductTabs product={product} />
          </div>
        </div>

        {/* Centro - Galeria */}
        <div className="block w-full rounded-xl overflow-hidden">
          <ImageGallery images={images} />
        </div>

        {/* Derecha - Acciones */}
        <div className="flex flex-col small:sticky small:top-20 small:max-w-[300px] w-full gap-y-6">

          {/* Box de compra */}
          <div className="bg-[#111111] border border-yellow-400/20 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#2a2a2a]">
              <Star size="20" color="#facc15" />
              <span className="text-white font-bold text-sm">Compra Segura</span>
            </div>
            <ProductOnboardingCta />
            <Suspense
              fallback={
                <ProductActions disabled={true} product={product} region={region} />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>

          {/* Urgencia */}
          <ProductUrgency inventory={product.variants?.[0]?.inventory_quantity} />

          {/* Garantias */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex flex-col gap-3">
            {[
              { icon: CheckCircle, text: "Licencia 100% Original" },
              { icon: Lightning, text: "Activación Inmediata" },
              { icon: ShieldCheck, text: "Pago Seguro" },
              { icon: Headset, text: "Soporte 24/7" },
            ].map((item: any) => (
              <div key={item.text} className="flex items-center gap-3">
                <item.icon size="18" color="#888888" />
                <span className="text-[#888888] text-xs">{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Productos relacionados */}
      <div className="border-t border-[#1a1a1a] bg-[#111111]/50">
        <div className="content-container py-12">
          <div className="flex items-center gap-3 mb-8">
            <Key size="28" color="#facc15" />
            <h2 className="text-2xl font-black text-white">Productos <span className="text-[#facc15]">Relacionados</span></h2>
          </div>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>

    </div>
  )
}

export default ProductTemplate
