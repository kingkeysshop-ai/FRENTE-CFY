import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductActionsWrapper from "./product-actions-wrapper"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductUrgency from "@modules/products/components/product-urgency"
import CheckCircle from "@modules/common/icons/check-circle"
import Lightning from "@modules/common/icons/lightning"
import ShieldCheck from "@modules/common/icons/shield-check"
import Headset from "@modules/common/icons/headset"
import Key from "@modules/common/icons/key"
import Star from "@modules/common/icons/star"

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
  const formattedPrice = price ? `US$ ${(price.amount / 100).toFixed(2)}` : null
  const numericPrice = price ? (price.amount / 100).toFixed(2) : null
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

      {/* Two column layout */}
      <div className="content-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column — Image (45%) */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-20 lg:self-start">
            <ImageGallery images={images} title={product.title} />
          </div>

          {/* Right column — Info (55%) */}
          <div className="w-full lg:w-[55%] flex flex-col gap-5">

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-[#F5C518]/10 border border-[#F5C518]/30 text-[#F5C518] text-xs rounded-full font-bold inline-flex items-center gap-1">
                <Key size="12" color="#F5C518" /> Licencia Digital
              </span>
              <span className="px-3 py-1 bg-green-400/10 border border-green-400/30 text-green-400 text-xs rounded-full font-bold inline-flex items-center gap-1">
                <Lightning size="12" color="#22c55e" /> Entrega Inmediata
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white leading-tight" data-testid="product-title">
              {product.title}
            </h1>

            {/* Collection */}
            {product.collection && (
              <div className="text-gray-400 text-sm -mt-2">
                {product.collection.title}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-sm text-[#888888] leading-relaxed whitespace-pre-line" data-testid="product-description">
                {product.description}
              </p>
            )}

            {/* Price */}
            {formattedPrice && (
              <div className="text-3xl font-bold text-[#F5C518]">
                US$ <span className="text-4xl">{numericPrice}</span>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex flex-col gap-3">
              <ProductOnboardingCta />
              <Suspense
                fallback={
                  <div className="w-full py-4 bg-[#F5C518]/50 rounded-xl text-center text-black font-bold">
                    Cargando...
                  </div>
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>

            {/* Guarantees Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Star size="16" color="#F5C518" />
                <span className="text-white font-semibold text-sm">Garantías</span>
              </div>
              {[
                { icon: CheckCircle, text: "Licencia 100% Original" },
                { icon: Lightning, text: "Activación Inmediata" },
                { icon: ShieldCheck, text: "Pago Seguro" },
                { icon: Headset, text: "Soporte 24/7" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <item.icon size="18" color="#F5C518" />
                  <span className="text-gray-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            {/* People watching badge */}
            <ProductUrgency inventory={product.variants?.[0]?.inventory_quantity} />

          </div>
        </div>

        {/* Accordions below columns — full width */}
        <div className="mt-12 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <ProductTabs product={product} />
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12 border-t border-white/10 pt-12">
          <div className="flex items-center gap-3 mb-8">
            <Key size="28" color="#F5C518" />
            <h2 className="text-2xl font-black text-white">Productos <span className="text-[#F5C518]">Relacionados</span></h2>
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
