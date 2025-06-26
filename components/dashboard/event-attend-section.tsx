"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Download, Mail, Phone, Calendar, MapPin, Users } from "lucide-react"

interface Attendee {
  id: number
  name: string
  email: string
  phone: string
  seatsBooked: number
  bookingDate: string
  status: "confirmed" | "pending" | "cancelled"
  ticketNumber: string
  specialRequests?: string
}

interface EventAttendeesProps {
  eventId: string
}

export default function EventAttendeesSection({ eventId }: EventAttendeesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock event data - replace with your API call
  const eventDetails = {
    id: eventId,
    name: "Tech Conference 2024",
    date: "2024-07-15",
    time: "09:00",
    location: "Convention Center",
    totalSeats: 500,
    bookedSeats: 342,
  }

  // Mock attendees data - replace with your API call
  const attendees: Attendee[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      seatsBooked: 2,
      bookingDate: "2024-06-15",
      status: "confirmed",
      ticketNumber: "TC2024-001",
      specialRequests: "Wheelchair accessible seating",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 987-6543",
      seatsBooked: 1,
      bookingDate: "2024-06-18",
      status: "confirmed",
      ticketNumber: "TC2024-002",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@email.com",
      phone: "+1 (555) 456-7890",
      seatsBooked: 3,
      bookingDate: "2024-06-20",
      status: "pending",
      ticketNumber: "TC2024-003",
      specialRequests: "Vegetarian meal preference",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice.brown@email.com",
      phone: "+1 (555) 321-0987",
      seatsBooked: 1,
      bookingDate: "2024-06-22",
      status: "confirmed",
      ticketNumber: "TC2024-004",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie.wilson@email.com",
      phone: "+1 (555) 654-3210",
      seatsBooked: 2,
      bookingDate: "2024-06-25",
      status: "cancelled",
      ticketNumber: "TC2024-005",
    },
  ]

  // Filter attendees based on search and status
  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || attendee.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleExportAttendees = () => {
    // Implement CSV export functionality
    console.log("Exporting attendees...")
  }

  const handleSendEmail = (attendeeId: number) => {
    // Implement email functionality
    console.log(`Sending email to attendee ${attendeeId}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Event Attendees</h1>
          <p className="text-gray-600">{eventDetails.name}</p>
        </div>
      </div>

      {/* Event Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#ce5479]" />
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">
                {eventDetails.date} at {eventDetails.time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-[#ce5479]" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{eventDetails.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-[#ce5479]" />
            <div>
              <p className="text-sm text-gray-500">Total Attendees</p>
              <p className="font-medium">
                {eventDetails.bookedSeats} / {eventDetails.totalSeats}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-[#ce5479] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">%</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Occupancy</p>
              <p className="font-medium text-[#ce5479]">
                {Math.round((eventDetails.bookedSeats / eventDetails.totalSeats) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ce5479]"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Button onClick={handleExportAttendees} className="bg-[#ce5479] hover:bg-[#ce5479]/90">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Attendees List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                      <div className="text-sm text-gray-500">Ticket: {attendee.ticketNumber}</div>
                      {attendee.specialRequests && (
                        <div className="text-xs text-[#ce5479] mt-1">Special: {attendee.specialRequests}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{attendee.email}</div>
                    <div className="text-sm text-gray-500">{attendee.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{attendee.seatsBooked} seat(s)</div>
                    <div className="text-sm text-gray-500">Booked: {attendee.bookingDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        attendee.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : attendee.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {attendee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendEmail(attendee.id)}
                        className="text-[#ce5479] hover:text-[#ce5479]/80"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAttendees.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No attendees found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No one has registered for this event yet."}
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Confirmed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {attendees.filter((a) => a.status === "confirmed").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {attendees.filter((a) => a.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Cancelled</p>
              <p className="text-2xl font-semibold text-gray-900">
                {attendees.filter((a) => a.status === "cancelled").length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
