export default function SuperAdminDashboardHome() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-700">Welcome to the Super Admin Dashboard</h1>
      <p className="text-gray-500 text-gray-700">
        Here you can manage admins, events, and bookings. Use the sidebar to navigate between different sections.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-blue-600 text-gray-700 font-bold mb-2">Admins</span>
          <p className="text-gray-600 text-center mb-4">Approve or reject new admin requests and add new admins to the system.</p>
          <a href="/dashboard/super-admin/admins" className="text-gray-700 font-semibold hover:underline">Go to Admin Management</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-gray-600 text-gray-700 font-bold mb-2">Events</span>
          <p className="text-gray-600 text-center mb-4">View all events or add new events for users to book and attend.</p>
          <a href="/dashboard/super-admin/events" className="text-gray-700 font-semibold hover:underline">Go to Event Management</a>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-gary-600 text-2xl font-bold mb-2">Bookings</span>
          <p className="text-gray-600 text-center mb-4">Manage and approve/reject event bookings made by users.</p>
          <a href="/dashboard/super-admin/bookings" className="text-gray-700 font-semibold hover:underline">Go to Booking Management</a>
        </div>
      </div>
    </div>
  );
} 