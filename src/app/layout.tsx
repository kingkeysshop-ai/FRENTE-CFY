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
  description: "King Keys — El Reino Digital. Licencias originales para Windows, Office, Xbox, PlayStation y más. Entrega inmediata, precios sin competencia y soporte 24/7 en Colombia.",
  keywords: ["claves digitales", "licencias windows", "office barato", "xbox game pass", "playstation plus", "steam keys", "king keys", "software original", "reino digital", "licencias colombia"],
  authors: [{ name: "King Keys" }],
  creator: "King Keys",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
  },
  other: {
    "theme-color": "#facc15",
  },
  alternates: {
    canonical: getBaseURL(),
    languages: {
      "x-default": getBaseURL(),
      es: getBaseURL(),
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: getBaseURL(),
    siteName: "King Keys",
    title: "KING KEYS - Claves Digitales al Instante",
    description: "El Reino Digital — Licencias originales para Windows, Office, Xbox, PlayStation y más. Entrega inmediata, mejor precio garantizado.",
    images: [{ url: 'https://minio.cfynet.xyz/medusa-uploads/svg.jpg', width: 1600, height: 900, alt: 'King Keys - Claves Digitales al Instante' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KING KEYS - Claves Digitales al Instante",
    description: "El Reino Digital — Licencias originales al mejor precio. Entrega inmediata.",
    images: ['https://minio.cfynet.xyz/medusa-uploads/svg.jpg'],
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
      <body suppressHydrationWarning className="premium-scrollbar">
        <KingKeysChakraProvider>
          {/* Noise overlay texture */}
          <div className="noise-overlay" />

          {/* Enhanced ambient glow */}
          <div
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              background: [
                "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(250,204,21,0.05) 0%, transparent 70%)",
                "radial-gradient(ellipse 60% 50% at 80% 90%, rgba(250,204,21,0.03) 0%, transparent 60%)",
                "radial-gradient(ellipse 50% 40% at 20% 80%, rgba(250,204,21,0.02) 0%, transparent 50%)",
              ].join(", "),
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
