import React, { useState } from 'react';
import api, { setToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('invq_token', res.data.token);
      setToken(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
        'Login failed. Check console for details.'
      );
    }
  };

  return (
    <div className="page-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}