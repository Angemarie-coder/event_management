"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
  Calendar,
  Users,
  MapPin,
  UserCheck,
  User,
  LogOut,
  Menu,
  CalendarDays,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState("my-events")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // You can set this based on user role from your auth system
  const userRole = "admin" // or "super_admin"

  const navigation = [
    { id: "my-events", name: "My Events", icon: CalendarDays },
    { id: "add-event", name: "Add Event", icon: Calendar },
    { id: "booked-places", name: "Booked Places & Users", icon: MapPin },
    { id: "approve-bookings", name: "Approve/Reject Bookings", icon: UserCheck },
    // Only show for super admins
    
  ]

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...")
    // Example: router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden mr-3" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Event Manager</h1>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@eventmanager.com</p>
                 
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Left Sidebar */}
      <div
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="h-full overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-[#ce5479]/10 text-[#ce5479] border-r-2 border-[#ce5479]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="pt-16 lg:pl-64">
        <main className="p-6">
          {activeTab === "my-events" && <MyEventsSection setActiveTab={setActiveTab} />}
          {activeTab === "add-event" && <AddEventSection />}
          {activeTab === "booked-places" && <BookedPlacesSection />}
          {activeTab === "approve-bookings" && <ApproveBookingsSection />}
         
          {activeTab === "profile" && <ProfileSection />}
          {activeTab.startsWith("attendees-") && (
            <EventAttendeesSection eventId={activeTab.split("-")[1]} onBack={() => setActiveTab("my-events")} />
          )}
        </main>
      </div>
    </div>
  )
}

// My Events Section - NEW
function MyEventsSection({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const myEvents = [
    {
      id: 1,
      name: "Tech Conference 2024",
      description: "Annual technology conference featuring latest innovations",
      date: "2024-07-15",
      time: "09:00",
      location: "Convention Center",
      totalSeats: 500,
      bookedSeats: 342,
      status: "active",
    },
    {
      id: 2,
      name: "Music Festival",
      description: "Summer music festival with multiple artists",
      date: "2024-08-20",
      time: "18:00",
      location: "City Park",
      totalSeats: 1000,
      bookedSeats: 756,
      status: "active",
    },
    {
      id: 3,
      name: "Art Exhibition",
      description: "Contemporary art exhibition",
      date: "2024-06-10",
      time: "10:00",
      location: "Art Gallery",
      totalSeats: 200,
      bookedSeats: 200,
      status: "completed",
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        
      </div>

      <div className="grid gap-6">
        {myEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      event.status === "active"
                        ? "bg-green-100 text-green-800"
                        : event.status === "completed"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{event.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium">{event.date}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <p className="font-medium">{event.time}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <p className="font-medium">{event.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Bookings:</span>
                    <p className="font-medium">
                      {event.bookedSeats}/{event.totalSeats}
                      <span className="text-[#ce5479] ml-1">
                        ({Math.round((event.bookedSeats / event.totalSeats) * 100)}%)
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => setActiveTab(`attendees-${event.id}`)}>
                  <Users className="h-4 w-4 mr-1" />
                  View Attendees ({event.bookedSeats})
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Add Event Section
function AddEventSection() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Event</h1>
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Event Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479] focus:border-transparent transition-all"
              placeholder="Enter event name"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479] focus:border-transparent transition-all resize-none"
              placeholder="Enter event description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479] focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Time</label>
              <input
                type="time"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479] focus:border-transparent transition-all"
              placeholder="Enter event location"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Available Seats</label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479] focus:border-transparent transition-all"
              placeholder="Enter number of available seats"
            />
          </div>
          <Button className="w-full bg-[#ce5479] hover:bg-[#ce5479]/90 text-white py-3 rounded-lg font-semibold transition-all">
            Create Event
          </Button>
        </form>
      </div>
    </div>
  )
}

// Booked Places Section
function BookedPlacesSection() {
  const bookings = [
    {
      id: 1,
      eventName: "Tech Conference 2024",
      userName: "John Doe",
      email: "john@example.com",
      seats: 2,
      status: "confirmed",
    },
    {
      id: 2,
      eventName: "Music Festival",
      userName: "Jane Smith",
      email: "jane@example.com",
      seats: 1,
      status: "pending",
    },
    {
      id: 3,
      eventName: "Art Exhibition",
      userName: "Bob Johnson",
      email: "bob@example.com",
      seats: 3,
      status: "confirmed",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Booked Places & Users</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.eventName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.userName}</div>
                  <div className="text-sm text-gray-500">{booking.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.seats}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Approve Bookings Section
function ApproveBookingsSection() {
  const pendingBookings = [
    { id: 1, eventName: "Tech Conference 2024", userName: "Alice Brown", email: "alice@example.com", seats: 2 },
    { id: 2, eventName: "Music Festival", userName: "Charlie Wilson", email: "charlie@example.com", seats: 1 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Approve/Reject Bookings</h1>
      <div className="space-y-4">
        {pendingBookings.length === 0 ? (
          <div className="text-gray-500 text-center py-12 bg-white rounded-xl">No pending bookings to review.</div>
        ) : (
          pendingBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-lg text-gray-900">{booking.eventName}</div>
                <div className="text-gray-600 mt-1">
                  {booking.userName} - {booking.email}
                </div>
                <div className="text-sm text-gray-500 mt-1">{booking.seats} seat(s) requested</div>
              </div>
              <div className="flex gap-3">
                <Button className="bg-[#ce5479] hover:bg-[#ce5479]/90 text-white px-6">Approve</Button>
                <Button variant="destructive" className="px-6">
                  Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Manage Admins Section - Only for Super Admins
function ManageAdminsSection() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Admins</h1>
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Super Admin Access:</strong> Only Super Admins can manage other admin accounts.
          </p>
        </div>
        <p className="text-gray-600">Super admin functionality for managing admin accounts.</p>
        {/* Your existing admin approval code can go here */}
      </div>
    </div>
  )
}

// Profile Section
function ProfileSection() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex items-center space-x-6 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Admin" />
            <AvatarFallback className="text-lg">AD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Admin User</h2>
            <p className="text-gray-600">admin@eventmanager.com</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              defaultValue="Admin User"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              defaultValue="admin@eventmanager.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479] focus:border-transparent transition-all"
            />
          </div>
          <Button className="bg-[#ce5479] hover:bg-[#ce5479]/90 text-white py-3 px-6 rounded-lg font-semibold transition-all">
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  )
}

function EventAttendeesSection({ eventId, onBack }: { eventId: string; onBack: () => void }) {
  // Replace this with actual data fetching logic based on eventId
  const attendees = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 3, name: "Alice Brown", email: "alice.brown@example.com" },
  ]

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>
      <h1 className="text-2xl font-bold mb-6">Event Attendees - Event ID: {eventId}</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendees.map((attendee) => (
              <tr key={attendee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{attendee.email}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
