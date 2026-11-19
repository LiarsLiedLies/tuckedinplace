import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardPath } from '../utils/roles';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Email and password are required');
    setLoading(true);
    try {
      const u = await login(email, password);
      navigate(dashboardPath(u.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Log in</h2>
      {location.state?.registered && <p className="success">Account created. Please log in.</p>}
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
      </form>
      <p>No account yet? <Link to="/register">Register</Link></p>
    </div>
  );
}