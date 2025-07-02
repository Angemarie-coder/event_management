"use client";
import LoginForm from "@/components/auth/login-form"
import Image from "next/image"
import { Calendar } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      <div className="w-full max-w-md mx-auto animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Event Manager</h1>
          <p className="mt-2 text-gray-600">Welcome back</p>
        </div>
        <LoginForm />
      </div>
      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </div>
  )
}
