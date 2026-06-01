"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "pending", label: "Pendiente" },
  { value: "completed", label: "Completado" },
  { value: "canceled", label: "Cancelado" },
  { value: "requires_action", label: "Requiere acción" },
]

const DATE_OPTIONS = [
  { value: "", label: "Todo" },
  { value: "7", label: "Últimos 7 días" },
  { value: "30", label: "Últimos 30 días" },
  { value: "90", label: "Últimos 90 días" },
]

const OrderFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get("status") || ""
  const currentDays = searchParams.get("days") || ""

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleStatusChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("status", value)}`)
  }

  const handleDaysChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("days", value)
    } else {
      params.delete("days")
    }
    params.delete("from")
    params.delete("to")
    router.push(`${pathname}?${params.toString()}`)
  }

  const hasActiveFilters = currentStatus || currentDays

  const clearFilters = () => {
    router.push(pathname)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-xl px-4 py-2.5 appearance-none hover:bg-[#2a2a2a] transition-colors focus:outline-none focus:border-[#facc15] cursor-pointer"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={currentDays}
          onChange={(e) => handleDaysChange(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-xl px-4 py-2.5 appearance-none hover:bg-[#2a2a2a] transition-colors focus:outline-none focus:border-[#facc15] cursor-pointer"
        >
          {DATE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#888888] hover:text-[#facc15] transition-colors font-semibold"
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}

export default OrderFilters
