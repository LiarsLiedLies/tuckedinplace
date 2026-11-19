import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { dashboardPath } from '../utils/roles';

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Name is required');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address');
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    setLoading(true);
    try {
      await api.post('/api/auth/register', form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create account</h2>
      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} />
        <label>I am a</label>
        <select name="role" value={form.role} onChange={onChange}>
          <option value="USER">Spot Finder (Introvert / User)</option>
          <option value="OWNER">Small Business Owner</option>
        </select>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}