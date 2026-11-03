import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getHotels } from '../service/hotelService.js';

export function Hotels() {
  const [state, setState] = useState({ loading: true, hotels: [], error: '' });
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  useEffect(() => {
    let active = true;
    getHotels(query ? { q: query } : {}).then((data) => active && setState({ loading: false, hotels: data.hotels, error: '' }))
      .catch(() => active && setState({ loading: false, hotels: [], error: 'Unable to load hotels right now.' }));
    return () => { active = false; };
  }, [query]);
  return <main className="page"><p className="eyebrow">EXPLORE STAYS</p><h1>Find your next stay.</h1>
    <form className="inline-search" onSubmit={(event) => { event.preventDefault(); setQuery(event.currentTarget.elements.search.value); }}>
      <input name="search" placeholder="Search by hotel or destination" defaultValue={query} /><button type="submit">Search</button>
    </form>
    {state.loading ? <div className="state">Finding beautiful places...</div> : state.error ? <div className="error">{state.error}</div> :
      state.hotels.length === 0 ? <div className="empty-state"><h3>No matching hotels found.</h3><p>Try a city, hotel name, category, or amenity such as “Delhi”, “Luxury”, or “Pool”.</p></div> :
      <div className="hotel-grid">{state.hotels.map((hotel) => <Link className="hotel-card" to={`/hotels/${hotel._id}`} key={hotel._id}>
        <div className="hotel-image" style={{ backgroundImage: `url(${hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'})` }} />
        <div><p className="eyebrow">{hotel.location}</p><h2>{hotel.name}</h2><p>{hotel.description}</p><strong>{hotel.rating ? `${hotel.rating.toFixed(1)} / 5` : 'New stay'}</strong></div>
      </Link>)}</div>}
  </main>;
}
