"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Search, Check, X, Clock, RefreshCw, Users } from "lucide-react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"

interface Admin {
  id: number
  email: string
  password: string
  name: string
  role: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
}

const getAuthToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("authToken")
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const { toast } = useToast()
  const [rejectedCount, setRejectedCount] = useState(0)

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token found. Please login again.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("http://localhost:5000/api/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          })
          return
        }
        throw new Error("Failed to fetch admins")
      }

      const data = await response.json()
      setAdmins(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch admin registrations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRejectAdmin = async (adminId: number) => {
    try {
      setActionLoading(adminId)
      const token = getAuthToken()
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token found. Please login again.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`http://localhost:5000/api/admins/${adminId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        toast({
          title: "Error",
          description: `Failed to reject admin`,
          variant: "destructive",
        })
        return
      }

      setAdmins((prev) => prev.filter((admin) => admin.id !== adminId))
      setRejectedCount((prev) => prev + 1)

      toast({
        title: "Success",
        description: "Admin registration rejected",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject admin registration",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleAcceptAdmin = async (adminId: number) => {
    try {
      setActionLoading(adminId)
      const token = getAuthToken()
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token found. Please login again.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`http://localhost:5000/api/admins/${adminId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        toast({
          title: "Error",
          description: `Failed to approve admin`,
          variant: "destructive",
        })
        return
      }

      setAdmins((prev) =>
        prev.map((admin) => (admin.id === adminId ? { ...admin, isApproved: true } : admin))
      )

      toast({
        title: "Success",
        description: "Admin registration approved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve admin registration",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const filteredAdmins = admins.filter((admin) => {
    const searchLower = searchTerm.toLowerCase()
    return admin.name.toLowerCase().includes(searchLower) || admin.email.toLowerCase().includes(searchLower)
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const totalCount = admins.length + rejectedCount
  const pendingCount = admins.filter((admin) => !admin.isApproved).length
  const approvedCount = admins.filter((admin) => admin.isApproved).length

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-[#f4f4fa] p-4 pl-8 overflow-y-auto flex flex-col">
        <div className="w-full max-w-6xl mx-auto">
          {/* Place your search bar, stats cards, table here */}
          {/* ... Your original UI code ... */}
        </div>
      </main>
    </div>
  )
}
