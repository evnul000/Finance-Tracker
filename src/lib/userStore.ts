import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"

export type User = {
  id: string
  email: string
  username: string
  passwordHash: string
}

const DB_PATH = path.join(process.cwd(), ".data", "users.json")

function ensureFile() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]", "utf-8")
}

function readUsers(): User[] {
  ensureFile()
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"))
}

function writeUsers(users: User[]) {
  ensureFile()
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf-8")
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
  const users = readUsers()
  if (users.find(u => u.email === email)) throw new Error("Email already registered")
  const passwordHash = await bcrypt.hash(password, 12)
  const user: User = { id: crypto.randomUUID(), email, username, passwordHash }
  writeUsers([...users, user])
  return user
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return readUsers().find(u => u.email === email) ?? null
}

export async function validatePassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash)
}