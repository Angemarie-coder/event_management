"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Users,
  Activity,
  Settings,
  Eye,
  UserCheck,
  UserX,
  Download,
  Upload,
} from "lucide-react"

// Mock data for admins
const mockAdmins = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2024-01-15 10:30 AM",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["all"],
    createdAt: "2023-06-15",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-14 2:15 PM",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["bookings", "events", "users"],
    createdAt: "2023-08-20",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Moderator",
    status: "Inactive",
    lastLogin: "2024-01-10 9:45 AM",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["events"],
    createdAt: "2023-09-10",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-15 8:20 AM",
    avatar: "/placeholder.svg?height=40&width=40",
    permissions: ["bookings", "users"],
    createdAt: "2023-11-05",
  },
]

const mockActivityLogs = [
  {
    id: 1,
    admin: "John Doe",
    action: "Created new admin account",
    target: "Sarah Wilson",
    timestamp: "2024-01-15 10:30 AM",
    ip: "192.168.1.1",
  },
  {
    id: 2,
    admin: "Sarah Wilson",
    action: "Updated booking settings",
    target: "Booking #1234",
    timestamp: "2024-01-14 2:15 PM",
    ip: "192.168.1.2",
  },
  {
    id: 3,
    admin: "Mike Johnson",
    action: "Deleted event",
    target: "Summer Festival",
    timestamp: "2024-01-10 9:45 AM",
    ip: "192.168.1.3",
  },
]

const roles = ["Super Admin", "Admin", "Moderator", "Viewer"]
const permissions = [
  { id: "bookings", label: "Booking Management" },
  { id: "events", label: "Event Management" },
  { id: "users", label: "User Management" },
  { id: "admins", label: "Admin Management" },
  { id: "settings", label: "System Settings" },
  { id: "reports", label: "Reports & Analytics" },
]

export default function AdminManagement() {
  const [admins, setAdmins] = useState(mockAdmins)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<any>(null)

  // Form state for add/edit admin
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    permissions: [] as string[],
    status: "Active",
    sendWelcomeEmail: true,
  })

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || admin.role === selectedRole
    const matchesStatus = selectedStatus === "all" || admin.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSelectAdmin = (adminId: number) => {
    setSelectedAdmins((prev) => (prev.includes(adminId) ? prev.filter((id) => id !== adminId) : [...prev, adminId]))
  }

  const handleSelectAll = () => {
    setSelectedAdmins(selectedAdmins.length === filteredAdmins.length ? [] : filteredAdmins.map((admin) => admin.id))
  }

  const handleAddAdmin = () => {
    const newAdmin = {
      id: Date.now(),
      ...formData,
      lastLogin: "Never",
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setAdmins([...admins, newAdmin])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditAdmin = () => {
    setAdmins(admins.map((admin) => (admin.id === editingAdmin.id ? { ...admin, ...formData } : admin)))
    setEditingAdmin(null)
    resetForm()
  }

  const handleDeleteAdmin = (adminId: number) => {
    setAdmins(admins.filter((admin) => admin.id !== adminId))
    setSelectedAdmins(selectedAdmins.filter((id) => id !== adminId))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      permissions: [],
      status: "Active",
      sendWelcomeEmail: true,
    })
  }

  const openEditDialog = (admin: any) => {
    setEditingAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      status: admin.status,
      sendWelcomeEmail: false,
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-red-100 text-red-800"
      case "Admin":
        return "bg-blue-100 text-blue-800"
      case "Moderator":
        return "bg-green-100 text-green-800"
      case "Viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground">Manage admin users, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>Create a new admin account with specific roles and permissions.</DialogDescription>
              </DialogHeader>
              <AdminForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleAddAdmin}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.filter((admin) => admin.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((admins.filter((admin) => admin.status === "Active").length / admins.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.filter((admin) => admin.role === "Super Admin").length}</div>
            <p className="text-xs text-muted-foreground">Highest privilege level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Actions in last 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="admins" className="space-y-4">
        <TabsList>
          <TabsTrigger value="admins">Admin Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-1 gap-4 items-center">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search admins..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedAdmins.length > 0 && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <UserX className="h-4 w-4 mr-2" />
                      Deactivate ({selectedAdmins.length})
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedAdmins.length})
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedAdmins.length === filteredAdmins.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAdmins.includes(admin.id)}
                          onCheckedChange={() => handleSelectAdmin(admin.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={admin.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {admin.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{admin.name}</div>
                            <div className="text-sm text-muted-foreground">{admin.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(admin.role)}>{admin.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(admin.status)}>{admin.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{admin.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {admin.permissions.slice(0, 2).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission === "all" ? "All" : permission}
                            </Badge>
                          ))}
                          {admin.permissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{admin.permissions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(admin)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <UserX className="mr-2 h-4 w-4" />
                              {admin.status === "Active" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteAdmin(admin.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RolesPermissions />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityLogs logs={mockActivityLogs} />
        </TabsContent>
      </Tabs>

      {/* Edit Admin Dialog */}
      {editingAdmin && (
        <Dialog open={!!editingAdmin} onOpenChange={() => setEditingAdmin(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Admin</DialogTitle>
              <DialogDescription>Update admin account details, roles, and permissions.</DialogDescription>
            </DialogHeader>
            <AdminForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleEditAdmin}
              onCancel={() => setEditingAdmin(null)}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Admin Form Component
function AdminForm({ formData, setFormData, onSubmit, onCancel, isEditing = false }: any) {
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter((p: string) => p !== permissionId),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Permissions</Label>
        <div className="grid grid-cols-2 gap-3">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={permission.id}
                checked={formData.permissions.includes(permission.id)}
                onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
              />
              <Label htmlFor={permission.id} className="text-sm font-normal">
                {permission.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {!isEditing && (
        <div className="flex items-center space-x-2">
          <Switch
            id="welcome-email"
            checked={formData.sendWelcomeEmail}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, sendWelcomeEmail: checked }))}
          />
          <Label htmlFor="welcome-email">Send welcome email</Label>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>{isEditing ? "Update Admin" : "Create Admin"}</Button>
      </div>
    </div>
  )
}

// Roles & Permissions Component
function RolesPermissions() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Configure roles and their associated permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {roles.map((role) => (
            <div key={role} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{role}</h3>
                  <p className="text-sm text-muted-foreground">
                    {role === "Super Admin" && "Full system access with all permissions"}
                    {role === "Admin" && "Administrative access with most permissions"}
                    {role === "Moderator" && "Limited administrative access"}
                    {role === "Viewer" && "Read-only access to system data"}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${role}-${permission.id}`}
                      defaultChecked={
                        role === "Super Admin" ||
                        (role === "Admin" && permission.id !== "admins") ||
                        (role === "Moderator" && ["events", "bookings"].includes(permission.id)) ||
                        (role === "Viewer" && permission.id === "reports")
                      }
                    />
                    <Label htmlFor={`${role}-${permission.id}`} className="text-sm">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// Activity Logs Component
function ActivityLogs({ logs }: { logs: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Activity Logs</CardTitle>
        <CardDescription>Track all administrative actions and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.admin}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.target}</TableCell>
                <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                <TableCell className="text-muted-foreground">{log.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
