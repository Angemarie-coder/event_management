"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Crown, ArrowRight } from "lucide-react"

export default function TestSuperAdminPage() {
  const [loginResult, setLoginResult] = useState<{
    success: boolean
    error?: string
    userInfo?: any
  } | null>(null)
  const [testing, setTesting] = useState(false)
  const router = useRouter()

  const testSuperAdminLogin = async () => {
    setTesting(true)
    setLoginResult(null)

    try {
      // First logout any existing session
      await fetch("/api/auth/logout", { method: "POST" })

      // Test super admin login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "superadmin@eventmanager.com",
          password: "password123",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setLoginResult({
          success: true,
          userInfo: data.user,
        })
      } else {
        setLoginResult({
          success: false,
          error: data.error,
        })
      }
    } catch (error) {
      setLoginResult({
        success: false,
        error: "Network error occurred",
      })
    } finally {
      setTesting(false)
    }
  }

  const goToDashboard = () => {
    router.push("/dashboard")
  }

  const goToLoginPage = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Login Test</h1>
          <p className="mt-2 text-gray-600">Test the super admin account and access the dashboard</p>
        </div>

        {/* Login Test Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2 text-purple-600" />
              Super Admin Account Test
            </CardTitle>
            <CardDescription>
              This will test login with the super admin account and verify access to the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Super Admin Credentials:</h3>
              <div className="text-sm text-purple-800">
                <p>
                  <strong>Email:</strong> superadmin@eventmanager.com
                </p>
                <p>
                  <strong>Password:</strong> password123
                </p>
                <p>
                  <strong>Role:</strong> Super Administrator
                </p>
              </div>
            </div>

            <Button
              onClick={testSuperAdminLogin}
              disabled={testing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {testing ? "Testing Login..." : "Test Super Admin Login"}
            </Button>

            {loginResult && (
              <div className="mt-4">
                {loginResult.success ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="space-y-2">
                        <p>
                          <strong>✅ Login Successful!</strong>
                        </p>
                        <p>
                          Logged in as:{" "}
                          <strong>
                            {loginResult.userInfo.firstName} {loginResult.userInfo.lastName}
                          </strong>
                        </p>
                        <p>
                          Role: <strong>{loginResult.userInfo.role.replace("_", " ").toUpperCase()}</strong>
                        </p>
                        <p>
                          Email: <strong>{loginResult.userInfo.email}</strong>
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>❌ Login Failed:</strong> {loginResult.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dashboard Access */}
        {loginResult?.success && (
          <Card className="mb-8 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">🎉 Ready to Access Dashboard!</CardTitle>
              <CardDescription>
                Your super admin login was successful. You can now access the full dashboard with all management
                features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Dashboard Features Available:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• User Management & Approval</li>
                    <li>• Admin Creation & Management</li>
                    <li>• Event Management</li>
                    <li>• Booking Management</li>
                    <li>• System Analytics</li>
                    <li>• Real-time Statistics</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Super Admin Capabilities:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Create new administrators</li>
                    <li>• Approve/reject all users</li>
                    <li>• View system-wide analytics</li>
                    <li>• Manage all events & bookings</li>
                    <li>• Full system control</li>
                    <li>• Email notifications</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={goToDashboard} className="flex-1 bg-green-600 hover:bg-green-700">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Go to Super Admin Dashboard
                </Button>
                <Button onClick={goToLoginPage} variant="outline" className="flex-1">
                  Go to Login Page
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>What to Test Next</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">User Management:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>1. View all registered users</li>
                  <li>2. Search and filter users</li>
                  <li>3. Approve/reject pending users</li>
                  <li>4. Check email notifications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Admin Management:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>1. Create new admin accounts</li>
                  <li>2. View existing administrators</li>
                  <li>3. Manage admin permissions</li>
                  <li>4. Test admin creation flow</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Analytics:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>1. View system statistics</li>
                  <li>2. Check user/booking charts</li>
                  <li>3. Monitor approval rates</li>
                  <li>4. Review monthly trends</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">System Management:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>1. Manage all events</li>
                  <li>2. Review all bookings</li>
                  <li>3. Monitor system health</li>
                  <li>4. Test all features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
