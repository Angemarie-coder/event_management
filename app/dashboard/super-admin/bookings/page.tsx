"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

interface Booking {
  id: number;
  event: { id: number; title: string };
  user: { id: number; name: string; email: string };
  numberOfTickets: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/bookings");
      setBookings(response.data);
    } catch (err: any) {
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    setActionLoading(id);
    setError("");
    try {
      await api.post(`/api/bookings/${id}/${action}`);
      await fetchBookings();
    } catch (err: any) {
      setError(`Failed to ${action} booking`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-gray-500">No bookings found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Event</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Tickets</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-t">
                  <td className="px-4 py-2">{booking.event?.title || "-"}</td>
                  <td className="px-4 py-2">
                    {booking.user?.name || "-"}
                    <div className="text-xs text-gray-500">{booking.user?.email}</div>
                  </td>
                  <td className="px-4 py-2">{booking.numberOfTickets}</td>
                  <td className="px-4 py-2">${booking.totalAmount}</td>
                  <td className="px-4 py-2">{booking.status}</td>
                  <td className="px-4 py-2">{new Date(booking.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {booking.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAction(booking.id, "approve")}
                          disabled={actionLoading === booking.id}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleAction(booking.id, "reject")}
                          disabled={actionLoading === booking.id}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 