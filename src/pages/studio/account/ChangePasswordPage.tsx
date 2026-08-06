import { useState } from 'react';
import { changePassword } from '@/api';

const fieldClasses =
  'w-full px-3 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-900 outline-none focus:border-primary-400 transition-colors duration-200';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await changePassword({ oldPassword, newPassword });
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Change password</h1>
        <p className="text-sm text-foreground-500 mt-1">Update the password for your account.</p>
      </div>

      <div className="bg-background-50 border border-background-200 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground-600 mb-1">Current password</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={fieldClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-600 mb-1">New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={fieldClasses}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground-600 mb-1">Confirm new password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldClasses}
            />
          </div>
          {error && <p className="text-sm text-accent-600">{error}</p>}
          {success && <p className="text-sm text-primary-600">Password updated.</p>}
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
