import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth"

// In-memory store per user — replace with DB in production
const userTransactions: Record<string, unknown[]> = {}

function getAuthUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")
  if (!token) return null
  return verifyAccessToken(token)
}

export async function GET(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const transactions = userTransactions[user.userId] ?? []
  return NextResponse.json({ transactions })
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  if (!userTransactions[user.userId]) {
    userTransactions[user.userId] = []
  }

  const transaction = { ...body, id: crypto.randomUUID(), userId: user.userId }
  userTransactions[user.userId].unshift(transaction)

  return NextResponse.json({ transaction }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const user = getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
  }

  userTransactions[user.userId] = (userTransactions[user.userId] ?? []).filter(
    (t: unknown) => (t as { id: string }).id !== id
  )

  return NextResponse.json({ success: true })
}