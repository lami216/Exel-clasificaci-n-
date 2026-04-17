import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
  const { login, isAuthenticated, isAuthLoading } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      nav('/admin/dashboard', { replace: true });
    }
  }, [isAuthLoading, isAuthenticated, nav]);

  const submit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      setSuccessMessage('Login successful. Redirecting to dashboard...');
      nav('/admin/dashboard', { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed. Check your email and password.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container narrow">
      <h2>Admin Login</h2>
      <form onSubmit={submit} className="admin-login-form">
        <label htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="form-error" role="alert">{error}</p>}
        {successMessage && <p className="form-success">{successMessage}</p>}
      </form>
    </div>
  );
};

export default AdminLoginPage;
