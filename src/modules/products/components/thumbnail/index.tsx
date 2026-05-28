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
        "relative w-full overflow-hidden bg-gray-800",
        isFeatured ? "aspect-[11/14]" : size === "square" ? "aspect-[1/1]" : "aspect-[9/16]",
        className ?? "",
      ].join(" ")}
      data-testid={dataTestid}
    >
      {initialImage ? (
        <Image
          src={initialImage}
          alt="Thumbnail"
          className="absolute inset-0 object-contain object-center p-1 group-hover:scale-105 transition-transform duration-500"
          draggable={false}
          quality={60}
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23374151' width='40' height='40'/%3E%3C/svg%3E"
          priority={priority}
          fill
        />
      ) : (
        <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-800">
          <span className="text-4xl">🔑</span>
          <span className="text-xs text-gray-600 uppercase tracking-widest">King Keys</span>
        </div>
      )}
    </div>
  )
}

export default Thumbnail
