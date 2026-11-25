import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address');
        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/forgot-password', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Request failed. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>Forgot password</h2>
            <p>Enter your account email and we will send you a reset link.</p>
            <form onSubmit={onSubmit}>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {error && <p className="error">{error}</p>}
                {message && <p className="success">{message}</p>}
                <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
            </form>
            <p><Link to="/login">Back to login</Link></p>
        </div>
    );
}
