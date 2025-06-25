import Link from "next/link";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-6 gap-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Super Admin</h2>
        <nav className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 mb-2">Manage Admins</span>
          <Link href="/dashboard/super-admin/admins" className="hover:bg-blue-50 rounded px-3 py-2">Approve/Reject Admins</Link>
          <Link href="/dashboard/super-admin/admins/add" className="hover:bg-blue-50 rounded px-3 py-2">Add Admin</Link>
          <span className="text-xs font-semibold text-gray-500 mt-6 mb-2">Manage Events</span>
          <Link href="/dashboard/super-admin/events" className="hover:bg-blue-50 rounded px-3 py-2">View Events</Link>
          <Link href="/dashboard/super-admin/events/add" className="hover:bg-blue-50 rounded px-3 py-2">Add Event</Link>
          <span className="text-xs font-semibold text-gray-500 mt-6 mb-2">Bookings</span>
          <Link href="/dashboard/super-admin/bookings" className="hover:bg-blue-50 rounded px-3 py-2">Manage Bookings</Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
} 