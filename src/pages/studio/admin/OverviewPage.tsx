import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { listLanguages, listPhrases, listTranslations, listUsers } from '@/api';
import { getDisplayName, type AdminUser, type Language, type Phrase, type Translation } from '@/types/studio';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

interface StatTile {
  label: string;
  value: number;
  icon: string;
}

export default function OverviewPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [langs, phraseList, translationList, userList] = await Promise.all([
        listLanguages(),
        listPhrases(),
        listTranslations(),
        listUsers(),
      ]);
      setLanguages(langs);
      setPhrases(phraseList);
      setTranslations(translationList);
      setUsers(userList);
      setLoading(false);
    })();
  }, []);

  const pending = translations.filter((t) => t.status === 'pending').length;
  const approved = translations.filter((t) => t.status === 'approved').length;
  const rejected = translations.filter((t) => t.status === 'rejected').length;

  const tiles: StatTile[] = [
    { label: 'Languages', value: languages.length, icon: 'ri-translate-2' },
    { label: 'Phrases', value: phrases.length, icon: 'ri-chat-quote-line' },
    { label: 'Pending review', value: pending, icon: 'ri-time-line' },
    { label: 'Approved', value: approved, icon: 'ri-check-double-line' },
    { label: 'Contributors', value: users.filter((u) => u.role === 'contributor').length, icon: 'ri-team-line' },
  ];

  const chartData = languages.map((lang) => {
    const langTranslations = translations.filter((t) => t.language === lang.id);
    return {
      name: lang.name,
      Approved: langTranslations.filter((t) => t.status === 'approved').length,
      Pending: langTranslations.filter((t) => t.status === 'pending').length,
      Rejected: langTranslations.filter((t) => t.status === 'rejected').length,
    };
  });

  const recent = [...translations].sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 8);

  if (loading) {
    return <p className="text-sm text-foreground-500">Loading overview...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Overview</h1>
        <p className="text-sm text-foreground-500 mt-1">A snapshot of the Towera Studio dataset.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {tiles.map((tile) => (
          <div key={tile.label} className="bg-background-50 border border-background-200 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <i className={`${tile.icon} text-primary-600`} />
            </div>
            <div className="font-heading text-2xl text-foreground-900">{tile.value}</div>
            <div className="text-xs text-foreground-500 mt-0.5">{tile.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-background-50 border border-background-200 rounded-2xl p-5 mb-8">
        <h2 className="font-heading text-lg text-foreground-900 mb-4">Translations by language</h2>
        {chartData.length === 0 ? (
          <EmptyState icon="ri-bar-chart-line" title="No languages yet" description="Add a language to see status breakdowns here." />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--background-200))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Approved" fill="oklch(var(--primary-500))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pending" fill="oklch(var(--background-500))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Rejected" fill="oklch(var(--accent-500))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-background-50 border border-background-200 rounded-2xl p-5">
        <h2 className="font-heading text-lg text-foreground-900 mb-4">Recent activity</h2>
        {recent.length === 0 ? (
          <EmptyState icon="ri-inbox-line" title="No submissions yet" description="Translations will show up here once contributors start submitting." />
        ) : (
          <div className="space-y-3">
            {recent.map((t) => {
              const phrase = phrases.find((p) => p.id === t.phrase);
              const contributor = users.find((u) => u.id === t.contributor);
              return (
                <div key={t.id} className="flex items-center justify-between gap-4 py-2 border-b border-background-200 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground-900 truncate">{phrase?.text ?? 'Unknown phrase'}</p>
                    <p className="text-xs text-foreground-500">{contributor ? getDisplayName(contributor) : 'Unknown contributor'}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
