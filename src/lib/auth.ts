import jwt from "jsonwebtoken"

export type JWTPayload = {
  userId: string
  email: string
  username: string
}

export function signAccessToken(payload: JWTPayload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
  })
}

export function signRefreshToken(payload: JWTPayload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  })
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JWTPayload
  } catch {
    return null
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JWTPayload
  } catch {
    return null
  }
}