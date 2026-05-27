"use client"

// Chakra UI eliminado — no compatible con @medusajs/ui v3 + React 19
// Wrapper neutro mantenido para no romper imports existentes en el proyecto
export default function KingKeysChakraProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
