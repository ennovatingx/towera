import { useCallback, useEffect, useState } from 'react';
import { createPayoutRequest, listPayoutAccounts, listPayoutRequests, listPhrases, listTranslations } from '@/api';
import type { Phrase, PayoutAccount, PayoutRequest, PayoutRequestStatus, Translation } from '@/types/studio';
import { formatNaira, weightToNaira } from '@/lib/payout';
import { useStudioAuth } from '../layout/useStudioAuth';
import EmptyState from '../shared/EmptyState';
import EntityFormModal from '../shared/EntityFormModal';
import AddPayoutAccountModal from './components/AddPayoutAccountModal';

type PayoutTab = 'accounts' | 'requests';

function payoutStatusMeta(status: PayoutRequestStatus): { label: string; className: string } {
  switch (status) {
    case 'approved':
      return { label: 'Approved', className: 'bg-primary-100 text-primary-800' };
    case 'in_review':
      return { label: 'In review', className: 'bg-accent-100 text-accent-800' };
    default:
      return { label: 'Pending', className: 'bg-background-200 text-foreground-600' };
  }
}

function tabClasses(active: boolean): string {
  return `px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer ${
    active ? 'border-primary-500 text-foreground-900' : 'border-transparent text-foreground-500 hover:text-foreground-800'
  }`;
}

export default function EarningsPage() {
  const { user } = useStudioAuth();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<PayoutTab>('accounts');
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showRequestPayout, setShowRequestPayout] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [mine, phraseList] = await Promise.all([
        listTranslations({ contributorId: user.id, status: 'approved' }),
        listPhrases(),
      ]);
      setTranslations(mine.sort((a, b) => b.created_at.localeCompare(a.created_at)));
      setPhrases(phraseList);
      setLoading(false);
    })();
  }, [user]);

  const loadPayoutData = useCallback(async () => {
    try {
      const [accounts, requests] = await Promise.all([listPayoutAccounts(), listPayoutRequests()]);
      setPayoutAccounts(accounts);
      setPayoutRequests(requests.sort((a, b) => b.created_at.localeCompare(a.created_at)));
      setPayoutError(null);
    } catch (err) {
      setPayoutError(err instanceof Error ? err.message : 'Could not load payout data');
    }
  }, []);

  useEffect(() => {
    loadPayoutData();
  }, [loadPayoutData]);

  const handleRequestPayout = async (values: Record<string, string>) => {
    await createPayoutRequest({ amount: Number(values.amount), payoutAccountId: Number(values.payout_account) });
    setShowRequestPayout(false);
    await loadPayoutData();
  };

  if (loading) return <p className="text-sm text-foreground-500">Loading earnings...</p>;

  const rows = translations
    .map((translation) => ({ translation, phrase: phrases.find((p) => p.id === translation.phrase) }))
    .filter((row): row is { translation: Translation; phrase: Phrase } => Boolean(row.phrase));

  const total = rows.reduce((sum, row) => sum + weightToNaira(row.phrase.weight), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Earnings</h1>
        <p className="text-sm text-foreground-500 mt-1">Your payout for approved translations.</p>
      </div>

      <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-6 mb-6 max-w-xs">
        <p className="text-xs font-medium text-white/80 mb-1">Total earned</p>
        <p className="font-heading text-4xl text-white">{formatNaira(total)}</p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon="ri-wallet-3-line"
          title="No earnings yet"
          description="Approved translations will show up here with their payout."
        />
      ) : (
        <div className="space-y-3">
          {rows.map(({ translation, phrase }) => (
            <div
              key={translation.id}
              className="bg-background-50 border border-background-200 rounded-2xl p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <span className="text-xs font-medium text-foreground-500 uppercase tracking-wide">
                  {translation.language_name}
                </span>
                <p className="text-sm text-foreground-900 mt-1 truncate">{phrase.text}</p>
              </div>
              <span className="text-sm font-medium text-primary-700 shrink-0">
                {formatNaira(weightToNaira(phrase.weight))}
              </span>
            </div>
          ))}
        </div>
      )}

      {payoutError && <p className="text-sm text-accent-600 mt-8 mb-2">{payoutError}</p>}

      <div className="mt-10">
        <div className="flex items-center gap-1 border-b border-background-200 mb-5">
          <button type="button" onClick={() => setActiveTab('accounts')} className={tabClasses(activeTab === 'accounts')}>
            Payout accounts
          </button>
          <button type="button" onClick={() => setActiveTab('requests')} className={tabClasses(activeTab === 'requests')}>
            Payout requests
          </button>
        </div>

        {activeTab === 'accounts' ? (
          <div>
            <div className="flex items-center justify-end mb-4">
              <button
                type="button"
                onClick={() => setShowAddAccount(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer"
              >
                <i className="ri-add-line" />
                Add payout
              </button>
            </div>

            {payoutAccounts.length === 0 ? (
              <EmptyState
                icon="ri-bank-line"
                title="No payout account yet"
                description="Add a bank account before requesting a payout."
              />
            ) : (
              <div className="space-y-2">
                {payoutAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between bg-background-50 border border-background-200 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground-900">{account.bank_name}</p>
                      <p className="text-xs text-foreground-500">
                        {account.account_name} · {account.account_number}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-end mb-4">
              <button
                type="button"
                onClick={() => setShowRequestPayout(true)}
                disabled={payoutAccounts.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-background-300 text-foreground-700 hover:bg-background-100 transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                <i className="ri-send-plane-line" />
                Request payout
              </button>
            </div>

            {payoutRequests.length === 0 ? (
              <EmptyState
                icon="ri-history-line"
                title="No payout requests yet"
                description="Requests you make will show up here as pending, in review, then approved."
              />
            ) : (
              <div className="space-y-2">
                {payoutRequests.map((req) => {
                  const meta = payoutStatusMeta(req.status);
                  return (
                    <div
                      key={req.id}
                      className="flex items-center justify-between bg-background-50 border border-background-200 rounded-xl px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground-900">{formatNaira(req.amount)}</p>
                        <p className="text-xs text-foreground-500">{new Date(req.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${meta.className}`}>
                        {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <AddPayoutAccountModal open={showAddAccount} onClose={() => setShowAddAccount(false)} onSaved={loadPayoutData} />

      <EntityFormModal
        open={showRequestPayout}
        title="Request payout"
        submitLabel="Request"
        fields={[
          { name: 'amount', label: 'Amount (₦)', required: true, placeholder: '5000' },
          {
            name: 'payout_account',
            label: 'Payout account',
            type: 'select',
            required: true,
            options: payoutAccounts.map((a) => ({
              value: String(a.id),
              label: `${a.bank_name} — ${a.account_number}`,
            })),
          },
        ]}
        onSubmit={handleRequestPayout}
        onClose={() => setShowRequestPayout(false)}
      />
    </div>
  );
}
