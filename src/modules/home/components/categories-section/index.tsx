import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FadeInView from "@components/FadeInView"

export default async function CategoriesSection() {
  const categories = await listCategories().catch(() => [])

  if (!categories?.length) return null

  const icons: Record<string, string> = {
    windows: "🪟",
    office: "📊",
    antivirus: "🛡️",
    adobe: "🎨",
    games: "🎮",
    vpn: "🔐",
    server: "🖥️",
  }

  const getIcon = (name: string) => {
    const key = Object.keys(icons).find((k) => name.toLowerCase().includes(k))
    return key ? icons[key] : "🔑"
  }

  return (
    <section className="bg-[#111111]/50 border-y border-[#facc15]/10 py-14">
      <div className="content-container flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#facc15] font-bold uppercase tracking-widest">
              📦 Explora
            </span>
            <h2 className="text-3xl font-black text-white">
              Categorías <span className="text-[#facc15]">Populares</span>
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
            className="text-sm text-[#facc15] hover:text-[#e6b800] font-bold border border-[#facc15]/30 px-4 py-2 rounded-lg hover:bg-[#facc15]/10 transition-all duration-200"
          >
            Ver toda la tienda →
          </LocalizedClientLink>
        </div>

        {/* Grid de categorias */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.filter((c) => !c.parent_category).slice(0, 10).map((category, i) => (
            <FadeInView key={category.id} delay={i * 80}>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="group flex flex-col items-center gap-3 bg-[#111111] border border-[#2a2a2a] hover:border-[#facc15]/60 rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/10 hover:-translate-y-1 text-center"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                  {getIcon(category.name)}
                </span>
                <span className="text-white text-sm font-bold group-hover:text-[#facc15] transition-colors duration-200">
                  {category.name}
                </span>
                {category.products && category.products.length > 0 && (
                  <span className="text-xs text-[#888888] bg-[#1a1a1a] px-2 py-0.5 rounded-full">
                    {category.products.length} productos
                  </span>
                )}
              </LocalizedClientLink>
            </FadeInView>
          ))}

          {/* Card ver todas */}
          <FadeInView delay={10 * 80}>
            <LocalizedClientLink
              href="/store"
              className="group flex flex-col items-center gap-3 bg-[#facc15]/5 border border-[#facc15]/20 hover:border-[#facc15]/60 rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 text-center"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-200">✨</span>
              <span className="text-[#facc15] text-sm font-bold">Ver Todas</span>
              <span className="text-xs text-[#888888] bg-[#1a1a1a] px-2 py-0.5 rounded-full">Tienda completa</span>
            </LocalizedClientLink>
          </FadeInView>
        </div>

      </div>
    </section>
  )
}
