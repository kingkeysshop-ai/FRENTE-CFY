import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import NewsletterSignup from "@components/NewsletterSignup"
import CheckCircle from "@modules/common/icons/check-circle"
import Lightning from "@modules/common/icons/lightning"
import ShieldCheck from "@modules/common/icons/shield-check"
import Store from "@modules/common/icons/store"
import Box from "@modules/common/icons/box"
import User from "@modules/common/icons/user"
import Tag from "@modules/common/icons/tag"
import Refresh from "@modules/common/icons/refresh"
import Headset from "@modules/common/icons/headset"

export default async function Footer() {
  const { collections } = await listCollections().catch(() => ({ collections: [], count: 0 }))
  const productCategories = await listCategories().catch(() => [])

  return (
    <footer className="bg-[#111111] border-t border-[#2a2a2a] w-full">
      <div className="content-container flex flex-col w-full py-16">

        {/* Parte superior */}
        <div className="flex flex-col gap-y-10 lg:flex-row items-start justify-between pb-12 border-b border-[#2a2a2a]">

          {/* Logo y descripcion */}
          <div className="flex flex-col gap-4 max-w-xs">
            <LocalizedClientLink href="/" className="text-2xl font-black tracking-normal uppercase">
              <span className="text-white">KING</span>
              <span className="text-[#facc15]"> KEYS</span>
            </LocalizedClientLink>
            <p className="text-sm text-[#888888] leading-relaxed">
              Licencias digitales originales al mejor precio. Activación inmediata y soporte 24/7.
            </p>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="px-3 py-1 bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] text-xs rounded-full font-medium inline-flex items-center gap-1">
                <CheckCircle size="12" color="#facc15" /> 100% Original
              </span>
              <span className="px-3 py-1 bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] text-xs rounded-full font-medium inline-flex items-center gap-1">
                <Lightning size="12" color="#facc15" /> Entrega Inmediata
              </span>
              <span className="px-3 py-1 bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] text-xs rounded-full font-medium inline-flex items-center gap-1">
                <ShieldCheck size="12" color="#facc15" /> Pago Seguro
              </span>
            </div>
            {/* Newsletter */}
            <div className="mt-6">
              <NewsletterSignup />
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">

            {/* Tienda */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold uppercase tracking-wider text-xs inline-flex items-center gap-1.5">
                <Store size="14" color="white" /> Tienda
              </span>
              <ul className="flex flex-col gap-2">
                <li>
                  <LocalizedClientLink href="/store" className="text-[#888888] hover:text-[#facc15] transition-colors duration-200">
                    Todos los productos
                  </LocalizedClientLink>
                </li>
                {productCategories?.slice(0, 4).map((c: any) => !c.parent_category && (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/categories/${c.handle}`}
                      className="text-[#888888] hover:text-[#facc15] transition-colors duration-200"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colecciones */}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-white font-bold uppercase tracking-wider text-xs inline-flex items-center gap-1.5">
                  <Box size="14" color="white" /> Colecciones
                </span>
                <ul className="flex flex-col gap-2">
                  {collections.slice(0, 5).map((c: any) => (
                    <li key={c.id}>
                  <LocalizedClientLink
                    href={`/collections/${c.handle}`}
                    className="text-[#888888] hover:text-[#facc15] transition-colors duration-200"
                  >
                    {c.title}
                  </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mi Cuenta */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold uppercase tracking-wider text-xs inline-flex items-center gap-1.5">
                <User size="14" color="white" /> Mi Cuenta
              </span>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Iniciar Sesión", href: "/account" },
                  { label: "Mis Pedidos", href: "/account/orders" },
                  { label: "Perfil", href: "/account/profile" },
                  { label: "Carrito", href: "/cart" },
                ].map((item: any) => (
                  <li key={item.href}>
                    <LocalizedClientLink
                      href={item.href}
                      className="text-[#888888] hover:text-[#facc15] transition-colors duration-200"
                    >
                      {item.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="flex flex-col gap-4 py-8 border-b border-[#2a2a2a]">
          <span className="text-white font-bold uppercase tracking-wider text-xs text-center inline-flex items-center justify-center gap-1.5">
            <Tag size="14" color="white" /> Métodos de Pago
          </span>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-[#888888] text-sm flex items-center gap-1.5"><Tag size="14" color="#888888" /> Tarjeta</span>
            <span className="text-[#2a2a2a]">|</span>
            <span className="text-[#888888] text-sm flex items-center gap-1.5">₿ Crypto (Aurpay)</span>
            <span className="text-[#2a2a2a]">|</span>
            <span className="text-[#888888] text-sm flex items-center gap-1.5">Bold (Colombia)</span>
            <span className="text-[#2a2a2a]">|</span>
            <span className="text-[#888888] text-sm flex items-center gap-1.5">Cryptomus</span>
          </div>
        </div>

        {/* Garantías */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-6 text-xs text-[#888888] border-b border-[#2a2a2a]">
          <span className="flex items-center gap-1.5"><CheckCircle size="14" color="#888888" /> 100% Original</span>
          <span className="hidden sm:inline text-[#2a2a2a]">•</span>
          <span className="flex items-center gap-1.5"><Refresh size="14" color="#888888" /> Reembolso Garantizado</span>
          <span className="hidden sm:inline text-[#2a2a2a]">•</span>
          <span className="flex items-center gap-1.5"><Headset size="14" color="#888888" /> Soporte 24/7</span>
          <span className="hidden sm:inline text-[#2a2a2a]">•</span>
          <span className="flex items-center gap-1.5"><Lightning size="14" color="#888888" /> Entrega Inmediata</span>
        </div>

        {/* Redes Sociales */}
        <div className="flex items-center justify-center gap-4 py-6 border-b border-[#2a2a2a]">
          <span className="text-[#888888] text-xs uppercase tracking-widest">Síguenos:</span>
          <a href="https://x.com/kingkeys" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-[#facc15] transition-colors text-lg" aria-label="Twitter/X">𝕏</a>
          <a href="https://instagram.com/kingkeys" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-[#facc15] transition-colors text-lg" aria-label="Instagram">📷</a>
          <a href="https://tiktok.com/@kingkeys" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-[#facc15] transition-colors text-lg" aria-label="TikTok">♪</a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-[#facc15] transition-colors text-lg" aria-label="WhatsApp">💬</a>
        </div>

        {/* Parte inferior */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-[#888888]">
          <p>© {new Date().getFullYear()} <span className="font-bold text-gold">King Keys</span>. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <LocalizedClientLink href="/privacy" className="hover:text-[#facc15] transition-colors duration-200">Privacidad</LocalizedClientLink>
            <LocalizedClientLink href="/terms" className="hover:text-[#facc15] transition-colors duration-200">Términos</LocalizedClientLink>
            <LocalizedClientLink href="/support" className="hover:text-[#facc15] transition-colors duration-200">Soporte</LocalizedClientLink>
          </div>
        </div>

        {/* Texto legal */}
        <div className="text-center pt-4 text-[10px] text-[#888888]/40 leading-relaxed max-w-2xl mx-auto">
          King Keys es distribuidor autorizado de licencias digitales. Todos los productos son 100% originales con garantía de activación.
          Los nombres de marcas, logotipos y productos mencionados son marcas registradas de sus respectivos dueños.
          El uso de este sitio web implica la aceptación de nuestros términos y condiciones.
        </div>

      </div>
    </footer>
  )
}
