import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import Breadcrumbs from "@modules/common/components/breadcrumbs"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  q,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  q?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Breadcrumbs */}
      <div className="content-container pt-4">
        <Breadcrumbs crumbs={[{ label: "Todos los Productos" }]} />
      </div>

      {/* Hero de la tienda */}
      <div className="relative bg-gradient-to-b from-[#111111] to-[#0a0a0a] border-b border-[#2a2a2a] py-12">
        <div className="content-container text-center flex flex-col items-center gap-3">
          <span className="px-3 py-1 bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] text-xs rounded-full font-bold uppercase tracking-widest">
            🛒 Catálogo Completo
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {q ? (
              <>Resultados para <span className="text-[#facc15]">&ldquo;{q}&rdquo;</span></>
            ) : (
              <>Todos los <span className="text-[#facc15]">Productos</span></>
            )}
          </h1>
          {q && (
            <p className="text-[#888888] text-sm max-w-md">
              Mostrando resultados de búsqueda para &ldquo;{q}&rdquo;
            </p>
          )}
          {!q && (
            <p className="text-[#888888] text-sm max-w-md">
              Licencias digitales originales con activación inmediata garantizada.
            </p>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div
        className="flex flex-col small:flex-row small:items-start py-8 content-container gap-6"
        data-testid="category-container"
      >
        {/* Filtros */}
        <div className="small:min-w-[220px] bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-xs text-[#facc15] font-bold uppercase tracking-widest mb-4">
            🔧 Filtros
          </p>
          <RefinementList sortBy={sort} />
        </div>

        {/* Grid de productos */}
        <div className="w-full flex flex-col gap-6">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              q={q}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
