import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = "http://localhost:5000/auth/login"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (res.ok && data.token) {
      // Store JWT in cookie
      const cookieStore = cookies()
      cookieStore.set("jwt", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
