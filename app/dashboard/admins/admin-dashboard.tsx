"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Calendar, MapPin, Users, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  totalSeats: number;
  availableSeats: number;
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await api.get('/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvents(response.data);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to load events");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="mb-8">
        <p className="text-gray-600">Manage your events and bookings</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Plus className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Event</h3>
                <p className="text-sm text-gray-600">Create a new event</p>
              </div>
            </div>
            <Button asChild className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white">
              <Link href="/dashboard/admins/add-event">Create Event</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Bookings</h3>
                <p className="text-sm text-gray-600">Approve/reject bookings</p>
              </div>
            </div>
            <Button asChild className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white">
              <Link href="/dashboard/admins/bookings">View Bookings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Users</h3>
                <p className="text-sm text-gray-600">See registered users</p>
              </div>
            </div>
            <Button asChild className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white">
              <Link href="/dashboard/admins/users">View Users</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Events Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your Events
              </CardTitle>
              <CardDescription>
                Manage all events you've created
              </CardDescription>
            </div>
            <Button asChild className="bg-gray-600 hover:bg-gray-700 text-white">
              <Link href="/dashboard/admins/add-event">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
              <Button asChild className="bg-gray-600 hover:bg-gray-700 text-white">
                <Link href="/dashboard/admins/add-event">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {event.title}
                      </h3>
                      <Badge variant={event.availableSeats > 0 ? "secondary" : "destructive"} className={event.availableSeats > 0 ? "bg-gray-100 text-gray-600" : ""}>
                        {event.availableSeats > 0 ? "Available" : "Full"}
                      </Badge>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{event.availableSeats}/{event.totalSeats} seats available</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1 bg-gray-600 hover:bg-gray-700 text-white">
                        <Link href={`/dashboard/admins/bookings?event=${event.id}`}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Bookings
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 