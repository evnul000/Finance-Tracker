import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth"

const userBudgets: Record<string, unknown[]> = {}

function getAuthUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  return verifyAccessToken(token)
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ budgets: userBudgets[user.userId] ?? [] })
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const budget = await req.json()
  if (!userBudgets[user.userId]) userBudgets[user.userId] = []
  const existing = (userBudgets[user.userId] as {id:string;category:string;month:string}[])
    .find(b => b.category === budget.category && b.month === budget.month)
  if (existing) {
    userBudgets[user.userId] = userBudgets[user.userId].map((b: unknown) =>
      (b as {id:string}).id === existing.id ? { ...(b as object), ...budget } : b
    )
  } else {
    userBudgets[user.userId].unshift({ ...budget, id: crypto.randomUUID() })
  }
  return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const id = new URL(req.url).searchParams.get("id")
  userBudgets[user.userId] = (userBudgets[user.userId] ?? []).filter((b: unknown) => (b as {id:string}).id !== id)
  return NextResponse.json({ success: true })
}