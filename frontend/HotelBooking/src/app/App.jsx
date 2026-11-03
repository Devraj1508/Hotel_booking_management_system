import { Link } from 'react-router-dom';
import { useAuth } from '../core/context/AuthContext.jsx';
import { AppRoutes } from './routes.jsx';

export function App() {
  const { user, logout } = useAuth();
  return <><header className="navbar"><Link className="brand" to="/">StayWell</Link><nav>
    <Link to="/hotels">Explore</Link>{user ? <><Link to="/bookings">My bookings</Link>{user.role === 'admin' && <Link to="/admin">Admin</Link>}<button onClick={logout}>Log out</button></> : <><Link to="/login">Log in</Link><Link className="nav-cta" to="/register">Create account</Link></>}
  </nav></header><AppRoutes /></>;
}
