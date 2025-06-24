import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = "http://localhost:5000/auth/profile"

export async function GET() {
  try {
    const cookieStore = cookies()
    const jwt = cookieStore.get("jwt")?.value

    const res = await fetch(BACKEND_URL, {
      method: "GET",
      headers: {
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        "Content-Type": "application/json",
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 