import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import UserDashboard from "@/components/dashboard/user-dashboard"
// import AdminDashboard from "@/components/dashboard/admin-dashboard"
import SuperAdminDashboard from "@/components/dashboard/super-admin-dashboard"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === "user" && <UserDashboard user={user} />}
      {/* {user.role === "admin" && <AdminDashboard user={user} />} */}
      {user.role === "super_admin" && <SuperAdminDashboard user={user} />}
    </div>
  )
}
