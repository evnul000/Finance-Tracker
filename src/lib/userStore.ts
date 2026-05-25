import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export type User = {
  id: string
  email: string
  username: string
  passwordHash: string
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error("Email already registered")
  const passwordHash = await bcrypt.hash(password, 12)
  return prisma.user.create({ data: { email, username, passwordHash } })
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } })
}

export async function validatePassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash)
}