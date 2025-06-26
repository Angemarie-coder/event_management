import bcrypt from "bcryptjs"
import { sql } from "./db"
import type { User } from "./db"
import { cookies } from "next/headers"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Simple session management using user ID in cookie
export async function createSession(userId: number): Promise<string> {
  // Create a simple session token (in production, use a more secure approach)
  const sessionToken = Buffer.from(`${userId}:${Date.now()}`).toString("base64")
  return sessionToken
}

export async function verifySession(sessionToken: string): Promise<number | null> {
  try {
    const decoded = Buffer.from(sessionToken, "base64").toString()
    const [userId] = decoded.split(":")
    return Number.parseInt(userId) || null
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session-token")?.value

    if (!sessionToken) return null

    const userId = await verifySession(sessionToken)
    if (!userId) return null

    const users = await sql`
      SELECT * FROM users WHERE id = ${userId} AND status = 'approved'
    `

    return (users[0] as User) || null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
