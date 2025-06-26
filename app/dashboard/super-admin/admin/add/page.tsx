"use client"

import type React from "react"

import { useState } from "react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Mail, Lock, User, Shield, CheckCircle, AlertCircle } from "lucide-react"

export default function AddAdminPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRoleChange = (value: string) => {
    setForm({ ...form, role: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      await api.post("http://localhost:5000/api/auth/register", form)
      setSuccess("Admin added successfully! Pending approval.")
      setForm({ name: "", email: "", password: "", role: "admin" })
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add admin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: "linear-gradient(135deg, #ea6089, #f472b6)" }}
          >
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Admin</h1>
          <p className="text-gray-600">Create a new administrator account for the system</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader
            className="text-white rounded-t-lg"
            style={{ background: "linear-gradient(135deg, #ea6089, #f472b6)" }}
          >
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administrator Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {/* Success Alert */}
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" style={{ color: "#ea6089" }} />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter full name"
                  className="h-12 border-gray-200 transition-colors focus:border-[#ea6089] focus:ring-[#ea6089]"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" style={{ color: "#ea6089" }} />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter email address"
                  className="h-12 border-gray-200 transition-colors focus:border-[#ea6089] focus:ring-[#ea6089]"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4" style={{ color: "#ea6089" }} />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter secure password"
                  className="h-12 border-gray-200 transition-colors focus:border-[#ea6089] focus:ring-[#ea6089]"
                />
                <p className="text-xs text-gray-500">Password should be at least 8 characters long</p>
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="h-4 w-4" style={{ color: "#ea6089" }} />
                  Role
                </Label>
                <Select value={form.role} onValueChange={handleRoleChange} disabled={loading}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-[#ea6089] focus:ring-[#ea6089]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="super-admin">Super Administrator</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #ea6089, #f472b6)",
                    ":hover": { background: "linear-gradient(135deg, #d946a0, #ea6089)" },
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding Admin...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Add Administrator
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Info Box */}
            <div className="mt-8 p-4 rounded-lg border" style={{ backgroundColor: "#fdf2f8", borderColor: "#f9a8d4" }}>
              <div className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#ea6089" }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="text-sm" style={{ color: "#831843" }}>
                  <p className="font-medium mb-1">Important Note:</p>
                  <p>
                    New admin accounts require approval from a Super Administrator before they can access the system.
                    The admin will receive an email notification once their account is approved.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => window.history.back()}
          >
            ← Back to Admin Management
          </Button>
        </div>
      </div>
    </div>
  )
}
