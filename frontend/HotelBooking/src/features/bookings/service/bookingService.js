import { api } from '../../../../api/axios.js';

export async function getBookings() {
  const { data } = await api.get('/bookings');
  return data.data.bookings;
}

export async function createBooking(details) {
  const { data } = await api.post('/bookings', details);
  return data.data.booking;
}

export async function cancelBooking(id) {
  const { data } = await api.patch(`/bookings/${id}/cancel`);
  return data.data.booking;
}
