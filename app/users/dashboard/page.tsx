"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventCard from "@/components/user/eventcard";
import axios from "@/lib/axios"; // use your custom axios instance

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("http://localhost:5000/api/login");
      return;
    }

    axios.get("http://localhost:5000/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Available Events</h1>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No events available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  );
}
