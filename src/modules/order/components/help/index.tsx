import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Help = () => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[#facc15] text-sm font-black uppercase tracking-wider">🎧 ¿Necesitas Ayuda?</p>
      <div className="flex flex-wrap gap-3">
        <LocalizedClientLink
          href="/support"
          className="px-4 py-2 border border-[#facc15]/40 text-[#facc15] text-sm font-semibold rounded-lg hover:bg-[#facc15] hover:text-[#0a0a0a] transition-all duration-200"
        >
          📩 Contactar Soporte
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/support"
          className="px-4 py-2 border border-[#2a2a2a] text-[#888888] text-sm font-semibold rounded-lg hover:border-gray-400 hover:text-white transition-all duration-200"
        >
          ↩️ Devoluciones
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Help
