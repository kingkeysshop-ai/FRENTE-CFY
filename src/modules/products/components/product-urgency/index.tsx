"use client"

import { useEffect, useState } from "react"
import Lightning from "@modules/common/icons/lightning"
import Eye from "@modules/common/icons/eye"

const ProductUrgency = ({ inventory }: { inventory?: number }) => {
  const [viewers] = useState(() => Math.floor(Math.random() * 15) + 5)

  if (!inventory && inventory !== 0) return null

  return (
    <div className="flex flex-col gap-1.5 bg-[#1a1a1a]/60 border border-[#2a2a2a] rounded-lg px-4 py-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[#888888]">
          <Eye size="14" color="#888888" /> <span className="text-[#facc15] font-semibold">{viewers}</span> personas están viendo esto ahora
        </span>
      </div>
      {inventory > 0 && inventory <= 20 && (
        <div className="flex items-center gap-2 text-xs">
          <Lightning size="14" color="#ef4444" />
          <span className="text-[#888888]">
            Solo quedan <span className="text-red-400 font-bold">{inventory}</span> unidades
          </span>
        </div>
      )}
    </div>
  )
}

export default ProductUrgency
