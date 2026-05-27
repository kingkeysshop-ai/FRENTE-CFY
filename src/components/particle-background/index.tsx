"use client"

export default function ParticleBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "radial-gradient(circle at 50% 50%, rgba(250,204,21,0.03) 0%, transparent 70%)",
      }}
    />
  )
}
