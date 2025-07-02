"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch("http://localhost:5000/api/events", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched events:', data);
        setEvents(data);
      } else {
        console.error('Failed to fetch events:', response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f4fa] p-2 sm:p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Event Management</h1>
            <p className="text-gray-600 mt-2">View and manage all events created by different users</p>
          </div>
        </div>

        <div className="grid gap-3">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No events found.</div>
          ) : (
            events.map((event: any) => (
              <Card key={event.id} className="bg-white shadow-md rounded-xl">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-gray-700">{event.title}</CardTitle>
                      <CardDescription className="text-gray-600">{event.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{event.date ? new Date(event.date).toLocaleDateString() : "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{event.date ? new Date(event.date).toLocaleTimeString() : "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{event.location || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {event.availableSeats ?? "-"}/{event.totalSeats ?? "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Created by <span className="font-medium text-gray-700">{event.createdBy?.name || "-"}</span> on {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "-"}
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
                    </div>
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
