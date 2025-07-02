// components/user/BookingForm.tsx
"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function BookingForm({ eventId }: { eventId: number }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const handleBooking = async () => {
    try {
      await api.post(" http://localhost:5000/api/bookings", { eventId, seatCount: quantity, message });
      alert("Booking request sent!");
    } catch (error) {
      alert("Failed to book ticket.");
    }
  };

  return (
    <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-md">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ticket Quantity</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 rounded w-full mb-4 text-gray-900 dark:text-white"
      />
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (Optional)</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 rounded w-full mb-4 text-gray-900 dark:text-white"
      />
      <button
        onClick={handleBooking}
        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg w-full transition"
      >
        Book Ticket
      </button>
    </div>
  );
}
