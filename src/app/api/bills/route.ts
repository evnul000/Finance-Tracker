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
  const bills = await prisma.bill.findMany({ where: { userId: user.userId } })
  return NextResponse.json({ bills })
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const bill = await prisma.bill.create({
    data: { ...body, userId: user.userId },
  })
  return NextResponse.json({ bill }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const id = new URL(req.url).searchParams.get("id")
  const all = new URL(req.url).searchParams.get("all")
  if (all) {
    await prisma.bill.deleteMany({ where: { userId: user.userId } })
  } else {
    await prisma.bill.delete({ where: { id: id! } })
  }
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, ...updates } = await req.json()
  await prisma.bill.update({ where: { id }, data: updates })
  return NextResponse.json({ success: true })
}