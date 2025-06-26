import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Clock } from "lucide-react"

// Sample booking data - replace with actual data from your database
const bookings = [
  {
    id: 1,
    eventTitle: "Tech Conference 2024",
    eventDate: "2024-07-15",
    eventTime: "09:00 AM",
    eventLocation: "Convention Center",
    userName: "John Doe",
    userEmail: "john@example.com",
    bookingDate: "2024-06-22",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    eventTitle: "Marketing Workshop",
    eventDate: "2024-07-20",
    eventTime: "02:00 PM",
    eventLocation: "Business Hub",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    bookingDate: "2024-06-21",
    status: "approved",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    eventTitle: "Startup Pitch Night",
    eventDate: "2024-07-25",
    eventTime: "06:00 PM",
    eventLocation: "Innovation Center",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    bookingDate: "2024-06-20",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    eventTitle: "Design Thinking Seminar",
    eventDate: "2024-08-01",
    eventTime: "10:00 AM",
    eventLocation: "Creative Space",
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    bookingDate: "2024-06-19",
    status: "rejected",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function BookingsPage() {
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
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-gray-50 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">Booking Management</h1>
            <p className="text-gray-600 mt-2">Manage and approve/reject event bookings made by users</p>
          </div>

          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-white shadow-sm border-gray-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-gray-700">{booking.eventTitle}</CardTitle>
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
                          <span>{booking.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{booking.eventTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.eventLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">User Details</h4>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={booking.avatar || "/placeholder.svg"} alt={booking.userName} />
                          <AvatarFallback className="bg-gray-700 text-white">
                            {booking.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-700">{booking.userName}</p>
                          <p className="text-sm text-gray-600">{booking.userEmail}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Booked on: {booking.bookingDate}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                 
                    {booking.status === "pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
