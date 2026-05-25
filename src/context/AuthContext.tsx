"use client"

import {
  createContext, useContext, useState,
  useEffect, ReactNode, useCallback
} from "react"
import Cookies from "js-cookie"
import { apiClient } from "@/lib/apiClient"

type AuthUser = {
  userId: string
  email: string
  username: string
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      const token = Cookies.get("access_token")
      if (!token) {
        setLoading(false)
        return
      }
      const data = await apiClient.get<{ user: AuthUser }>("/api/auth/me")
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  async function login(email: string, password: string) {
    const data = await apiClient.post<{ user: AuthUser; accessToken: string }>(
      "/api/auth/login",
      { email, password }
    )
    setUser(data.user)
  }

  async function register(email: string, username: string, password: string) {
    const data = await apiClient.post<{ user: AuthUser; accessToken: string }>(
      "/api/auth/register",
      { email, username, password }
    )
    setUser(data.user)
  }

 async function logout() {
  await apiClient.post("/api/auth/logout", {})
  Cookies.remove("access_token")
  // Clear any cached localStorage data
  localStorage.clear()
  setUser(null)
  window.location.href = "/"
}

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}