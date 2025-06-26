import LoginForm from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left side - Login Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Event Manager</h1>
            <p className="mt-2 text-gray-600">Welcome back</p>
          </div>
          <LoginForm />
        </div>
      </div>

      {/* Right side - Cover Image */}
      <div className="hidden lg:block relative bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black/20" />
        <Image
          src="/event11.jpg?height=800&width=600"
          alt="Event management illustration"
          width={600}
          height={800}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">Manage Your Events</h2>
            <p className="text-xl opacity-90">Streamline your event planning and management with our powerful tools</p>
          </div>
        </div>
      </div>
    </div>
  )
}
