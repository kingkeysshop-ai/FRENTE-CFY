import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://front.cfynet.xyz"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/payment/", "/checkout/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
