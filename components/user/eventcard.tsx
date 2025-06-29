"use client";

import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useState } from "react";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
}

export default function EventCard({ event }: { event: Event }) {
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleBook = async () => {
    const quantityStr = prompt("Enter number of tickets:");
    if (!quantityStr) return;
    const quantity = parseInt(quantityStr);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid number");
      return;
    }

    setBookingLoading(true);
    try {
      await axios.post(" http://localhost:5000/api/bookings", { eventId: event.id, quantity });
      alert("Booking request sent! Please wait for admin approval.");
    } catch (error) {
      alert("Failed to book tickets.");
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p className="text-gray-600">{event.description}</p>
      <p className="text-sm">📍 {event.location}</p>
      <p className="text-sm">📅 {new Date(event.date).toLocaleDateString()}</p>
      <Button onClick={handleBook} disabled={bookingLoading} className="mt-3">
        {bookingLoading ? "Booking..." : "Book Now"}
      </Button>
    </div>
  );
}
