"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

const VerifyEmail: React.FC = () => {
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setError('Invalid or missing verification token.');
      setMessage('');
      return;
    }
    api.get(`/auth/verify-email?token=${token}`)
      .then(res => {
        setMessage(res.data.message || 'Email verified successfully! You can now log in.');
        setTimeout(() => router.push('/Login'), 2500);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Verification failed.');
        setMessage('');
      });
  }, [router]);

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20, textAlign: 'center' }}>
      <h2>Email Verification</h2>
      {message && (
        <div style={{ color: 'green', marginTop: 20 }}>
          {message.includes('verified')
            ? `${message} If you are an admin, please wait for super admin approval before logging in.`
            : message}
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 20 }}>{error}</div>}
      {!error && !message && <div>Loading...</div>}
    </div>
  );
};

export default VerifyEmail; 