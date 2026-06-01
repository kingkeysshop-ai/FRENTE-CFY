import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Footer = () => {
  return (
    <footer className="bg-[#080808] border-t border-[#F5C518]/20 w-full shadow-[0_-1px_0_rgba(245,197,24,0.1)]">
      <div className="max-w-7xl mx-auto px-8 py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Columna 1 - Marca */}
          <div className="flex flex-col gap-4">
            <LocalizedClientLink href="/" className="text-2xl font-black tracking-normal uppercase w-fit">
              <span className="text-white">KING</span>
              <span className="text-[#F5C518]"> KEYS</span>
            </LocalizedClientLink>
            <p className="text-sm text-gray-400 leading-relaxed">
              Licencias digitales originales. Activación inmediata garantizada.
            </p>
            <span className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                <span className="relative w-2 h-2 rounded-full bg-green-500" />
              </span>
              ONLINE · 24/7
            </span>
          </div>

          {/* Columna 2 - Tienda */}
          <div className="flex flex-col gap-3">
            <span className="text-[#F5C518] font-mono text-sm font-semibold">&gt; ./tienda</span>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Todos los productos", href: "/store" },
                { label: "Ofertas", href: "/store?offers=true" },
                { label: "Categorías", href: "/categories" },
                { label: "Novedades", href: "/store?sort=newest" },
              ].map((item) => (
                <li key={item.href}>
                  <LocalizedClientLink
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-[#F5C518] transition-colors duration-200"
                  >
                    {item.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 - Cuenta */}
          <div className="flex flex-col gap-3">
            <span className="text-[#F5C518] font-mono text-sm font-semibold">&gt; ./cuenta</span>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Iniciar Sesión", href: "/account" },
                { label: "Mis Pedidos", href: "/account/orders" },
                { label: "Perfil", href: "/account/profile" },
                { label: "Favoritos", href: "/wishlist" },
              ].map((item) => (
                <li key={item.href}>
                  <LocalizedClientLink
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-[#F5C518] transition-colors duration-200"
                  >
                    {item.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4 - Soporte */}
          <div className="flex flex-col gap-3">
            <span className="text-[#F5C518] font-mono text-sm font-semibold">&gt; ./soporte</span>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Centro de ayuda", href: "/help" },
                { label: "Garantía", href: "/warranty" },
                { label: "Contacto", href: "/contact" },
                { label: "Términos", href: "/terms" },
                { label: "Privacidad", href: "/privacy" },
              ].map((item) => (
                <li key={item.href}>
                  <LocalizedClientLink
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-[#F5C518] transition-colors duration-200"
                  >
                    {item.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; 2026 King Keys. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="font-semibold text-gray-300">VISA</span>
            <span className="text-gray-600">|</span>
            <span className="font-semibold text-gray-300">Mastercard</span>
            <span className="text-gray-600">|</span>
            <span className="font-semibold text-gray-300">Crypto</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
