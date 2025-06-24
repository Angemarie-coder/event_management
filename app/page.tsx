import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Shield, Mail } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Event Manager</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">Manage Events with Ease</h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive event management system with role-based access control, booking management, and automated
            email notifications.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="px-8 py-3">
                Start Managing Events
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600" />
                <CardTitle>Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Three user roles: Users, Admins, and Super Admins with different permissions and capabilities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-green-600" />
                <CardTitle>Event Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create, manage, and track events with seat availability, pricing, and booking status.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-purple-600" />
                <CardTitle>Approval System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Admin approval required for user registration and booking confirmations with automated workflows.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="h-10 w-10 text-orange-600" />
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automated email notifications for registration, approvals, bookings, and status updates.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Roles */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">User Roles & Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Regular User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• View available events</p>
                <p>• Book event tickets</p>
                <p>• View booking history</p>
                <p>• Receive email notifications</p>
                <p>• Manage profile</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• All user permissions</p>
                <p>• Create and manage events</p>
                <p>• View all bookings</p>
                <p>• Approve/reject bookings</p>
                <p>• Approve/reject user registrations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">Super Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• All admin permissions</p>
                <p>• Add new admins</p>
                <p>• Approve/reject admin requests</p>
                <p>• System-wide management</p>
                <p>• Full access control</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Event Manager. Built with Next.js, TypeScript, and PostgreSQL.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
