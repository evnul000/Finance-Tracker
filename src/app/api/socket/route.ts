import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Socket.io runs on the custom server — see server.ts"
  })
}