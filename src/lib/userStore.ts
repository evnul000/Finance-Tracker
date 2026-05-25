import bcrypt from "bcryptjs"

export type User = {
  id: string
  email: string
  username: string
  passwordHash: string
}

const users: User[] = []

export async function createUser(email: string, username: string, password: string): Promise<User> {
  if (users.find(u => u.email === email)) throw new Error("Email already registered")
  const passwordHash = await bcrypt.hash(password, 12)
  const user: User = { id: crypto.randomUUID(), email, username, passwordHash }
  users.push(user)
  return user
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return users.find(u => u.email === email) ?? null
}

export async function validatePassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash)
}