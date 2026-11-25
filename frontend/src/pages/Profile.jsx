import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: '', bio: '', avatarUrl: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api
            .get('/api/profile')
            .then(({ data }) => {
                setProfile(data);
                setForm({ name: data.name || '', bio: data.bio || '', avatarUrl: data.avatarUrl || '' });
            })
            .catch((err) => setError(err.response?.data?.message || 'Could not load profile'));
    }, []);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!form.name.trim()) return setError('Name is required');
        if (form.bio.length > 500) return setError('Bio must be 500 characters or less');
        if (form.avatarUrl && !/^https?:\/\/\S+$/.test(form.avatarUrl)) return setError('Avatar must be a valid http(s) URL');
        setSaving(true);
        try {
            const { data } = await api.put('/api/profile', form);
            setProfile(data);
            updateUser({ name: data.name });
            setSuccess('Profile updated');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not save profile');
        } finally {
            setSaving(false);
        }
    };

    if (!profile) return <div className="container">{error ? <p className="error">{error}</p> : 'Loading...'}</div>;

    return (
        <div className="card">
            <h2>My Profile</h2>
            {form.avatarUrl && (
                <img
                    key={form.avatarUrl}
                    className="avatar"
                    src={form.avatarUrl}
                    alt="Avatar"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
            )}
            <form onSubmit={onSubmit}>
                <label>Email</label>
                <input className="readonly" value={profile.email} readOnly />
                <label>Role</label>
                <input className="readonly" value={profile.role} readOnly />
                <label>Name</label>
                <input name="name" value={form.name} onChange={onChange} />
                <label>Bio</label>
                <textarea name="bio" rows={4} value={form.bio} onChange={onChange} />
                <label>Avatar URL</label>
                <input name="avatarUrl" value={form.avatarUrl} onChange={onChange} placeholder="https://..." />
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
            </form>
            <p><Link to="/change-password">Change password</Link></p>
        </div>
    );
}