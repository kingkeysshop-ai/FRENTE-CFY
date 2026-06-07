import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Headset from "@modules/common/icons/headset"
import Mail from "@modules/common/icons/mail"
import Refresh from "@modules/common/icons/refresh"

const Help = () => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[#facc15] text-sm font-black uppercase tracking-wider inline-flex items-center gap-1.5"><Headset size="16" color="#facc15" /> ¿Necesitas Ayuda?</p>
      <div className="flex flex-wrap gap-3">
        <LocalizedClientLink
          href="/support"
          className="px-4 py-2 border border-[#facc15]/40 text-[#facc15] text-sm font-semibold rounded-lg hover:bg-[#facc15] hover:text-[#0a0a0a] transition-all duration-200 inline-flex items-center gap-1.5"
        >
          <Mail size="16" color="currentColor" /> Contactar Soporte
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/support"
          className="px-4 py-2 border border-[#2a2a2a] text-[#888888] text-sm font-semibold rounded-lg hover:border-gray-400 hover:text-white transition-all duration-200 inline-flex items-center gap-1.5"
        >
          <Refresh size="16" color="currentColor" /> Devoluciones
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Help
