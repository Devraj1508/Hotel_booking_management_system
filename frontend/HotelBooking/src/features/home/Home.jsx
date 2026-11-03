import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHotels } from '../hotels/service/hotelService.js';
import { useAuth } from '../../core/context/AuthContext.jsx';

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getHotels()
      .then((data) => setHotels(data.hotels))
      .catch(() => setError('Hotels are temporarily unavailable. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  function search(event) {
    event.preventDefault();
    const query = event.currentTarget.elements.destination.value.trim();
    navigate(query ? `/hotels?q=${encodeURIComponent(query)}` : '/hotels');
  }

  return <main>
    <section className="hero">
      <div>
        <p className="eyebrow">{user ? `WELCOME BACK, ${user.name.toUpperCase()}` : 'TRAVEL YOUR WAY'}</p>
        <h1>Find a stay that feels like home.</h1>
        <p className="hero-copy">Discover thoughtfully selected hotels, easy booking, and a smoother way to travel.</p>
        <form className="search-panel" onSubmit={search}>
          <label>Where<input name="destination" placeholder="City or hotel name" /></label>
          <label>Check in<input name="checkIn" type="date" /></label>
          <label>Check out<input name="checkOut" type="date" /></label>
          <label>Guests<select name="guests" defaultValue="2"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4+ guests</option></select></label>
          <button type="submit">Search stays</button>
        </form>
      </div>
    </section>

    <section className="intro">
      <div className="section-heading"><div><p className="eyebrow">FEATURED STAYS</p><h2>Places made for your next trip.</h2></div><Link className="text-link" to="/hotels">View all stays →</Link></div>
      {loading && <div className="state">Finding beautiful places...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && hotels.length === 0 && <div className="empty-state"><h3>No hotels have been added yet.</h3><p>Check back soon for available stays.</p></div>}
      <div className="hotel-grid">{hotels.map((hotel) => <Link className="hotel-card" to={`/hotels/${hotel._id}`} key={hotel._id}>
        <div className="hotel-image" style={{ backgroundImage: `url(${hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'})` }} />
        <div><p className="eyebrow">{hotel.location}</p><h3>{hotel.name}</h3><p>{hotel.description}</p><strong>{hotel.rating ? `${hotel.rating.toFixed(1)} / 5` : 'New stay'}</strong></div>
      </Link>)}</div>
    </section>

    <section className="intro benefits"><p className="eyebrow">A BETTER BOOKING EXPERIENCE</p><h2>Everything you need for a great stay.</h2><div className="feature-grid"><article><span>01</span><h3>Search with confidence</h3><p>Clear details, honest pricing, and flexible options help you choose well.</p></article><article><span>02</span><h3>Book in minutes</h3><p>A simple, secure reservation flow keeps your plans moving.</p></article><article><span>03</span><h3>Stay in control</h3><p>Manage reservations and cancellations from one convenient place.</p></article></div>{user ? <Link className="text-link" to="/bookings">View my bookings →</Link> : <Link className="text-link" to="/register">Start exploring →</Link>}</section>
  </main>;
}
