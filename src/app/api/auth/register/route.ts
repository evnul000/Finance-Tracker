import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/userStore"
import { signAccessToken, signRefreshToken } from "@/lib/auth"
import { setAuthCookies } from "@/lib/cookies"

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const user = await createUser(email, username, password)

    const payload = { userId: user.id, email: user.email, username: user.username }
    const accessToken  = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    await setAuthCookies(accessToken, refreshToken)

    return NextResponse.json({
      user: { id: user.id, email: user.email, username: user.username },
      accessToken,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}