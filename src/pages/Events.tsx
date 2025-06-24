import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useRouter } from 'next/router';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  totalSeats: number;
  availableSeats: number;
  createdBy: { name: string };
  imageUrl?: string; // Optional: for event images
}

const filters = [
  { label: 'Active', value: 'active' },
  { label: 'Happening Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'Weekend', value: 'weekend' },
];

function formatDate(dateString: string) {
  const d = new Date(dateString);
  // Format as YYYY-MM-DD HH:mm
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingEventId, setBookingEventId] = useState<number | null>(null);
  const [seatCount, setSeatCount] = useState(1);
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('active');
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, selectedFilter, search]);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err: any) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    const now = new Date();
    let filtered = events;
    if (selectedFilter === 'today') {
      filtered = events.filter(e => {
        const eventDate = new Date(e.date);
        return (
          eventDate.getDate() === now.getDate() &&
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (selectedFilter === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      filtered = events.filter(e => {
        const eventDate = new Date(e.date);
        return (
          eventDate.getDate() === tomorrow.getDate() &&
          eventDate.getMonth() === tomorrow.getMonth() &&
          eventDate.getFullYear() === tomorrow.getFullYear()
        );
      });
    } else if (selectedFilter === 'weekend') {
      filtered = events.filter(e => {
        const eventDate = new Date(e.date);
        const day = eventDate.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
      });
    } else if (selectedFilter === 'active') {
      filtered = events.filter(e => e.availableSeats > 0);
    }
    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(
        e =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.location.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredEvents(filtered);
  };

  const handleBook = async (eventId: number) => {
    setBookingMsg('');
    setBookingError('');
    try {
      await api.post('/bookings', { eventId, seatCount });
      setBookingMsg('Booking request sent!');
      setBookingEventId(null);
      setSeatCount(1);
      fetchEvents();
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 px-8 py-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex gap-2">
          {filters.map(filter => (
            <button
              key={filter.value}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedFilter === filter.value
                  ? 'bg-blue-700 text-white dark:bg-blue-500'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-600'
              }`}
              onClick={() => setSelectedFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
          <button
            className="px-4 py-2 rounded-full bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
            onClick={() => setSelectedFilter('active')}
          >
            Reset
          </button>
        </div>
        <input
          type="text"
          placeholder="Search events or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-64 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Events Grid */}
      <main className="flex-1 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {error ? (
          <div className="col-span-full text-center text-red-500">{error}</div>
        ) : filteredEvents.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No events found.</div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col relative group transition-transform hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              {/* Event Image or Placeholder */}
              <div className="h-36 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-1 text-blue-800 dark:text-blue-200">{event.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-1">{formatDate(event.date)}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-1">{event.description}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-1"><b>Location:</b> {event.location}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-1"><b>Available Seats:</b> {event.availableSeats} / {event.totalSeats}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-1"><b>Created By:</b> {event.createdBy?.name}</p>
              {event.availableSeats === 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">Sold Out</span>
              )}
            </div>
          ))
        )}
      </main>
      {bookingMsg && <div className="text-green-600 text-center mb-4">{bookingMsg}</div>}
      {bookingError && <div className="text-red-600 text-center mb-4">{bookingError}</div>}
    </div>
  );
};

export default Events; 