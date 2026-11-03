import { useEffect, useState } from 'react';
import { getDashboard } from '../service/adminService.js';
import { formatCurrency } from '../../../utils/currency.js';

export function AdminDashboard() {
  const [stats, setStats] = useState(null); const [error, setError] = useState('');
  useEffect(() => { getDashboard().then(setStats).catch(() => setError('Unable to load dashboard.')); }, []);
  return <main className="page"><p className="eyebrow">ADMINISTRATION</p><h1>Dashboard</h1>{error && <div className="error">{error}</div>}{!stats ? <div className="state">Loading dashboard...</div> :
    <div className="stats-grid">{Object.entries(stats).map(([key, value]) => <article className="stat-card" key={key}><span>{key}</span><strong>{key === 'revenue' ? formatCurrency(value) : value}</strong></article>)}</div>}</main>;
}
