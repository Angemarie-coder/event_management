"use client";

import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useState } from "react";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  availableSeats?: number;
  totalSeats?: number;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
}

interface EventCardProps {
  event: Event;
  isLandingPage?: boolean;
}

export default function EventCard({ event, isLandingPage = false }: EventCardProps) {
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
      await axios.post("http://localhost:5000/api/bookings", { eventId: event.id, seatCount: quantity });
      alert("Booking request sent! You'll receive a confirmation email.");
      window.location.href = "/"; // Redirect to home after booking
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Please log in to book tickets.");
      } else {
        alert("Failed to book tickets. Please try again.");
      }
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{event.title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{event.description}</p>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          📍 {event.location}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          📅 {new Date(event.date).toLocaleDateString()}
        </p>
        {event.availableSeats !== undefined && event.totalSeats !== undefined && (
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            🎫 {event.availableSeats} of {event.totalSeats} seats available
          </p>
        )}
      </div>

      {isLandingPage ? (
        <Link href={`/book/${event.id}`}>
          <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white">
            Book Tickets
          </Button>
        </Link>
      ) : (
        <Button 
          onClick={handleBook} 
          disabled={bookingLoading} 
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
        >
          {bookingLoading ? "Booking..." : "Book Now"}
        </Button>
      )}
    </div>
  );
}
