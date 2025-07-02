"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, LogOut, User } from "lucide-react"
import type { User as UserType } from "@/lib/db"

interface DashboardHeaderProps {
  user: UserType
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin"
      case "admin":
        return "Admin"
      default:
        return "User"
    }
  }

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-[#3d3269]" />
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-[#3d3269]">Event Manager</h1>
              <p className="text-sm text-gray-500">{getRoleDisplay(user.role)} Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-10 w-10 border-2 border-[#3d3269]" />
              <span className="font-semibold text-[#3d3269] text-sm hidden sm:inline">{user.first_name} {user.last_name}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <span className="sr-only">Open user menu</span>
                  <Avatar className="h-10 w-10">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.first_name + ' ' + user.last_name} />
                    ) : (
                      <AvatarFallback>
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
