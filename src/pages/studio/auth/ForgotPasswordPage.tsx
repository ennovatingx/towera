import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '@/api';
import AuthShell from './components/AuthShell';

const fieldClasses =
  'w-full px-3 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-900 outline-none focus:border-primary-400 transition-colors duration-200';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await requestPasswordReset({ email });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to reset your password."
      footer={
        <Link to="/studio/login" className="text-primary-600 font-medium hover:text-primary-700">
          Back to login
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-foreground-700">
          If an account exists for <span className="font-medium">{email}</span>, we&apos;ve sent a link to reset your
          password.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClasses}
            />
          </div>
          {error && <p className="text-sm text-accent-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
