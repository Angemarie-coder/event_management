"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Check, X, Mail, Calendar } from "lucide-react"
import type { User } from "@/lib/db"

interface UserManagementProps {
  onStatsUpdate: () => void
}

export default function UserManagement({ onStatsUpdate }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterStatus])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => user.status === filterStatus)
    }

    setFilteredUsers(filtered)
  }

  const updateUserStatus = async (userId: number, status: "approved" | "rejected") => {
    setActionLoading(userId)
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status }),
      })

      if (response.ok) {
        setMessage(`User ${status} successfully`)
        fetchUsers()
        onStatsUpdate()
        setTimeout(() => setMessage(""), 3000)
      } else {
        const data = await response.json()
        setMessage(data.error || "Failed to update user")
      }
    } catch (error) {
      setMessage("An error occurred")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      case "user":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts, approve registrations, and monitor user activity</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status as any)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>{user.role.replace("_", " ").toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={actionLoading === user.id}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => updateUserStatus(user.id, "approved")}
                                  className="text-green-600"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateUserStatus(user.id, "rejected")}
                                  className="text-red-600"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {user.status === "rejected" && (
                              <DropdownMenuItem
                                onClick={() => updateUserStatus(user.id, "approved")}
                                className="text-green-600"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
