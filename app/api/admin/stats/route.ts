import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = "http://localhost:5000/admin/stats"

export async function GET() {
  try {
    const cookieStore = cookies()
    const jwt = cookieStore.get("jwt")?.value // Assumes JWT is stored in a cookie named 'jwt'

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
    console.error("Proxy error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
