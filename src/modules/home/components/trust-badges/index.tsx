import FadeInView from "@components/FadeInView"
import Microsoft from "@modules/common/icons/microsoft"
import Windows from "@modules/common/icons/windows"
import Office from "@modules/common/icons/office"
import Xbox from "@modules/common/icons/xbox"
import Playstation from "@modules/common/icons/playstation"
import Steam from "@modules/common/icons/steam"
import ShieldCheck from "@modules/common/icons/shield-check"
import Tag from "@modules/common/icons/tag"
import Lightning from "@modules/common/icons/lightning"

const LOGOS = [
  { name: "Microsoft", icon: Microsoft },
  { name: "Windows", icon: Windows },
  { name: "Office", icon: Office },
  { name: "Xbox", icon: Xbox },
  { name: "PlayStation", icon: Playstation },
  { name: "Steam", icon: Steam },
]

const TrustBadges = () => {
  return (
    <section className="bg-[#111111]/30 border-y border-yellow-400/10 py-10">
      <div className="content-container flex flex-col items-center gap-6">
        <FadeInView>
          <span className="text-xs text-[#888888] uppercase tracking-widest font-medium">
            Distribuidor Autorizado de Licencias Digitales
          </span>
        </FadeInView>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {LOGOS.map((logo, i) => {
            const Icon = logo.icon
            return (
              <FadeInView key={logo.name} delay={i * 80}>
                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <span className="opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <Icon size="28" color="#888888" />
                  </span>
                  <span className="text-[10px] text-[#888888] group-hover:text-[#888888] uppercase tracking-wider font-semibold transition-colors duration-200">
                    {logo.name}
                  </span>
                </div>
              </FadeInView>
            )
          })}
        </div>

        <FadeInView delay={500}>
          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-xs text-[#888888]">
              <ShieldCheck size="18" color="#888888" />
              <span>SSL Seguro</span>
            </div>
            <div className="w-px h-4 bg-[#2a2a2a]" />
            <div className="flex items-center gap-2 text-xs text-[#888888]">
              <Tag size="18" color="#888888" />
              <span>Tarjeta / Crypto / Bold</span>
            </div>
            <div className="w-px h-4 bg-[#2a2a2a]" />
            <div className="flex items-center gap-2 text-xs text-[#888888]">
              <Lightning size="18" color="#888888" />
              <span>Entrega Instantánea</span>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}

export default TrustBadges
