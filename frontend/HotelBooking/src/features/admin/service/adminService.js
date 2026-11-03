import { api } from '../../../../api/axios.js';

export async function getDashboard() {
  const { data } = await api.get('/admin/dashboard');
  return data.data.stats;
}
