import { api } from '../../../../api/axios.js';

export async function getHotelReviews(hotelId) {
  const { data } = await api.get(`/reviews/hotel/${hotelId}`);
  return data.data.reviews;
}

export async function addReview(hotelId, review) {
  const { data } = await api.post(`/reviews/hotel/${hotelId}`, review);
  return data.data.review;
}
