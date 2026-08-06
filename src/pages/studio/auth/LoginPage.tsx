import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hasStoredToken, login } from '@/api';
import { useStudioAuth } from '../layout/useStudioAuth';
import AuthShell from './components/AuthShell';

const fieldClasses =
  'w-full px-3 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-900 outline-none focus:border-primary-400 transition-colors duration-200';

export default function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useStudioAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hasStoredToken()) navigate('/studio/dashboard', { replace: true });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ username, password });
      await refresh();
      navigate('/studio/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue contributing to Towera Studio."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/studio/register" className="text-primary-600 font-medium hover:text-primary-700">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-foreground-600 mb-1">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={fieldClasses}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-foreground-600">Password</label>
            <Link to="/studio/forgot-password" className="text-xs font-medium text-primary-600 hover:text-primary-700">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClasses}
          />
        </div>
        {error && <p className="text-sm text-accent-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer disabled:opacity-60"
        >
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </AuthShell>
  );
}
