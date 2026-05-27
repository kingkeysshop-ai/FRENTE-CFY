import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import KingKeysChakraProvider from "@lib/providers/chakra-provider"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "KING KEYS - Claves Digitales al Instante",
    template: "%s | KING KEYS",
  },
  description: "King Keys es tu tienda de confianza para claves digitales: Windows, Office, Xbox, PlayStation y mas. Entrega inmediata, precios imbatibles y soporte 24/7.",
  keywords: ["claves digitales", "licencias windows", "office barato", "xbox game pass", "playstation plus", "steam keys", "king keys", "software original"],
  authors: [{ name: "King Keys" }],
  creator: "King Keys",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
  },
  other: {
    "theme-color": "#facc15",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: getBaseURL(),
    siteName: "King Keys",
    title: "KING KEYS - Claves Digitales al Instante",
    description: "Compra claves digitales originales al mejor precio. Windows, Office, Xbox, PlayStation y mas. Entrega inmediata.",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "King Keys - Claves Digitales" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KING KEYS - Claves Digitales al Instante",
    description: "Compra claves digitales originales al mejor precio. Entrega inmediata.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <KingKeysChakraProvider>
          {/* Ambient glow */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              background: "radial-gradient(circle at 50% 50%, rgba(250,204,21,0.03) 0%, transparent 70%)",
            }}
          />
          <main className="relative">
            {props.children}
          </main>
        </KingKeysChakraProvider>
      </body>
    </html>
  )
}
