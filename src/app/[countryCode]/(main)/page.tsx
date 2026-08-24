import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategoriesSection from "@modules/home/components/categories-section"
import WhyUs from "@modules/home/components/why-us"
import Trending from "@modules/home/components/trending"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TrustBadges from "@modules/home/components/trust-badges"

export const metadata: Metadata = {
  title: "KING KEYS - Licencias Digitales Originales",
  description: "Compra licencias digitales originales de Windows, Office y más. Activación inmediata garantizada.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const [region, { collections }, { response: { count: totalProducts } }] = await Promise.all([
    getRegion(countryCode).catch(() => null),
    listCollections().catch(() => ({ collections: [] })),
    listProducts({ countryCode, queryParams: { limit: 1 } }).catch(() => ({ response: { products: [], count: 0 }, nextPage: null })),
  ])

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Hero */}
      <Hero productCount={totalProducts} />

      {/* Trust badges */}
      <TrustBadges />

      {/* Por que elegirnos */}
      <WhyUs />

      {/* Trending — terminal products.sh */}
      <Trending countryCode={countryCode} />

      {/* Categorias */}
      <CategoriesSection />

      {/* Productos destacados */}
      {collections && region && collections.length > 0 && (
        <section className="py-10">
          <div className="content-container flex flex-col gap-2 mb-8">
            <span className="text-xs text-[#facc15] font-bold uppercase tracking-widest">⭐ Destacados</span>
            <h2 className="text-3xl font-black text-white">
              Productos <span className="text-[#facc15]">Populares</span>
            </h2>
          </div>
          <ul className="flex flex-col gap-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </section>
      )}

      {/* Banner CTA */}
      <section className="content-container pb-14">
        <div className="relative bg-gradient-to-r from-[#111111] via-[#facc15]/5 to-gray-900 border border-[#facc15]/20 rounded-2xl p-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#facc15] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
          <div className="flex flex-col gap-2 relative z-10">
            <h2 className="text-2xl font-black text-white">
              ¿Listo para activar tu <span className="text-[#facc15]">licencia?</span>
            </h2>
            <p className="text-[#888888] text-sm max-w-md">
              Entrega inmediata por email. Sin esperas, sin complicaciones.
            </p>
          </div>
          <LocalizedClientLink
            href="/store"
            className="relative z-10 px-8 py-3 bg-[#facc15] text-[#0a0a0a] font-black rounded-xl hover:bg-[#e6b800] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap text-sm"
          >
            🔑 Ver todos los productos
          </LocalizedClientLink>
        </div>
      </section>

    </div>
  )
}
