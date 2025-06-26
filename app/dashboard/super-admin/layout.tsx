import type React from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
