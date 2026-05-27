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
          <canvas
            id="pk-canvas"
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          />
          <main className="relative z-10 min-h-screen">{props.children}</main>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener("DOMContentLoaded", function() {
                  var canvas = document.getElementById("pk-canvas");
                  if (!canvas) return;
                  var ctx = canvas.getContext("2d");
                  if (!ctx) return;
                  var W, H, particles = [];
                  var mouseX = -1e4, mouseY = -1e4, mouseActive = false;
                  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
                  function init() {
                    resize();
                    var count = Math.min(Math.floor((W * H) / 10000), 100);
                    particles = [];
                    for (var i = 0; i < count; i++) {
                      particles.push({
                        x: Math.random() * W, y: Math.random() * H,
                        vx: 0, vy: 0,
                        baseX: Math.random() * W, baseY: Math.random() * H,
                        size: Math.random() * 2.5 + 0.5,
                        alpha: Math.random() * 0.6 + 0.2
                      });
                    }
                  }
                  function draw() {
                    ctx.clearRect(0, 0, W, H);
                    for (var i = 0; i < particles.length; i++) {
                      var p = particles[i];
                      p.vx += (p.baseX - p.x) * 0.008;
                      p.vy += (p.baseY - p.y) * 0.008;
                      p.vx *= 0.95; p.vy *= 0.95;
                      if (mouseActive) {
                        var dx = mouseX - p.x, dy = mouseY - p.y;
                        var dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 200 && dist > 0) {
                          var force = (200 - dist) / 200;
                          p.vx -= (dx / dist) * force * 2;
                          p.vy -= (dy / dist) * force * 2;
                        }
                      }
                      p.x += p.vx; p.y += p.vy;
                      ctx.beginPath();
                      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                      ctx.fillStyle = "rgba(250, 204, 21, " + p.alpha + ")";
                      ctx.fill();
                    }
                    for (var i2 = 0; i2 < particles.length; i2++) {
                      for (var j = i2 + 1; j < particles.length; j++) {
                        var dx2 = particles[i2].x - particles[j].x;
                        var dy2 = particles[i2].y - particles[j].y;
                        var dist2 = dx2 * dx2 + dy2 * dy2;
                        if (dist2 < 15000) {
                          var d = Math.sqrt(dist2);
                          ctx.beginPath();
                          ctx.moveTo(particles[i2].x, particles[i2].y);
                          ctx.lineTo(particles[j].x, particles[j].y);
                          ctx.strokeStyle = "rgba(250, 204, 21, " + ((1 - d / 122) * 0.2) + ")";
                          ctx.lineWidth = 0.5;
                          ctx.stroke();
                        }
                      }
                    }
                    requestAnimationFrame(draw);
                  }
                  function onClick(e) {
                    for (var i = 0; i < particles.length; i++) {
                      var dx = particles[i].x - e.clientX;
                      var dy = particles[i].y - e.clientY;
                      var dist = Math.sqrt(dx * dx + dy * dy);
                      if (dist < 300 && dist > 0) {
                        var force = (300 - dist) / 300;
                        particles[i].vx += (dx / dist) * force * 12;
                        particles[i].vy += (dy / dist) * force * 12;
                      }
                    }
                  }
                  function onMove(e) { mouseX = e.clientX; mouseY = e.clientY; mouseActive = true; }
                  function onLeave() { mouseActive = false; mouseX = -1e4; mouseY = -1e4; }
                  window.addEventListener("resize", function() { init(); });
                  document.addEventListener("click", onClick);
                  canvas.addEventListener("mousemove", onMove);
                  canvas.addEventListener("mouseleave", onLeave);
                  init();
                  draw();
                });
              `,
            }}
          />
        </KingKeysChakraProvider>
      </body>
    </html>
  )
}