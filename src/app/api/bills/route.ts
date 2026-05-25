import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth"

const userBills: Record<string, unknown[]> = {}

function getAuthUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  return verifyAccessToken(token)
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ bills: userBills[user.userId] ?? [] })
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const bill = await req.json()
  if (!userBills[user.userId]) userBills[user.userId] = []
  userBills[user.userId].unshift({ ...bill, id: crypto.randomUUID() })
  return NextResponse.json({ bill: userBills[user.userId][0] }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const id = new URL(req.url).searchParams.get("id")
  userBills[user.userId] = (userBills[user.userId] ?? []).filter((b: unknown) => (b as {id:string}).id !== id)
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, ...updates } = await req.json()
  userBills[user.userId] = (userBills[user.userId] ?? []).map((b: unknown) =>
    (b as {id:string}).id === id ? { ...(b as object), ...updates } : b
  )
  return NextResponse.json({ success: true })
}