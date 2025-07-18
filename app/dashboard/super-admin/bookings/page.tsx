"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token found. Please login again.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("http://localhost:5000/api/bookings/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          })
          return
        }
        throw new Error("Failed to fetch bookings")
      }

      const data = await response.json()
      console.log("Backend bookings data:", data)
      setBookings(data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const token = getAuthToken()

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token found. Please login again.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`http://localhost:5000/api/bookings/${id}/${status}`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          })
          return
        }
        throw new Error("Failed to update booking status")
      }

      // Refresh bookings after update
      await fetchBookings()
      
      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      })
    } catch (error) {
      console.error("Error updating booking status:", error)
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
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

  return (
    <div className="min-h-screen bg-[#f4f4fa] p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-2">Manage and approve/reject event bookings made by users or clients</p>
        </div>
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No bookings found.</div>
          ) : (
            bookings.map((booking: any) => (
              <Card key={booking.id} className="bg-white shadow-md rounded-xl">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-gray-700">{booking.event?.title || "Event"}</CardTitle>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Event Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{booking.event?.time || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.event?.location || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">User Details</h4>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={booking.user?.avatar || "/placeholder.svg"} alt={booking.user?.name || "User"} />
                          <AvatarFallback className="bg-gray-700 text-white">
                            {booking.user?.name
                              ? booking.user.name.split(" ").map((n: string) => n[0]).join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-700">{booking.user?.name || booking.guestName || "User"}</p>
                          <p className="text-sm text-gray-500">{booking.user?.email || booking.guestEmail || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(booking.id, "rejected")}
                      disabled={actionLoading[booking.id]}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(booking.id, "approved")}
                      disabled={actionLoading[booking.id]}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
