import { api } from '../../../../api/axios.js';

export async function getHotels(params) {
  const { data } = await api.get('/hotels', { params });
  return data.data;
}

export async function getHotel(id) {
  const { data } = await api.get(`/hotels/${id}`);
  return data.data.hotel;
}
