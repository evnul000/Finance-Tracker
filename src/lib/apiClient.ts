import Cookies from "js-cookie"

const BASE_URL = typeof window !== "undefined" 
  ? "" 
  : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  
async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // sends httpOnly refresh token cookie
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.accessToken
  } catch {
    return null
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let accessToken = Cookies.get("access_token")

  const makeRequest = async (token: string | undefined) => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    })
  }

  let res = await makeRequest(accessToken)

  // Only try to refresh if it's NOT an auth endpoint
  if (res.status === 401 && !endpoint.startsWith("/api/auth")) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      accessToken = newToken
      res = await makeRequest(newToken)
    } else {
      window.location.href = "/login"
      throw new Error("Session expired")
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error ?? "Request failed")
  }

  return res.json()
}

export const apiClient = {
  get:    <T>(url: string)                      => request<T>(url),
  post:   <T>(url: string, body: unknown)       => request<T>(url, { method: "POST",   body: JSON.stringify(body) }),
  delete: <T>(url: string)                      => request<T>(url, { method: "DELETE" }),
  patch:  <T>(url: string, body: unknown)       => request<T>(url, { method: "PATCH",  body: JSON.stringify(body) }),
}