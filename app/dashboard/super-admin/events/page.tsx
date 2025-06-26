import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

// Sample events data - replace with actual data from your database
const events = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "Annual technology conference featuring the latest innovations",
    date: "2024-07-15",
    time: "09:00 AM",
    location: "Convention Center",
    capacity: 500,
    registered: 342,
    status: "active",
    createdBy: "John Doe",
    createdAt: "2024-06-01",
  },
  {
    id: 2,
    title: "Marketing Workshop",
    description: "Learn the latest digital marketing strategies",
    date: "2024-07-20",
    time: "02:00 PM",
    location: "Business Hub",
    capacity: 100,
    registered: 78,
    status: "active",
    createdBy: "Jane Smith",
    createdAt: "2024-06-05",
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    description: "Entrepreneurs pitch their innovative ideas",
    date: "2024-07-25",
    time: "06:00 PM",
    location: "Innovation Center",
    capacity: 200,
    registered: 156,
    status: "pending",
    createdBy: "Mike Johnson",
    createdAt: "2024-06-10",
  },
  {
    id: 4,
    title: "Design Thinking Seminar",
    description: "Interactive seminar on design thinking methodologies",
    date: "2024-08-01",
    time: "10:00 AM",
    location: "Creative Space",
    capacity: 75,
    registered: 23,
    status: "draft",
    createdBy: "Sarah Wilson",
    createdAt: "2024-06-12",
  },
]

export default function EventsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-gray-50 p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-700">Event Management</h1>
              <p className="text-gray-600 mt-2">View and manage all events created by different users</p>
            </div>
           
          </div>

          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event.id} className="bg-white shadow-sm border-gray-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-gray-700">{event.title}</CardTitle>
                      <CardDescription className="text-gray-600">{event.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {event.registered}/{event.capacity}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Created by <span className="font-medium text-gray-700">{event.createdBy}</span> on{" "}
                      {event.createdAt}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      >
                        Edit
                      </Button>
                      {event.status === "pending" && (
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
