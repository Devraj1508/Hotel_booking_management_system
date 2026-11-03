import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/context/AuthContext.jsx';

export function Login() {
  const { login } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState('');
  async function submit(event) { event.preventDefault(); setError(''); try { await login(form); navigate('/'); } catch (err) { setError(err.response?.data?.message || 'Unable to log in'); } }
  return <AuthForm title="Welcome back" subtitle="Sign in to manage your stays." submit={submit} error={error} fields={form} setFields={setForm} button="Log in" footer={<>New here? <Link to="/register">Create an account</Link></>} />;
}

function AuthForm({ title, subtitle, submit, error, fields, setFields, button, footer, register }) {
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}><p className="eyebrow">STAYWELL</p><h1>{title}</h1><p>{subtitle}</p>{register && <label>Full name<input required value={fields.name} onChange={(e) => setFields({ ...fields, name: e.target.value })} /></label>}<label>Email<input required type="email" value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} /></label><label>Password<input required type="password" minLength="8" value={fields.password} onChange={(e) => setFields({ ...fields, password: e.target.value })} /></label>{error && <div className="error">{error}</div>}<button type="submit">{button}</button><small>{footer}</small></form></main>;
}
export { AuthForm };
