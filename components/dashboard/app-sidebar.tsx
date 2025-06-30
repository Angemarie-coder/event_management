"use client"

import React from "react"
import { Users, Calendar, BookOpen, UserPlus, CheckCircle, Plus, LogOut, User, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"

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
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Icon mapping for dynamic navigation
const iconMap: Record<string, React.ElementType> = {
  CheckCircle,
  UserPlus,
  Calendar,
  Plus,
  BookOpen,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [navData, setNavData] = useState<any>(null);
  const [navError, setNavError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
        } else {
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/login');
            return;
          }
          const response = await api.get('/api/auth/profile');
          const userData = response.data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await api.get('http://localhost:5000/api/admins/navigation', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) setNavData(res.data);
        else {
          setNavError('Failed to load navigation: ' + res.status);
          console.error('Navigation fetch error:', res);
        }
      } catch (e: any) {
        setNavError('Failed to load navigation: ' + (e?.message || 'Unknown error'));
        console.error('Failed to fetch navigation', e);
      }
    };
    if (user) fetchNav();
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log('Sidebar user:', user);
    }
  }, [user]);

  useEffect(() => {
    if (navData) {
      console.log('Sidebar navData:', navData);
    }
  }, [navData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          </div>
        </SidebarHeader>
      </Sidebar>
    );
  }

  if (!navData) {
    return null;
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard/super-admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-700 text-white">
                  <Users className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-gray-700">
                    {user.role === 'super-admin' ? 'Super Admin' : 
                     user.role === 'admin' ? 'Admin' : 'User'} Dashboard
                  </span>
                  <span className="truncate text-xs text-gray-500">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navData.adminManagement && navData.adminManagement.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-700">Manage Admins</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navData.adminManagement.map((item: any) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="text-gray-600 hover:text-gray-700">
                        {iconMap[item.icon] && React.createElement(iconMap[item.icon])}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {navData.eventManagement && navData.eventManagement.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-700">Manage Events</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navData.eventManagement.map((item: any) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="text-gray-600 hover:text-gray-700">
                        {iconMap[item.icon] && React.createElement(iconMap[item.icon])}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {navData.bookings && navData.bookings.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-700">Bookings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navData.bookings.map((item: any) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="text-gray-600 hover:text-gray-700">
                        {iconMap[item.icon] && React.createElement(iconMap[item.icon])}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user.role === 'super-admin' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-700">Profile</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard/super-admin/profile" className="text-gray-600 hover:text-gray-700">
                      <User className="mr-2 h-4 w-4" />
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
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-gray-100 data-[state=open]:text-gray-700">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-gray-700 text-white">
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
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="text-gray-700">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-700">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleLogout}>
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
