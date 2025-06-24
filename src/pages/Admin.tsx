import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  totalSeats: number;
  availableSeats: number;
}

interface Booking {
  id: number;
  event: Event;
  user: { name: string; email: string };
  seatCount: number;
  status: string;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'events' | 'bookings' | 'users'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Event creation state
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    totalSeats: 1,
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (tab === 'events') fetchEvents();
    if (tab === 'bookings') fetchBookings();
    if (tab === 'users') fetchUsers();
    // eslint-disable-next-line
  }, [tab]);

  const fetchEvents = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch { setError('Failed to load events'); }
    setLoading(false);
  };
  const fetchBookings = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch { setError('Failed to load bookings'); }
    setLoading(false);
  };
  const fetchUsers = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/admins/users');
      setUsers(res.data);
    } catch { setError('Failed to load users'); }
    setLoading(false);
  };

  const handleApprove = async (id: number) => {
    setSuccess(''); setError('');
    try {
      await api.post(`/bookings/${id}/approve`);
      setSuccess('Booking approved');
      fetchBookings();
    } catch { setError('Failed to approve booking'); }
  };
  const handleReject = async (id: number) => {
    setSuccess(''); setError('');
    try {
      await api.post(`/bookings/${id}/reject`);
      setSuccess('Booking rejected');
      fetchBookings();
    } catch { setError('Failed to reject booking'); }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true); setError(''); setSuccess('');
    try {
      await api.post('/events', {
        ...newEvent,
        totalSeats: Number(newEvent.totalSeats),
      });
      setSuccess('Event created successfully!');
      setNewEvent({ title: '', description: '', date: '', location: '', totalSeats: 1 });
      fetchEvents();
    } catch {
      setError('Failed to create event');
    }
    setCreating(false);
  };

  // Approve admin (super admin only)
  const handleApproveAdmin = async (id: number) => {
    setSuccess(''); setError('');
    try {
      await api.post(`/admins/${id}/approve`);
      setSuccess('Admin approved');
      fetchUsers();
    } catch {
      setError('Failed to approve admin');
    }
  };

  if (!user) return <div>Loading...</div>;
  if (user.role !== 'admin') return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Access denied. Only admins can access this page.</div>;

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Admin Panel</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab('events')} disabled={tab==='events'}>Event Management</button>
        <button onClick={() => setTab('bookings')} disabled={tab==='bookings'} style={{ marginLeft: 10 }}>Booking Approvals</button>
        {(user?.role === 'admin' || user?.role === 'super-admin') && (
          <button onClick={() => setTab('users')} disabled={tab==='users'} style={{ marginLeft: 10 }}>User List</button>
        )}
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {tab === 'events' && (
        <div>
          <h3>All Events</h3>
          {/* Event Creation Form */}
          <form onSubmit={handleCreateEvent} style={{ marginBottom: 24, border: '1px solid #ddd', padding: 16, borderRadius: 8, background: '#f9f9f9' }}>
            <h4>Create New Event</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <input
                type="text"
                placeholder="Title"
                value={newEvent.title}
                onChange={e => setNewEvent(ev => ({ ...ev, title: e.target.value }))}
                required
                style={{ flex: 1, minWidth: 120 }}
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={e => setNewEvent(ev => ({ ...ev, location: e.target.value }))}
                required
                style={{ flex: 1, minWidth: 120 }}
              />
              <input
                type="datetime-local"
                value={newEvent.date}
                onChange={e => setNewEvent(ev => ({ ...ev, date: e.target.value }))}
                required
                style={{ flex: 1, minWidth: 180 }}
              />
              <input
                type="number"
                min={1}
                placeholder="Total Seats"
                value={newEvent.totalSeats}
                onChange={e => setNewEvent(ev => ({ ...ev, totalSeats: Number(e.target.value) }))}
                required
                style={{ flex: 1, minWidth: 100 }}
              />
            </div>
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={e => setNewEvent(ev => ({ ...ev, description: e.target.value }))}
              required
              style={{ width: '100%', marginTop: 8, minHeight: 60 }}
            />
            <button type="submit" disabled={creating} style={{ marginTop: 10, padding: '8px 24px' }}>
              {creating ? 'Creating...' : 'Create Event'}
            </button>
          </form>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {events.map(event => (
              <li key={event.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
                <b>{event.title}</b> - {event.date} - {event.location} <br/>
                Seats: {event.availableSeats} / {event.totalSeats}
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === 'bookings' && (
        <div>
          <h3>All Bookings</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bookings.map(booking => (
              <li key={booking.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
                <b>{booking.event.title}</b> by {booking.user.name} ({booking.user.email})<br/>
                Seats: {booking.seatCount} | Status: {booking.status} | Booked: {new Date(booking.createdAt).toLocaleString()}<br/>
                {booking.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(booking.id)}>Approve</button>
                    <button onClick={() => handleReject(booking.id)} style={{ marginLeft: 5 }}>Reject</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === 'users' && (
        <div>
          <h3>All Users</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map(u => (
              <li key={u.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
                <b>{u.name}</b> ({u.email}) - {u.role} {u.isApproved ? '(Approved)' : '(Pending)'}
                {/* Show Approve button for pending admins if super admin is logged in */}
                {user?.role === 'super-admin' && u.role === 'admin' && !u.isApproved && (
                  <button onClick={() => handleApproveAdmin(u.id)} style={{ marginLeft: 10 }}>
                    Approve
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Admin; 