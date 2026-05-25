import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  const payload = verifyAccessToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
    },
  })
}