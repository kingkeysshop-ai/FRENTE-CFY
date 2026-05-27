import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptySearchResults = ({ query }: { query?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
        <span className="text-4xl">🔍</span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-white">
          Sin resultados para <span className="text-yellow-400">&ldquo;{query}&rdquo;</span>
        </h2>
        <p className="text-gray-400 text-sm max-w-sm">
          No encontramos productos que coincidan con tu búsqueda. Intenta con otras palabras o explora nuestro catálogo completo.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <LocalizedClientLink
          href="/store"
          className="px-6 py-2.5 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-200 text-sm"
        >
          Ver Catálogo Completo
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default EmptySearchResults
