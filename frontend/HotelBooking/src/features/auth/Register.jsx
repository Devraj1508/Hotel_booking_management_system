import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/context/AuthContext.jsx';
import { AuthForm } from './Login.jsx';

export function Register() {
  const { register } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ name: '', email: '', password: '' }); const [error, setError] = useState('');
  async function submit(event) { event.preventDefault(); setError(''); try { await register(form); navigate('/'); } catch (err) { setError(err.response?.data?.message || 'Unable to create account'); } }
  return <AuthForm title="Make yourself at home" subtitle="Create an account to start booking." submit={submit} error={error} fields={form} setFields={setForm} button="Create account" register footer={<>Already a member? <Link to="/login">Log in</Link></>} />;
}
