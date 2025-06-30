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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-2 py-8">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gray-200 shadow-lg rounded-full p-4 mb-4">
            <UserPlus className="h-10 w-10 text-gray-900 drop-shadow" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">Add Admin</h1>
          <p className="text-base text-gray-500">Create a new administrator account for the system</p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl shadow-2xl bg-white/70 backdrop-blur-md border border-gray-200">
          <div className="rounded-t-3xl px-8 py-5 bg-white flex items-center gap-3 border-b border-gray-100">
            <Shield className="h-6 w-6 text-gray-900" />
            <span className="text-lg font-semibold text-gray-900 tracking-wide">Admin Details</span>
          </div>
          <div className="px-8 py-8">
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
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-900" />
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
                  className="h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-200 bg-white/80"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-900" />
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
                  className="h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-200 bg-white/80"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-900" />
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
                  className="h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-200 bg-white/80"
                />
                <p className="text-xs text-gray-400 ml-1">Password should be at least 8 characters long</p>
              </div>

              {/* Role Field */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-900" />
                  Role
                </Label>
                <Select value={form.role} onValueChange={handleRoleChange} disabled={loading}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-200 bg-white/80">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="super-admin">Super Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.03] bg-gray-900 focus:ring-2 focus:ring-gray-200 focus:outline-none"
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
                      Add Admin
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-6 py-2"
            onClick={() => window.history.back()}
          >
            ← Back
          </Button>
        </div>
      </div>
    </div>
  )
}
