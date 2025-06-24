import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [welcome, setWelcome] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setWelcome('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // Show different welcome messages and redirect based on role
      if (res.data.user.role === 'admin') {
        setWelcome('Welcome, Admin! Redirecting to Admin Panel...');
        setTimeout(() => router.push('/Admin'), 1500);
      } else if (res.data.user.role === 'super-admin') {
        setWelcome('Welcome, Super Admin! Redirecting to Super Admin Panel...');
        setTimeout(() => router.push('/SuperAdmin'), 1500);
      } else {
        setWelcome('Welcome! Redirecting to Events...');
        setTimeout(() => router.push('/Events'), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        {welcome && <div style={{ color: 'green', marginTop: 10 }}>{welcome}</div>}
      </form>
    </div>
  );
};

export default Login; 