"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/axios";

export default function EventDetailPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (eventId) {
      axios.get(`http://localhost:5000/api/events/${eventId}`)
        .then((res) => setEvent(res.data))
        .catch((err) => console.error("Error fetching event:", err));
    }
  }, [eventId]);

  if (!event) return <p className="text-center text-gray-500">Loading event details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{event.title}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{event.date}</p>
      <p className="text-gray-700 dark:text-gray-200">{event.description}</p>
    </div>
  );
}
