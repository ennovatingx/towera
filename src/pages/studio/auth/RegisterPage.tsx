import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hasStoredToken, register } from '@/api';
import { useStudioAuth } from '../layout/useStudioAuth';
import AuthShell from './components/AuthShell';

const fieldClasses =
  'w-full px-3 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-900 outline-none focus:border-primary-400 transition-colors duration-200';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { refresh } = useStudioAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
      await register({ username, email: email || undefined, password });
      await refresh();
      navigate('/studio/contribute');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Join Towera Studio"
      subtitle="Sign up as a contributor to submit translations and pronunciation audio."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/studio/login" className="text-primary-600 font-medium hover:text-primary-700">
            Log in
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
          <label className="block text-xs font-medium text-foreground-600 mb-1">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClasses}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground-600 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClasses}
          />
        </div>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-background-300 text-primary-600 focus:ring-primary-400 cursor-pointer"
          />
          <span className="text-xs text-foreground-600 leading-relaxed">
            I agree to Towera's{' '}
            <Link to="/terms" target="_blank" className="text-primary-600 font-medium hover:text-primary-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" target="_blank" className="text-primary-600 font-medium hover:text-primary-700">
              Privacy Policy
            </Link>
            , including how my submitted translations and voice recordings may be used.
          </span>
        </label>
        {error && <p className="text-sm text-accent-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !agreedToTerms}
          className="w-full py-2.5 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
