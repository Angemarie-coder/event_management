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

// Types based on your actual backend structure
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

  // Fetch admins from backend
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
      console.log("Backend data:", data)
      setAdmins(data)
    } catch (error) {
      console.error("Fetch error:", error)
      let errorMessage = "Failed to fetch admin registrations"
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as { message?: string }).message || errorMessage
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Reject admin registration
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

      console.log(`Attempting to reject admin with ID: ${adminId}`)

      const response = await fetch(`http://localhost:5000/api/admins/${adminId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log(`Response status: ${response.status}`)

      // Get response text to see what the server is returning
      const responseText = await response.text()
      console.log(`Response body:`, responseText)

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          })
          return
        }

        // Try to parse error message from response
        let errorMessage = "Failed to reject admin"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          errorMessage = responseText || errorMessage
        }

        toast({
          title: "Error",
          description: `Failed to reject admin: ${errorMessage}`,
          variant: "destructive",
        })
        return
      }

      // Remove from list and increment rejected count
      setAdmins((prev) => prev.filter((admin) => admin.id !== adminId))
      setRejectedCount((prev) => prev + 1)

      toast({
        title: "Success",
        description: "Admin registration rejected",
      })
    } catch (error) {
      console.error("Reject error:", error)
      let errorMessage = "Failed to reject admin registration"
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as { message?: string }).message || errorMessage
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Accept admin registration
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

      console.log(`Attempting to approve admin with ID: ${adminId}`)

      const response = await fetch(`http://localhost:5000/api/admins/${adminId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log(`Response status: ${response.status}`)
      console.log(`Response headers:`, response.headers)

      // Get response text to see what the server is returning
      const responseText = await response.text()
      console.log(`Response body:`, responseText)

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          })
          return
        }

        // Try to parse error message from response
        let errorMessage = "Failed to approve admin"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use the text as error message
          errorMessage = responseText || errorMessage
        }

        toast({
          title: "Error",
          description: `Failed to approve admin: ${errorMessage}`,
          variant: "destructive",
        })
        return
      }

      // Update local state
      setAdmins((prev) => prev.map((admin) => (admin.id === adminId ? { ...admin, isApproved: true } : admin)))

      toast({
        title: "Success",
        description: "Admin registration approved successfully",
      })
    } catch (error) {
      console.error("Approve error:", error)
      let errorMessage = "Failed to approve admin registration"
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as { message?: string }).message || errorMessage
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Filter admins based on search term
  const filteredAdmins = admins.filter((admin) => {
    const searchLower = searchTerm.toLowerCase()
    return admin.name.toLowerCase().includes(searchLower) || admin.email.toLowerCase().includes(searchLower)
  })

  // Get status based on isApproved field
  const getStatus = (isApproved: boolean) => {
    return isApproved ? "approved" : "pending"
  }

  // Get status badge color
  const getStatusColor = (isApproved: boolean) => {
    return isApproved
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200"
  }

  // Get status text
  const getStatusText = (isApproved: boolean) => {
    return isApproved ? "Approved" : "Pending"
  }

  // Format date properly
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid date"

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchAdmins()
  }, [])

  // Calculate stats
  const totalCount = admins.length + rejectedCount // Include rejected in total
  const pendingCount = admins.filter((admin) => !admin.isApproved).length
  const approvedCount = admins.filter((admin) => admin.isApproved).length
  // rejectedCount is now from state

  return (
    <div className="px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Registrations</h1>
          <p className="text-muted-foreground">Review and manage admin registration requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Admin List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="text-center py-8 text-gray-400 col-span-full">Loading admin registrations...</div>
        ) : filteredAdmins.length === 0 ? (
          <div className="text-center py-8 text-gray-400 col-span-full">
            {searchTerm ? "No admins found matching your search." : "No admin registrations found."}
          </div>
        ) : (
          filteredAdmins.map((admin) => (
            <Card key={admin.id} className="bg-white shadow-md rounded-xl">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-gray-700">{admin.name}</CardTitle>
                  <Badge className={getStatusColor(admin.isApproved)}>
                    {getStatusText(admin.isApproved)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={"/placeholder.svg"} alt={admin.name} />
                      <AvatarFallback>{admin.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      <strong>{admin.email}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">Role: {admin.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm">Registered: {formatDate(admin.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {admin.isApproved ? (
                    <span className="text-green-600 font-medium">✓ Approved</span>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="bg-white text-red-600 border-red-300 hover:bg-red-50"
                        disabled={actionLoading === admin.id}
                        onClick={() => handleRejectAdmin(admin.id)}
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={actionLoading === admin.id}
                        onClick={() => handleAcceptAdmin(admin.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Accept
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
