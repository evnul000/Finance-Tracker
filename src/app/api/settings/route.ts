import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function getAuthUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  return verifyAccessToken(token)
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  let settings = await prisma.settings.findUnique({ where: { userId: user.userId } })
  if (!settings) {
    settings = await prisma.settings.create({
      data: { userId: user.userId, username: user.username, profileIcon: "cat", theme: "dark" },
    })
  }
  return NextResponse.json({ settings })
}

export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const updates = await req.json()
  await prisma.settings.upsert({
    where: { userId: user.userId },
    update: updates,
    create: { userId: user.userId, username: user.username, profileIcon: "cat", theme: "dark", ...updates },
  })
  return NextResponse.json({ success: true })
}