import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../../api/axios.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionCheckStarted = useRef(false);

  useEffect(() => {
    if (sessionCheckStarted.current) return;
    sessionCheckStarted.current = true;
    api.get('/auth/me').then(({ data }) => setUser(data.data.user)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(credentials) { const { data } = await api.post('/auth/login', credentials); setUser(data.data.user); },
    async register(details) { const { data } = await api.post('/auth/register', details); setUser(data.data.user); },
    async logout() { await api.post('/auth/logout'); setUser(null); }
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
