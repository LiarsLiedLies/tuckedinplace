import { useState } from 'react';
import api from '../api/axios';

export default function ChangePassword() {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!form.currentPassword) return setError('Current password is required');
        if (form.newPassword.length < 8) return setError('New password must be at least 8 characters');
        if (form.newPassword !== form.confirmPassword) return setError('New password and confirmation do not match');
        if (form.newPassword === form.currentPassword) return setError('New password must be different from the current password');
        setLoading(true);
        try {
            await api.post('/api/profile/change-password', form);
            setSuccess('Password changed successfully');
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Could not change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>Change password</h2>
            <form onSubmit={onSubmit}>
                <label>Current password</label>
                <input name="currentPassword" type="password" value={form.currentPassword} onChange={onChange} />
                <label>New password</label>
                <input name="newPassword" type="password" value={form.newPassword} onChange={onChange} />
                <label>Confirm new password</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} />
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Change password'}</button>
            </form>
        </div>
    );
}