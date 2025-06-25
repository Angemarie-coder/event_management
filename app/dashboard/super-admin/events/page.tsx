"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  totalSeats: number;
  availableSeats: number;
  createdAt: string;
}

export default function ViewEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/api/events");
        setEvents(response.data);
      } catch (err: any) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">View Events</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : events.length === 0 ? (
        <div className="text-gray-500">No events found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Total Seats</th>
                <th className="px-4 py-2 text-left">Available</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="border-t">
                  <td className="px-4 py-2 font-semibold">{event.title}</td>
                  <td className="px-4 py-2">{new Date(event.date).toLocaleString()}</td>
                  <td className="px-4 py-2">{event.location}</td>
                  <td className="px-4 py-2">{event.totalSeats}</td>
                  <td className="px-4 py-2">{event.availableSeats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 