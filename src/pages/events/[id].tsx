import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  totalSeats: number;
  availableSeats: number;
  createdBy: { name: string };
  imageUrl?: string;
}

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const EventDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seatCount, setSeatCount] = useState(1);
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (id) fetchEvent();
    // eslint-disable-next-line
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err: any) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    setBookingMsg('');
    setBookingError('');
    try {
      await api.post('/bookings', { eventId: event?.id, seatCount });
      setBookingMsg('Booking request sent!');
      setSeatCount(1);
      fetchEvent();
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">Loading event details...</div>;
  }
  if (error || !event) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-500">{error || 'Event not found'}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2 text-blue-800 dark:text-blue-200">{event.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">{formatDate(event.date)}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{event.description}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-1"><b>Location:</b> {event.location}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-1"><b>Available Seats:</b> {event.availableSeats} / {event.totalSeats}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-4"><b>Created By:</b> {event.createdBy?.name}</p>
        {event.availableSeats === 0 && (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">Sold Out</span>
        )}
        {event.availableSeats > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Book Ticket</h2>
            <div className="flex gap-2 items-center mb-2">
              <input
                type="number"
                min={1}
                max={event.availableSeats}
                value={seatCount}
                onChange={e => setSeatCount(Number(e.target.value))}
                className="border rounded px-2 py-1 w-24"
              />
              <button
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                onClick={handleBook}
              >
                Book
              </button>
            </div>
            {bookingMsg && <div className="text-green-600 mb-2">{bookingMsg}</div>}
            {bookingError && <div className="text-red-600 mb-2">{bookingError}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails; 