"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import BookingStatus from "@/components/user/BookingStatus";

interface Booking {
  id: number;
  status: string;
  quantity: number;
  createdAt: string;
  event: {
    title: string;
    date: string;
  };
}

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Failed to fetch bookings", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Loading bookings...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingStatus key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
