import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth"

const userSettings: Record<string, unknown> = {}

function getAuthUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  return verifyAccessToken(token)
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({
    settings: userSettings[user.userId] ?? {
      username: user.username,
      profileIcon: "cat",
      theme: "dark",
    }
  })
}

export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const updates = await req.json()
  userSettings[user.userId] = {
    ...(userSettings[user.userId] as object ?? {}),
    ...updates,
  }
  return NextResponse.json({ success: true })
}