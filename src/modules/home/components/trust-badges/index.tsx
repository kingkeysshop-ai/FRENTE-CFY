import FadeInView from "@components/FadeInView"

const LOGOS = [
  { name: "Microsoft", icon: "🪟" },
  { name: "Windows", icon: "💠" },
  { name: "Office", icon: "📊" },
  { name: "Xbox", icon: "🎮" },
  { name: "PlayStation", icon: "🎮" },
  { name: "Steam", icon: "💎" },
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
          {LOGOS.map((logo, i) => (
            <FadeInView key={logo.name} delay={i * 80}>
              <div className="flex flex-col items-center gap-1.5 group cursor-default">
                <span className="text-3xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  {logo.icon}
                </span>
                <span className="text-[10px] text-[#888888] group-hover:text-[#888888] uppercase tracking-wider font-semibold transition-colors duration-200">
                  {logo.name}
                </span>
              </div>
            </FadeInView>
          ))}
        </div>

        <FadeInView delay={500}>
          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-xs text-[#888888]">
              <span className="text-lg">🔒</span>
              <span>SSL Seguro</span>
            </div>
            <div className="w-px h-4 bg-[#2a2a2a]" />
            <div className="flex items-center gap-2 text-xs text-[#888888]">
              <span className="text-lg">💳</span>
              <span>Tarjeta / Crypto / Bold</span>
            </div>
            <div className="w-px h-4 bg-[#2a2a2a]" />
            <div className="flex items-center gap-2 text-xs text-[#888888]">
              <span className="text-lg">⚡</span>
              <span>Entrega Instantánea</span>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}

export default TrustBadges
