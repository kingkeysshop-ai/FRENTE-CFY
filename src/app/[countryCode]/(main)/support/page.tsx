import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-16 px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="text-xs text-[#facc15] font-bold uppercase tracking-widest hover:underline">← Volver al inicio</Link>
          <h1 className="text-4xl font-black text-white">🎧 Soporte</h1>
          <p className="text-[#888888] text-sm">King Keys — Licencias Digitales Originales</p>
          <div className="h-px bg-gradient-to-r from-[#facc15]/40 to-transparent mt-2" />
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-[#facc15]">☁️ Soporte 24/7</h2>
            <p className="text-[#888888] text-sm leading-relaxed">Estamos disponibles todos los días del año para ayudarte con cualquier problema relacionado con tu licencia o compra.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-[#facc15]">✉️ Correo electrónico</h2>
            <p className="text-[#888888] text-sm leading-relaxed">Envíanos un correo a soporte@kingkeys.com y te responderemos en menos de 2 horas hábiles.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-[#facc15]">⚡ Activación inmediata</h2>
            <p className="text-[#888888] text-sm leading-relaxed">Si tu licencia no se activó correctamente, contáctanos con tu número de pedido y lo resolvemos al instante.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-[#facc15]">🔄 Reemplazos</h2>
            <p className="text-[#888888] text-sm leading-relaxed">Si tu licencia dejó de funcionar por causas ajenas a ti, te la reemplazamos sin costo adicional.</p>
          </div>
        </div>

      </div>
    </div>
  )
}