"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function LoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { login }    = useAuth()

  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      const from = searchParams.get("from") ?? "/dashboard"
      toast.success("Welcome back!")
      router.push(from)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-4xl">💰</span>
          <h1 className="text-2xl font-bold mt-3">Finance Tracker</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-8 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border rounded-md p-2.5 mt-1 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border rounded-md p-2.5 mt-1 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-primary hover:underline font-medium"
            >
              Register here
            </button>
          </p>
        </form>

        {/* Demo hint */}
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Demo: register a new account to get started.
          </p>
        </div>
      </motion.div>
    </div>
  )
}