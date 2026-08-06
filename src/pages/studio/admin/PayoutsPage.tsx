import { useEffect, useState } from 'react';
import { listPhrases, listTranslations, listUsers } from '@/api';
import { getDisplayName } from '@/types/studio';
import { formatNaira, weightToNaira } from '@/lib/payout';
import DataTable, { type DataTableColumn } from '../shared/DataTable';
import EmptyState from '../shared/EmptyState';

interface PayoutRow {
  contributorId: number;
  name: string;
  count: number;
  total: number;
}

export default function PayoutsPage() {
  const [rows, setRows] = useState<PayoutRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [translations, phrases, users] = await Promise.all([
        listTranslations({ status: 'approved' }),
        listPhrases(),
        listUsers(),
      ]);

      const totals = new Map<number, { count: number; total: number }>();
      for (const t of translations) {
        const phrase = phrases.find((p) => p.id === t.phrase);
        if (!phrase) continue;
        const entry = totals.get(t.contributor) ?? { count: 0, total: 0 };
        entry.count += 1;
        entry.total += weightToNaira(phrase.weight);
        totals.set(t.contributor, entry);
      }

      const built: PayoutRow[] = Array.from(totals.entries()).map(([contributorId, { count, total }]) => {
        const user = users.find((u) => u.id === contributorId);
        return {
          contributorId,
          name: user ? getDisplayName(user) : `Contributor #${contributorId}`,
          count,
          total,
        };
      });
      built.sort((a, b) => b.total - a.total);
      setRows(built);
      setLoading(false);
    })();
  }, []);

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);

  const columns: DataTableColumn<PayoutRow>[] = [
    { key: 'name', header: 'Contributor', render: (r) => <span className="text-foreground-900">{r.name}</span> },
    { key: 'count', header: 'Approved translations', render: (r) => r.count },
    {
      key: 'total',
      header: 'Payout',
      render: (r) => <span className="font-medium text-primary-700">{formatNaira(r.total)}</span>,
    },
  ];

  if (loading) return <p className="text-sm text-foreground-500">Loading payouts...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Payouts</h1>
        <p className="text-sm text-foreground-500 mt-1">Earnings owed to contributors for approved work.</p>
      </div>

      <div className="bg-background-50 border border-background-200 rounded-2xl p-5 mb-6 max-w-xs">
        <p className="text-xs font-medium text-foreground-500 mb-1">Total owed</p>
        <p className="font-heading text-3xl text-foreground-900">{formatNaira(grandTotal)}</p>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => String(r.contributorId)}
        emptyState={
          <EmptyState
            icon="ri-wallet-3-line"
            title="No payouts yet"
            description="Payouts appear once contributors have approved translations."
          />
        }
      />
    </div>
  );
}
