"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"

import { 
  Users, Calendar, BookOpen, UserPlus, CheckCircle, Plus, LogOut, User, Settings 
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// User interface type
interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

// Icon mapping for dynamic navigation
const iconMap: Record<string, React.ElementType> = {
  CheckCircle,
  UserPlus,
  Calendar,
  Plus,
  BookOpen,
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [navData, setNavData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setLoading(false)
        } else {
          const token = localStorage.getItem("token")
          if (!token) {
            router.push("/login")
            return
          }
          const response = await api.get("/api/auth/profile")
          const userData = response.data
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
          setLoading(false)
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error)
        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          router.push("/login")
        }
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await api.get("http://localhost:5000/api/admins/navigation", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status === 200) {
          setNavData(res.data)
        } else {
          console.error("Navigation fetch error:", res)
        }
      } catch (e) {
        console.error("Failed to fetch navigation", e)
      }
    }

    if (user) fetchNav()
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading || !user) {
    return (
      <Sidebar className="bg-[#3d3269] text-white w-64 min-h-screen" {...props}>
        <SidebarHeader>
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          </div>
        </SidebarHeader>
      </Sidebar>
    )
  }

  if (!navData) return null

  return (
    <Sidebar className="bg-gray-700 text-white w-64 min-h-screen" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href={
                  user.role === "super-admin"
                    ? "/dashboard/super-admin"
                    : user.role === "admin"
                    ? "/dashboard/admins"
                    : "/dashboard"
                }
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-gray-800">
                  <Users className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">
                    {user.role === "super-admin"
                      ? "Super Admin"
                      : user.role === "admin"
                      ? "Admin"
                      : "User"}{" "}
                    Dashboard
                  </span>
                  <span className="truncate text-xs text-gray-300">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {["adminManagement", "eventManagement", "bookings"].map((section) => (
          navData[section]?.length > 0 && (
            <SidebarGroup key={section}>
              <SidebarGroupLabel className="text-gray-200">
                {section === "adminManagement" ? "Manage Admins" :
                 section === "eventManagement" ? "Manage Events" : "Bookings"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navData[section].map((item: any) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#4e3e8c] transition"
                        >
                          {iconMap[item.icon] && React.createElement(iconMap[item.icon])}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        ))}

        {user.role === "super-admin" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-200">Profile</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="/dashboard/super-admin/profile"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#4e3e8c] transition"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gray-700 text-white rounded-lg">
                      {(typeof user.name === "string" && user.name.trim()
                        ? user.name.split(" ").map((n) => n[0]).join("")
                        : "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-gray-700">{user.name}</span>
                    <span className="truncate text-xs text-gray-500">{user.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-56" side="bottom" align="end" sideOffset={4}>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
