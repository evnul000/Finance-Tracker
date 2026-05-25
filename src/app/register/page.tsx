"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { motion } from "framer-motion"
import { toast } from "sonner"

export default function RegisterPage() {
  const router          = useRouter()
  const { register }    = useAuth()

  const [email, setEmail]       = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await register(email, username, password)
      toast.success("Account created!")
      router.push("/")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed"
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
          <p className="text-muted-foreground mt-1 text-sm">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-8 space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              required
              className="w-full border rounded-md p-2.5 mt-1 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

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
              placeholder="Min. 6 characters"
              required
              minLength={6}
              className="w-full border rounded-md p-2.5 mt-1 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  )
}