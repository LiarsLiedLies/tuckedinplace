import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
    const [params] = useSearchParams();
    const token = params.get('token');
    const navigate = useNavigate();
    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.newPassword.length < 8) return setError('Password must be at least 8 characters');
        if (form.newPassword !== form.confirmPassword) return setError('Passwords do not match');
        setLoading(true);
        try {
            await api.post('/api/auth/reset-password', { token, ...form });
            navigate('/login', { state: { reset: true } });
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="card">
                <p className="error">This reset link is missing its token.</p>
                <Link to="/forgot-password">Request a new link</Link>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>Choose a new password</h2>
            <form onSubmit={onSubmit}>
                <label>New password</label>
                <input name="newPassword" type="password" value={form.newPassword} onChange={onChange} />
                <label>Confirm new password</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} />
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Reset password'}</button>
            </form>
        </div>
    );
}