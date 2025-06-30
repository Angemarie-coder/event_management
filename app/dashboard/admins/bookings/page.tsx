"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Clock, Users, Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface Booking {
  id: number;
  seatCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  guestName?: string;
  guestEmail?: string;
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
    totalSeats: number;
    availableSeats: number;
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingBooking, setProcessingBooking] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await api.get('/api/bookings/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookings(response.data);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: number) => {
    setProcessingBooking(bookingId);
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/bookings/${bookingId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'APPROVED' as const }
          : booking
      ));
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to approve booking");
      }
    } finally {
      setProcessingBooking(null);
    }
  };

  const handleReject = async (bookingId: number) => {
    setProcessingBooking(bookingId);
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/bookings/${bookingId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'REJECTED' as const }
          : booking
      ));
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to reject booking");
      }
    } finally {
      setProcessingBooking(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAttendeeInfo = (booking: Booking) => {
    if (booking.user) {
      return {
        name: booking.user.name,
        email: booking.user.email,
        type: 'Registered User'
      };
    } else {
      return {
        name: booking.guestName || 'Unknown',
        email: booking.guestEmail || 'No email',
        type: 'Guest'
      };
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Booking Management
          </CardTitle>
          <CardDescription>
            Review and manage all booking requests for your events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500">There are no bookings to manage at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const attendee = getAttendeeInfo(booking);
                return (
                  <Card key={booking.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{booking.event.title}</h3>
                              <p className="text-sm text-gray-600">{attendee.type}</p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
                                <strong>{attendee.name}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
                                {new Date(booking.event.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{booking.event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                <strong>{booking.seatCount}</strong> seats
                              </span>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600">
                            <p><strong>Email:</strong> {attendee.email}</p>
                            <p><strong>Booked on:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                            <p><strong>Event capacity:</strong> {booking.event.availableSeats}/{booking.event.totalSeats} seats available</p>
                          </div>
                        </div>

                        {booking.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(booking.id)}
                              disabled={processingBooking === booking.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {processingBooking === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(booking.id)}
                              disabled={processingBooking === booking.id}
                            >
                              {processingBooking === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 