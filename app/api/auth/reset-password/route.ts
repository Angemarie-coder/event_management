import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "http://localhost:5000/auth/reset-password"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy error for reset-password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 