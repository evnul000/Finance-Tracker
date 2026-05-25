import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth"

// Open routes — anyone can visit these
const PUBLIC_ROUTES = ["/", "/login", "/register"]

// API routes that don't need auth
const PUBLIC_API     = ["/api/auth/login", "/api/auth/register", "/api/auth/refresh"]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Let public pages and API routes through
  if (PUBLIC_ROUTES.includes(pathname))  return NextResponse.next()
  if (PUBLIC_API.some((r) => pathname.startsWith(r))) return NextResponse.next()
  if (pathname.startsWith("/_next"))     return NextResponse.next()
  if (pathname.startsWith("/favicon"))   return NextResponse.next()

  // Check access token
  const accessToken = req.cookies.get("access_token")?.value
  const user        = accessToken ? verifyAccessToken(accessToken) : null

  // Not authenticated — redirect to login
  if (!user) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}