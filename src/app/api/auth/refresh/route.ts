import { NextRequest, NextResponse } from "next/server"
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/auth"
import { setAuthCookies } from "@/lib/cookies"
import { REFRESH_TOKEN_COOKIE } from "@/lib/cookies"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 })
    }

    const payload = verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
    }

    // Issue new tokens — token rotation for security
    const newPayload     = { userId: payload.userId, email: payload.email, username: payload.username }
    const newAccessToken  = signAccessToken(newPayload)
    const newRefreshToken = signRefreshToken(newPayload)

    await setAuthCookies(newAccessToken, newRefreshToken)

    return NextResponse.json({ accessToken: newAccessToken })
  } catch {
    return NextResponse.json({ error: "Token refresh failed" }, { status: 500 })
  }
}