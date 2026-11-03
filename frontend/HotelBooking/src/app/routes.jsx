import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../core/guards/ProtectedRoute.jsx';
import { Home } from '../features/home/Home.jsx';
import { Login } from '../features/auth/Login.jsx';
import { Register } from '../features/auth/Register.jsx';
import { Bookings } from '../features/bookings/Bookings.jsx';
import { Hotels } from '../features/hotels/pages/Hotels.jsx';
import { HotelDetails } from '../features/hotels/pages/HotelDetails.jsx';
import { AdminRoute } from '../core/guards/AdminRoute.jsx';
import { AdminDashboard } from '../features/admin/pages/AdminDashboard.jsx';

export function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/hotels" element={<Hotels />} />
    <Route path="/hotels/:id" element={<HotelDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}><Route path="/bookings" element={<Bookings />} /></Route>
    <Route element={<AdminRoute />}><Route path="/admin" element={<AdminDashboard />} /></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
