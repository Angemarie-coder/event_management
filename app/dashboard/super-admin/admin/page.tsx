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
      toast({
        title: "Error",
        description: "Failed to fetch admin registrations",
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
      toast({
        title: "Error",
        description: `Failed to reject admin registration: ${error.message}`,
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
      toast({
        title: "Error",
        description: `Failed to approve admin registration: ${error.message}`,
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Registrations</h1>
          <p className="text-muted-foreground">Review and manage admin registration requests</p>
        </div>
        <Button onClick={fetchAdmins} disabled={loading} className="bg-pink-700 text-white">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
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
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Admin Registration Requests</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading admin registrations...</span>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No admins found matching your search." : "No admin registrations found."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {admin.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{admin.name}</div>
                          <div className="text-sm text-muted-foreground">{admin.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{admin.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(admin.createdAt)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(admin.isApproved)} variant="outline">
                        {getStatusText(admin.isApproved)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {!admin.isApproved ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectAdmin(admin.id)}
                            disabled={actionLoading === admin.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptAdmin(admin.id)}
                            disabled={actionLoading === admin.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {actionLoading === admin.id ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 mr-1" />
                            )}
                            Accept
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm text-green-600 font-medium">✓ Approved</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
