import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listLanguages, listPhrases, listTranslations } from '@/api';
import type { Language, Phrase, Translation } from '@/types/studio';
import DataTable, { type DataTableColumn } from '../shared/DataTable';
import EmptyState from '../shared/EmptyState';

export default function QueuePage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageFilter, setLanguageFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [pending, phraseList, languageList] = await Promise.all([
        listTranslations({ status: 'pending' }),
        listPhrases(),
        listLanguages(),
      ]);
      setTranslations(pending.sort((a, b) => a.created_at.localeCompare(b.created_at)));
      setPhrases(phraseList);
      setLanguages(languageList);
      setLoading(false);
    })();
  }, []);

  const filtered = languageFilter ? translations.filter((t) => t.language === Number(languageFilter)) : translations;

  const columns: DataTableColumn<Translation>[] = [
    { key: 'phrase', header: 'Phrase', render: (t) => phrases.find((p) => p.id === t.phrase)?.text ?? '—' },
    { key: 'language', header: 'Language', render: (t) => t.language_name },
    // /api/users/ is admin-only, so a Reviewer has no documented way to resolve a contributor's name.
    { key: 'contributor', header: 'Contributor', render: (t) => `Contributor #${t.contributor}` },
    {
      key: 'audio',
      header: 'Audio',
      render: (t) => (t.audio_recordings.length > 0 ? <i className="ri-mic-line text-primary-600" /> : <i className="ri-mic-off-line text-foreground-300" />),
    },
    { key: 'submitted', header: 'Submitted', render: (t) => new Date(t.created_at).toLocaleDateString() },
    {
      key: 'actions',
      header: '',
      render: (t) => (
        <Link
          to={`/studio/review/${t.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer"
        >
          Review
        </Link>
      ),
    },
  ];

  if (loading) return <p className="text-sm text-foreground-500">Loading review queue...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Review queue</h1>
        <p className="text-sm text-foreground-500 mt-1">Submissions waiting for your decision.</p>
      </div>

      <select
        value={languageFilter}
        onChange={(e) => setLanguageFilter(e.target.value)}
        className="mb-4 px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm outline-none focus:border-primary-400 transition-colors duration-200"
      >
        <option value="">All languages</option>
        {languages.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(t) => String(t.id)}
        emptyState={<EmptyState icon="ri-shield-check-line" title="Queue is empty" description="Nothing waiting for review right now." />}
      />
    </div>
  );
}
