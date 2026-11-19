import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function DashboardView({ title, endpoint, features }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(endpoint)
      .then((res) => setMessage(res.data.message))
      .catch((err) => setError(err.response?.data?.message || `Request failed (${err.response?.status || 'network error'})`));
  }, [endpoint]);

  return (
    <div className="container">
      <h1>{title}</h1>
      <p>Signed in as <strong>{user.name}</strong> ({user.email})</p>
      {error ? <p className="error">{error}</p> : <p className="success">Server says: {message}</p>}
      <h3>Available functions for your role</h3>
      <ul>
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );
}