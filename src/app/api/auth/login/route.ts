import { NextRequest, NextResponse } from "next/server"
import { findUserByEmail, validatePassword } from "@/lib/userStore"
import { signAccessToken, signRefreshToken } from "@/lib/auth"
import { setAuthCookies } from "@/lib/cookies"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const valid = await validatePassword(user, password)
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const payload = { userId: user.id, email: user.email, username: user.username }
    const accessToken  = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    await setAuthCookies(accessToken, refreshToken)

    return NextResponse.json({
      user: { id: user.id, email: user.email, username: user.username },
      accessToken,
    })
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}