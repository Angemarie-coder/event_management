"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

interface TestResult {
  account: string
  email: string
  success: boolean
  error?: string
  userInfo?: any
}

export default function TestLoginPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const testAccounts = [
    { role: "user", email: "user@eventmanager.com", password: "password123" },
    { role: "admin", email: "admin@eventmanager.com", password: "password123" },
    { role: "super_admin", email: "superadmin@eventmanager.com", password: "password123" },
  ]

  const testLogin = async (account: (typeof testAccounts)[0]) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Logout immediately after successful login test
        await fetch("/api/auth/logout", { method: "POST" })

        return {
          account: account.role,
          email: account.email,
          success: true,
          userInfo: data.user,
        }
      } else {
        return {
          account: account.role,
          email: account.email,
          success: false,
          error: data.error,
        }
      }
    } catch (error) {
      return {
        account: account.role,
        email: account.email,
        success: false,
        error: "Network error",
      }
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    setResults([])

    for (const account of testAccounts) {
      const result = await testLogin(account)
      setResults((prev) => [...prev, result])
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setTesting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Login Authentication Test</h1>
          <p className="mt-2 text-gray-600">Testing all default accounts</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Default Accounts</CardTitle>
            <CardDescription>This will test login functionality for all three default accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runAllTests} disabled={testing} className="w-full">
              {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {testing ? "Testing..." : "Run Login Tests"}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium capitalize">{result.account.replace("_", " ")} Account</h3>
                      <p className="text-sm text-gray-600">{result.email}</p>
                      {result.userInfo && (
                        <p className="text-xs text-gray-500 mt-1">
                          Logged in as: {result.userInfo.firstName} {result.userInfo.lastName} ({result.userInfo.role})
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      {result.success ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">Success</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">Failed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {result.error && (
                    <Alert variant="destructive" className="mt-3">
                      <AlertDescription>{result.error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {results.length > 0 && !testing && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span>{results.filter((r) => r.success).length} Passed</span>
              </div>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                <span>{results.filter((r) => !r.success).length} Failed</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">After testing, you can try the actual login page:</p>
          <Button variant="outline" asChild>
            <a href="/login">Go to Login Page</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
