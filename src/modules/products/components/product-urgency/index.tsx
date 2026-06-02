"use client"

import { useState } from "react"
import Eye from "@modules/common/icons/eye"

const ProductUrgency = ({ inventory }: { inventory?: number }) => {
  const [viewers] = useState(() => Math.floor(Math.random() * 15) + 5)

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 flex items-center gap-3">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>
      <span className="text-gray-300 text-sm">
        <Eye size="14" color="#888888" className="inline mr-1" />
        <span className="text-[#F5C518] font-semibold">{viewers}</span> personas están viendo esto ahora
      </span>
    </div>
  )
}

export default ProductUrgency
