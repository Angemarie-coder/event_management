"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
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
  const router = useRouter()

  const userRole = "admin"

  const navigation = [
    { id: "my-events", name: "My Events", icon: CalendarDays },
    { id: "add-event", name: "Add Event", icon: Calendar },
    { id: "booked-places", name: "Booked Places & Users", icon: MapPin },
    { id: "approve-bookings", name: "Approve/Reject Bookings", icon: UserCheck },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                <DropdownMenuItem onClick={() => setActiveTab("profile")}> <User className="mr-2 h-4 w-4" /><span>Profile</span> </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}> <LogOut className="mr-2 h-4 w-4" /><span>Log out</span> </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

    <div className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}> 
    <nav className="h-full overflow-y-auto py-6 px-3">
  <div className="space-y-1">
    {navigation.map((item) => {
      const Icon = item.icon;
      return (
        <button
          key={item.id}
          onClick={() => {
            setActiveTab(item.id);
            setSidebarOpen(false);
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
      );
    })}
  </div>
</nav>
</div>
      <div className="pt-16 lg:pl-64">
        <main className="p-6">
          {activeTab === "my-events" && <MyEventsSection setActiveTab={setActiveTab} />}
          {activeTab === "add-event" && <AddEventSection />}
          {activeTab === "booked-places" && <BookedPlacesSection />}
          {activeTab === "approve-bookings" && <ApproveBookingsSection />}
          {activeTab === "profile" && <ProfileSection />}
          {activeTab.startsWith("attendees-") && <EventAttendeesSection eventId={activeTab.split("-")[1]} onBack={() => setActiveTab("my-events")} />}
        </main>
      </div>
    </div>
  )
}

function MyEventsSection({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [events, setEvents] = useState<any[]>([])
  useEffect(() => {
    const token = localStorage.getItem("token")
    axios.get("http://localhost:5000/api/events", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to fetch events", err))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Events</h1>
      <div className="grid gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white border rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-500">{event.description}</p>
                <p className="text-sm mt-1">📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.location}</p>
              </div>
              <Button onClick={() => setActiveTab(`attendees-${event.id}`)}>View Attendees</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AddEventSection() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    totalSeats: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    try {
      setLoading(true)
      await axios.post("http://localhost:5000/api/events", {
        ...form,
        totalSeats: Number(form.totalSeats)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert("Event created successfully!")
      setForm({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        totalSeats: ""
      })
    } catch (error) {
      console.error("Error creating event", error)
      alert("Failed to create event.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Event</h1>
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Event Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ce5479]"
              placeholder="Enter event title"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ce5479]"
              placeholder="Event details"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ce5479]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ce5479]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ce5479]"
              placeholder="Event venue"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Total Seats</label>
            <input
              type="number"
              name="totalSeats"
              value={form.totalSeats}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ce5479]"
              placeholder="Number of seats"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ce5479] hover:bg-[#ce5479]/90 text-white py-3 rounded-lg font-semibold transition-all"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </div>
    </div>
  )
}


function BookedPlacesSection() {
  const [bookings, setBookings] = useState<any[]>([])
  useEffect(() => {
    const token = localStorage.getItem("token")
    axios.get("http://localhost:5000/api/bookings", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Failed to fetch bookings", err))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Booked Places & Users</h1>
      <ul className="bg-white border rounded-lg divide-y">
        {bookings.map((booking) => (
          <li key={booking.id} className="p-4">
            <p><strong>Event:</strong> {booking.eventTitle}</p>
            <p><strong>User:</strong> {booking.userName} ({booking.email})</p>
            <p><strong>Seats:</strong> {booking.seats}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ApproveBookingsSection() {
  const [pending, setPending] = useState<any[]>([])
  useEffect(() => {
    const token = localStorage.getItem("token")
    axios.get("http://localhost:5000/api/bookings/pending", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPending(res.data))
      .catch((err) => console.error("Failed to fetch pending", err))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Approve/Reject Bookings</h1>
      {pending.map((req) => (
        <div key={req.id} className="bg-white border p-4 rounded mb-3">
          <p><strong>{req.eventTitle}</strong> by {req.userName} - {req.email} ({req.seats} seats)</p>
          <div className="mt-2 flex gap-2">
            <Button className="bg-green-600 text-white px-4">Approve</Button>
            <Button className="bg-red-600 text-white px-4">Reject</Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfileSection() {
  return <div className="text-gray-500">User profile section...</div>
}

function EventAttendeesSection({ eventId, onBack }: { eventId: string; onBack: () => void }) {
  const [attendees, setAttendees] = useState<any[]>([])
  useEffect(() => {
    const token = localStorage.getItem("token")
    axios.get(`http://localhost:5000/api/events/${eventId}/attendees`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setAttendees(res.data))
      .catch((err) => console.error("Failed to fetch attendees", err))
  }, [eventId])

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      <h1 className="text-2xl font-bold my-4">Attendees</h1>
      <ul className="bg-white border rounded-lg divide-y">
        {attendees.map((a) => (
          <li key={a.id} className="p-4">{a.name} - {a.email}</li>
        ))}
      </ul>
    </div>
  )
}
