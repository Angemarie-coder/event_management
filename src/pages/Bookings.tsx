import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Booking {
  id: number;
  event: {
    title: string;
    date: string;
    location: string;
  };
  seatCount: number;
  status: string;
  createdAt: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data);
      } catch (err: any) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {bookings.map(booking => (
            <li key={booking.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
              <h3>{booking.event.title}</h3>
              <p><b>Date:</b> {new Date(booking.event.date).toLocaleString()}</p>
              <p><b>Location:</b> {booking.event.location}</p>
              <p><b>Seats Booked:</b> {booking.seatCount}</p>
              <p><b>Status:</b> {booking.status}</p>
              <p><b>Booked At:</b> {new Date(booking.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookings; 