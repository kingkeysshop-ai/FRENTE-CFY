"use client"

import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import ChevronDown from "@modules/common/icons/chevron-down"
import Star from "@modules/common/icons/shopping-cart"
import ShoppingCart from "@modules/common/icons/shopping-cart"

const AccountNav = ({ customer }: { customer: HttpTypes.StoreCustomer | null }) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const navItems = [
    { href: "/account",           label: "Resumen",      icon: Star,  testid: "overview-link" },
    { href: "/account/profile",   label: "Mi Perfil",    icon: User,  testid: "profile-link" },
    { href: "/account/addresses", label: "Direcciones",  icon: MapPin,  testid: "addresses-link" },
    { href: "/account/orders",    label: "Mis Pedidos",  icon: ShoppingCart,  testid: "orders-link" },
  ]

  return (
    <div>
      {/* Mobile */}
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-sm text-[#888888] hover:text-[#facc15] py-2 transition-colors"
            data-testid="account-main-link"
          >
            <ChevronDown className="rotate-90" />
            <span>Mi Cuenta</span>
          </LocalizedClientLink>
        ) : (
          <ul className="flex flex-col">
            {navItems.map((item: any) => {
              const active = route.split(countryCode)[1] === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <LocalizedClientLink
                    href={item.href}
                    className={`flex items-center justify-between py-3 px-4 border-b border-[#2a2a2a] transition-colors ${
                      active ? "text-[#facc15] font-bold" : "text-[#888888] hover:text-[#facc15]"
                    }`}
                    data-testid={item.testid}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size="18" color="currentColor" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <ChevronDown className="-rotate-90 text-xs" />
                  </LocalizedClientLink>
                </li>
              )
            })}
            <li>
              <button
                type="button"
                className="flex items-center gap-2 py-3 px-4 w-full text-[#888888] hover:text-red-400 transition-colors text-sm"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <ArrowRightOnRectangle />
                <span>Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden small:block" data-testid="account-nav">
        <ul className="flex flex-col gap-1">
          {navItems.map((item: any) => {
            const active = route.split(countryCode)[1] === item.href
            const Icon = item.icon
            return (
              <li key={item.href}>
                <LocalizedClientLink
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    active
                      ? "bg-[#facc15]/10 text-[#facc15] font-bold border border-[#facc15]/30"
                      : "text-[#888888] hover:text-[#facc15] hover:bg-[#1a1a1a]"
                  }`}
                  data-testid={item.testid}
                >
                  <Icon size="18" color="currentColor" />
                  <span>{item.label}</span>
                </LocalizedClientLink>
              </li>
            )
          })}
          <li className="mt-2 pt-2 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#888888] hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 w-full"
              data-testid="logout-button"
            >
              <ArrowRightOnRectangle />
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AccountNav
