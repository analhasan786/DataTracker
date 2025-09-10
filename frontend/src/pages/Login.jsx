import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 440, margin: '60px auto' }}>
        <h2>Welcome back</h2>
        <p className="badge">Log in to continue</p>
        <form className="form" onSubmit={onSubmit}>
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
          <button className="primary" type="submit" style={{ width: '100%' }}>Login</button>
        </form>
        {error && <p style={{ color: '#FF6B6B' }}>{error}</p>}
        <hr />
        <p>New here? <Link className="link" to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
