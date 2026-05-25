"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export default function HomePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = Cookies.get("access_token")
    if (token) {
      router.replace("/dashboard")
    } else {
      setChecking(false)
    }
  }, [router])

  if (checking) return null

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 animated-bg" />

      {/* Floating blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 40, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-400/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, -40, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center px-6 max-w-2xl">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-6xl mb-6 block">💰</span>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Finance Tracker
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Your money, under control.
          </p>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            Track spending, set budgets, manage bills — all in one calm, beautiful place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
        >
          <button
            onClick={() => router.push("/login")}
            className="flex-1 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-sm font-medium hover:bg-white/20 transition"
          >
            Sign in
          </button>
          <button
            onClick={() => router.push("/register")}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/30"
          >
            Get started
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-xs text-muted-foreground"
        >
          No credit card required · Free to use
        </motion.p>

      </div>
    </div>
  )
}