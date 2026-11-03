import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHotel } from '../service/hotelService.js';
import { BookingForm } from '../../bookings/components/BookingForm.jsx';
import { formatCurrency } from '../../../utils/currency.js';

export function HotelDetails() {
  const { id } = useParams(); const [hotel, setHotel] = useState(null); const [error, setError] = useState('');
  useEffect(() => { getHotel(id).then(setHotel).catch(() => setError('Unable to load this hotel.')); }, [id]);
  if (error) return <main className="page"><div className="error">{error}</div></main>;
  if (!hotel) return <main className="state">Loading hotel details...</main>;
  return <main className="page"><Link className="text-link" to="/hotels">← All stays</Link><p className="eyebrow">{hotel.location}</p><h1>{hotel.name}</h1><p className="detail-copy">{hotel.description}</p>
    <h2>Choose a room</h2><div className="room-list">{hotel.rooms.map((room) => <article className="room-card" key={room._id}><div><h3>{room.name}</h3><p>{room.description || `${room.type} room for up to ${room.capacity} guests.`}</p><strong>{formatCurrency(room.pricePerNight)} / night</strong></div><BookingForm room={room} /></article>)}</div>
  </main>;
}
