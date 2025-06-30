"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Calendar, User, Mail, Clock } from "lucide-react"
import { toast } from "sonner"

interface Booking {
  id: number
  seatCount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  guestName?: string
  guestEmail?: string
  user?: {
    id: number
    name: string
    email: string
  }
  event: {
    id: number
    title: string
    date: string
    location: string
    availableSeats: number
    totalSeats: number
  }
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch("http://localhost:5000/api/bookings/pending", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        console.error("Failed to fetch bookings:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (bookingId: number) => {
    setActionLoading(bookingId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        toast.success("Booking approved successfully!")
        fetchBookings() // Refresh the list
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to approve booking")
      }
    } catch (error) {
      console.error("Error approving booking:", error)
      toast.error("Failed to approve booking")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (bookingId: number) => {
    setActionLoading(bookingId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        toast.success("Booking rejected successfully!")
        fetchBookings() // Refresh the list
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to reject booking")
      }
    } catch (error) {
      console.error("Error rejecting booking:", error)
      toast.error("Failed to reject booking")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAttendeeInfo = (booking: Booking) => {
    if (booking.user) {
      return {
        name: booking.user.name,
        email: booking.user.email,
        type: 'Registered User'
      }
    } else {
      return {
        name: booking.guestName || 'Unknown',
        email: booking.guestEmail || 'No email',
        type: 'Guest'
      }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Booking Requests</CardTitle>
        <CardDescription>Review and approve/reject booking requests from attendees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attendee</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No pending booking requests
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => {
                  const attendee = getAttendeeInfo(booking)
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {attendee.name}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {attendee.email}
                          </div>
                          <div className="text-xs text-blue-600">{attendee.type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.event.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(booking.event.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">{booking.event.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.seatCount}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.event.availableSeats} seats remaining
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {booking.status === "pending" && (
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(booking.id)}
                              disabled={actionLoading === booking.id}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {actionLoading === booking.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReject(booking.id)}
                              disabled={actionLoading === booking.id}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              {actionLoading === booking.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
