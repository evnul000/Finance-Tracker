import { cookies } from "next/headers"

export const REFRESH_TOKEN_COOKIE = "refresh_token"
export const ACCESS_TOKEN_COOKIE  = "access_token"

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()

  // Access token — short lived, readable by JS for API calls
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutes
    path: "/",
  })

  // Refresh token — long lived, httpOnly so JS cannot touch it
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  cookieStore.delete(REFRESH_TOKEN_COOKIE)
}