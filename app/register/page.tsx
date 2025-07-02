"use client";
import RegisterForm from "@/components/auth/register-form"
import Image from "next/image"
import { Calendar } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-red-100 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="w-full max-w-md mx-auto animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          {/* Logo or Icon */}
          <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-full p-4 mb-4 shadow-lg">
            {/* Use your logo if available, else fallback to icon */}
            <Image src="/placeholder-logo.png" alt="Logo" width={48} height={48} className="rounded-full" />
            {/* <Calendar className="h-8 w-8 text-white" /> */}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Event Manager</h1>
        </div>
        <RegisterForm />
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
