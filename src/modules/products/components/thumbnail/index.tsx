import Image from "next/image"
import React from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  priority?: boolean
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  priority,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={[
        "relative w-full overflow-hidden bg-[#1a1a1a]",
        isFeatured ? "aspect-[11/14]" : size === "square" ? "aspect-[1/1]" : "aspect-[9/16]",
        className ?? "",
      ].join(" ")}
      data-testid={dataTestid}
    >
      {initialImage ? (
        <Image
          src={initialImage}
          alt="Product image"
          className="absolute inset-0 object-contain object-center p-1 group-hover:scale-105 transition-transform duration-500"
          draggable={false}
          quality={60}
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          fill
        />
      ) : (
        <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1a1a1a]">
          <span className="text-4xl">🔑</span>
          <span className="text-xs text-gray-600 uppercase tracking-widest">King Keys</span>
        </div>
      )}
    </div>
  )
}

export default Thumbnail
