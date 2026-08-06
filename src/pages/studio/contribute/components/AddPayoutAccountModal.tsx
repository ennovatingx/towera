import { useEffect, useState } from 'react';
import { createPayoutAccount, listBanks, resolveAccount } from '@/api';
import type { Bank } from '@/types/studio';

interface AddPayoutAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const fieldClasses =
  'w-full px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-900 outline-none focus:border-primary-400 transition-colors duration-200';

export default function AddPayoutAccountModal({ open, onClose, onSaved }: AddPayoutAccountModalProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setBankCode('');
    setAccountNumber('');
    setResolvedName(null);
    setError(null);
    setBanksLoading(true);
    listBanks()
      .then(setBanks)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load banks'))
      .finally(() => setBanksLoading(false));
  }, [open]);

  if (!open) return null;

  const selectedBank = banks.find((b) => b.code === bankCode);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError(null);
    setResolvedName(null);
    try {
      const resolved = await resolveAccount({ accountNumber, bankCode });
      setResolvedName(resolved.accountName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not verify account');
    } finally {
      setVerifying(false);
    }
  };

  const handleSave = async () => {
    if (!selectedBank || !resolvedName) return;
    setSaving(true);
    setError(null);
    try {
      await createPayoutAccount({
        bankCode: selectedBank.code,
        bankName: selectedBank.name,
        accountNumber,
        accountName: resolvedName,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save account');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-900/40 px-4">
      <div className="w-full max-w-md bg-background-50 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-foreground-900">Add payout account</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-200 transition-colors duration-200 cursor-pointer"
          >
            <i className="ri-close-line text-foreground-500" />
          </button>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground-600 mb-1">Bank</label>
            <select
              value={bankCode}
              onChange={(e) => {
                setBankCode(e.target.value);
                setResolvedName(null);
              }}
              required
              disabled={banksLoading}
              className={fieldClasses}
            >
              <option value="" disabled>
                {banksLoading ? 'Loading banks...' : 'Select a bank'}
              </option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-600 mb-1">Account number</label>
            <input
              type="text"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value);
                setResolvedName(null);
              }}
              required
              maxLength={10}
              placeholder="0123456789"
              className={fieldClasses}
            />
          </div>

          {resolvedName ? (
            <div className="rounded-xl bg-primary-50 border border-primary-200 px-3 py-2.5 text-sm text-primary-800">
              <i className="ri-checkbox-circle-line mr-1.5" />
              {resolvedName}
            </div>
          ) : (
            <button
              type="submit"
              disabled={verifying || !bankCode || accountNumber.length < 10}
              className="w-full py-2.5 rounded-full text-sm font-medium border border-background-300 text-foreground-700 hover:bg-background-100 transition-colors duration-200 cursor-pointer disabled:opacity-50"
            >
              {verifying ? 'Verifying...' : 'Verify account'}
            </button>
          )}

          {error && <p className="text-sm text-accent-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm font-medium text-foreground-600 hover:bg-background-200 transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!resolvedName || saving}
              className="px-4 py-2 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
