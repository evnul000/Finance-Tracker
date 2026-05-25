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
  const transactions = await prisma.transaction.findMany({
    where: { userId: user.userId },
    orderBy: { date: "desc" },
  })
  return NextResponse.json({ transactions })
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const transaction = await prisma.transaction.create({
    data: { ...body, userId: user.userId },
  })
  return NextResponse.json({ transaction }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const id = new URL(req.url).searchParams.get("id")
  const all = new URL(req.url).searchParams.get("all")
  if (all) {
    await prisma.transaction.deleteMany({ where: { userId: user.userId } })
  } else {
    await prisma.transaction.delete({ where: { id: id!, userId: user.userId } } as Parameters<typeof prisma.transaction.delete>[0])
  }
  return NextResponse.json({ success: true })
}