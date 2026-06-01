"use client"

import { useEffect, useState } from "react"

const FAKE_ACTIVITIES = [
  { name: "Carlos", country: "Colombia", product: "Windows 11 Pro", time: "hace 2 min" },
  { name: "María", country: "México", product: "Office 2024", time: "hace 5 min" },
  { name: "José", country: "España", product: "Windows 10 Home", time: "hace 8 min" },
  { name: "Ana", country: "Argentina", product: "Xbox Game Pass", time: "hace 12 min" },
  { name: "Luis", country: "Chile", product: "Office 2021", time: "hace 15 min" },
  { name: "Sofía", country: "Perú", product: "PlayStation Plus", time: "hace 20 min" },
  { name: "Pedro", country: "Ecuador", product: "Windows 11 Pro", time: "hace 25 min" },
  { name: "Laura", country: "Colombia", product: "Antivirus Total", time: "hace 30 min" },
  { name: "Diego", country: "México", product: "Steam Wallet", time: "hace 35 min" },
  { name: "Valentina", country: "Chile", product: "Windows 11 Home", time: "hace 40 min" },
]

const STORAGE_KEY = "kingkeys_last_activity"
const COOLDOWN_MS = 300000

const RecentActivityToast = () => {
  const [activity, setActivity] = useState<typeof FAKE_ACTIVITIES[0] | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const lastShown = localStorage.getItem(STORAGE_KEY)
    const now = Date.now()

    if (lastShown && now - Number(lastShown) < COOLDOWN_MS) return

    const show = () => {
      const item = FAKE_ACTIVITIES[Math.floor(Math.random() * FAKE_ACTIVITIES.length)]
      setActivity(item)
      setVisible(true)
      try { localStorage.setItem(STORAGE_KEY, now.toString()) } catch {}
      setTimeout(() => setVisible(false), 6000)
    }

    const delay = setTimeout(show, 4000 + Math.random() * 6000)
    return () => clearTimeout(delay)
  }, [])

  if (!visible || !activity) return null

  return (
    <div className="fixed bottom-24 left-4 small:bottom-6 small:left-6 z-[199]">
      <div
        className="flex items-center gap-3 bg-[#111111]/95 border border-[#facc15]/20 rounded-xl px-4 py-3 shadow-2xl shadow-black backdrop-blur-md transition-all duration-500 cursor-default"
        style={{
          animation: "slideUp 0.4s ease-out",
          maxWidth: 320,
        }}
      >
        <span className="text-lg shrink-0">🛒</span>
        <div className="flex flex-col min-w-0">
          <p className="text-xs text-[#888888] leading-snug">
            <span className="text-[#facc15] font-semibold">{activity.name}</span>
            <span className="text-[#888888]"> de </span>
            <span className="text-[#888888]">{activity.country}</span>
          </p>
          <p className="text-xs text-[#888888]">
            compró <span className="text-[#888888] font-medium">{activity.product}</span> {activity.time}
          </p>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default RecentActivityToast
