"use client"

import React, { useState } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <SidebarProvider>
      {/* Hamburger for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md bg-white shadow" aria-label="Open sidebar">
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 max-w-full">
            <SheetTitle className="sr-only">Sidebar Navigation</SheetTitle>
            <AppSidebar />
          </SheetContent>
        </Sheet>
      </div>
      {/* Sidebar always visible on desktop */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <div className="pt-16 lg:pl-64">
        <main className="p-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
