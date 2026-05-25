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
  const budgets = await prisma.budget.findMany({ where: { userId: user.userId } })
  return NextResponse.json({ budgets })
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { category, limit, month } = await req.json()
  const existing = await prisma.budget.findFirst({
    where: { userId: user.userId, category, month },
  })
  if (existing) {
    await prisma.budget.update({ where: { id: existing.id }, data: { limit } })
  } else {
    await prisma.budget.create({ data: { category, limit, month, userId: user.userId } })
  }
  return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const id = new URL(req.url).searchParams.get("id")
  const all = new URL(req.url).searchParams.get("all")
  if (all) {
    await prisma.budget.deleteMany({ where: { userId: user.userId } })
  } else {
    await prisma.budget.delete({ where: { id: id! } })
  }
  return NextResponse.json({ success: true })
}