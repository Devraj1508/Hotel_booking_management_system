import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../service/bookingService.js';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function BookingForm({ room }) {
  const navigate = useNavigate();
  const today = formatDate(new Date());
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: 1 });
  const [error, setError] = useState('');
  const minimumCheckout = (() => {
    if (!form.checkIn) return today;
    const date = new Date(`${form.checkIn}T00:00:00`);
    date.setDate(date.getDate() + 1);
    return formatDate(date);
  })();

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!form.checkIn || !form.checkOut || form.checkOut <= form.checkIn) {
      setError('Check-out must be at least one day after check-in.');
      return;
    }
    try {
      await createBooking({ roomId: room._id, ...form });
      navigate('/bookings');
    } catch (err) {
      const details = err.response?.data?.details;
      const detailMessage = details && Object.values(details).flat().join(' ');
      setError(detailMessage || err.response?.data?.message || 'Unable to reserve this room.');
    }
  }

  function updateCheckIn(value) {
    setForm((current) => ({
      ...current,
      checkIn: value,
      checkOut: current.checkOut > value ? current.checkOut : ''
    }));
  }

  return <form className="booking-form" onSubmit={submit}>
    <label>Check in<input required type="date" min={today} value={form.checkIn} onChange={(event) => updateCheckIn(event.target.value)} /></label>
    <label>Check out<input required type="date" min={minimumCheckout} value={form.checkOut} onChange={(event) => setForm({ ...form, checkOut: event.target.value })} /></label>
    <label>Guests<input required type="number" min="1" max={room.capacity} value={form.guests} onChange={(event) => setForm({ ...form, guests: Number(event.target.value) })} /></label>
    {error && <div className="error">{error}</div>}
    <button type="submit">Reserve room</button>
  </form>;
}
