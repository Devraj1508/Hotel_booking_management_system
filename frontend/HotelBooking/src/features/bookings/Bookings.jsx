import { useAuth } from '../../core/context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { cancelBooking, getBookings } from './service/bookingService.js';
import { bookingStatusLabels } from '../../constants/bookingStatus.js';
import { formatCurrency } from '../../utils/currency.js';

export function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState(null); const [error, setError] = useState('');
  useEffect(() => { getBookings().then(setBookings).catch(() => setError('Unable to load your bookings.')); }, []);
  async function cancel(id) { try { const booking = await cancelBooking(id); setBookings((items) => items.map((item) => item._id === booking._id ? booking : item)); } catch (err) { setError(err.response?.data?.message || 'Unable to cancel booking.'); } }
  return <main className="page"><p className="eyebrow">YOUR TRIPS</p><h1>Welcome, {user.name}.</h1>{error && <div className="error">{error}</div>}
    {!bookings ? <div className="state">Loading your trips...</div> : bookings.length === 0 ? <div className="empty-state"><h2>Your bookings will appear here.</h2><p>Once you reserve a stay, you can view its details and manage it from this page.</p></div> :
      <div className="booking-list">{bookings.map((booking) => <article className="booking-card" key={booking._id}><div><p className="eyebrow">{bookingStatusLabels[booking.status]}</p><h2>{booking.hotel?.name || 'Hotel stay'}</h2><p>{new Date(booking.checkIn).toLocaleDateString()} – {new Date(booking.checkOut).toLocaleDateString()} · {booking.guests} guest(s)</p></div><div><strong>{formatCurrency(booking.totalPrice)}</strong>{booking.status === 'confirmed' && <button className="secondary-button" onClick={() => cancel(booking._id)}>Cancel</button>}</div></article>)}</div>}
  </main>;
}
