import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export type User = {
  id: string
  email: string
  username: string
  passwordHash: string
}

export async function createUser(
  email: string,
  username: string,
  password: string
): Promise<User> {
  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error("Email already registered")
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, username, passwordHash },
    })
    return user
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Failed to create user")
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({ where: { email } })
  } catch {
    return null
  }
}

export async function validatePassword(
  user: User,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash)
}