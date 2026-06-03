"use client"

import { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

type ImageGalleryProps = {
  images: any[]
  title?: string
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images?.length) {
    return (
      <div className="w-full max-h-[420px] aspect-[4/3] bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-white/10">
        <span className="text-4xl">🔑</span>
      </div>
    )
  }

  const current = images[selectedIndex]?.url

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full max-h-[420px] min-h-[300px] flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-[0_0_30px_rgba(245,197,24,0.1)]">
        {current && (
          <Image
            src={current}
            alt={title ? `${title} - Imagen del producto` : "Imagen del producto"}
            className="object-contain object-center p-4"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            priority
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === selectedIndex
                  ? "border-[#F5C518] opacity-100"
                  : "border-white/10 opacity-60 hover:opacity-100"
              }`}
            >
              <div className="relative w-full h-full bg-[#1a1a1a]">
                <Image
                  src={img.url}
                  alt=""
                  className="object-cover"
                  fill
                  sizes="64px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
