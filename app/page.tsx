import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Event Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive event management system with role-based access control, 
            event creation, booking management, and admin approval workflows.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="px-8">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="px-8">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 