"use client"

import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react"

const NAV_ITEMS = [
  { href: "/",        icon: Home,         label: "Inicio"  },
  { href: "/store",   icon: ShoppingBag,  label: "Tienda"  },
  { href: "/cart",    icon: ShoppingCart, label: "Carrito" },
  { href: "/account", icon: User,         label: "Cuenta"  },
]

const MobileBottomNav = () => {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || /^\/[a-z]{2}(\/)?$/.test(pathname)
      : pathname.includes(href)

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 small:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isActive(href)
          return (
            <LocalizedClientLink
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-0.5 py-2 px-4 transition-colors duration-200"
            >
              <span
                className="absolute -top-px left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F5C518] transition-all duration-300"
                style={{ opacity: active ? 1 : 0, transform: active ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0)" }}
              />

              <Icon
                className="w-5 h-5 transition-all duration-200"
                style={{
                  transform: active ? "scale(1.15)" : "scale(1)",
                  color: active ? "#F5C518" : "#9CA3AF",
                }}
                absoluteStrokeWidth
              />

              <span
                className="text-xs font-medium transition-colors duration-200"
                style={{ color: active ? "#F5C518" : "#9CA3AF" }}
              >
                {label}
              </span>

              {active && (
                <span className="absolute inset-0 rounded-xl bg-[#F5C518]/10 pointer-events-none" />
              )}
            </LocalizedClientLink>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
