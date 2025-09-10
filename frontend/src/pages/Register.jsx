import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (e) {
      setError(e?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: '60px auto' }}>
        <h2>Create account</h2>
        <p className="badge">It takes less than a minute</p>
        <form className="form" onSubmit={onSubmit}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
          <button className="primary" type="submit" style={{ width: '100%' }}>Register</button>
        </form>
        {error && <p style={{ color: '#FF6B6B' }}>{error}</p>}
        <hr />
        <p>Already have an account? <Link className="link" to="/login">Login</Link></p>
      </div>
    </div>
  );
}
