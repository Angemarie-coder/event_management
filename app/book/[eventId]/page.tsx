"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  availableSeats: number;
  totalSeats: number;
}

export default function BookEventPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    quantity: 1
  });
  
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/public`);
        const events = response.data;
        const foundEvent = events.find((e: Event) => e.id === Number(eventId));
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBookingLoading(true);

    if (!formData.name.trim()) {
      setError("Please enter your name");
      setBookingLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address");
      setBookingLoading(false);
      return;
    }

    if (formData.quantity < 1 || formData.quantity > event!.availableSeats) {
      setError(`Please enter a valid quantity (1-${event!.availableSeats})`);
      setBookingLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/bookings/guest", {
        eventId: event!.id,
        seatCount: formData.quantity,
        guestName: formData.name,
        guestEmail: formData.email
      });

      setSuccess(true);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to book tickets. Please try again.");
      }
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Booking Submitted!</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Your booking request has been submitted successfully. You'll receive a confirmation email shortly.
                </p>
              </div>
              <Link href="/">
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  Back to Events
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
          
          {event && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>📍 {event.location}</div>
                <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                <div>🎫 {event.availableSeats} of {event.totalSeats} seats available</div>
              </div>
            </div>
          )}
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Book Your Tickets</CardTitle>
            <CardDescription>Enter your details to complete your booking</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={bookingLoading}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={bookingLoading}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Number of Tickets *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max={event?.availableSeats || 1}
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  disabled={bookingLoading}
                  placeholder="Enter number of tickets"
                />
                <p className="text-sm text-gray-500">
                  Maximum {event?.availableSeats} tickets available
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                disabled={bookingLoading}
              >
                {bookingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {bookingLoading ? "Processing..." : "Book Tickets"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 