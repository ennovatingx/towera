import { useCallback, useEffect, useState } from 'react';
import { approveTranslation, listLanguages, listPhrases, listTranslations, listUsers, rejectTranslation } from '@/api';
import { getDisplayName, type AdminUser, type Language, type Phrase, type Translation } from '@/types/studio';
import DataTable, { type DataTableColumn } from '../shared/DataTable';
import StatusBadge from '../shared/StatusBadge';
import EntityFormModal from '../shared/EntityFormModal';
import EmptyState from '../shared/EmptyState';

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [rejectTarget, setRejectTarget] = useState<Translation | null>(null);
  const [detail, setDetail] = useState<Translation | null>(null);

  const load = useCallback(async () => {
    const [translationList, phraseList, languageList, userList] = await Promise.all([
      listTranslations(),
      listPhrases(),
      listLanguages(),
      listUsers(),
    ]);
    setTranslations(translationList);
    setPhrases(phraseList);
    setLanguages(languageList);
    setUsers(userList);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (translation: Translation) => {
    await approveTranslation(translation.id);
    await load();
  };

  const handleReject = async (values: Record<string, string>) => {
    if (!rejectTarget) return;
    await rejectTranslation(rejectTarget.id, { comment: values.comment });
    setRejectTarget(null);
    await load();
  };

  const filtered = translations.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (languageFilter && t.language !== Number(languageFilter)) return false;
    return true;
  });

  const columns: DataTableColumn<Translation>[] = [
    {
      key: 'phrase',
      header: 'Phrase',
      render: (t) => (
        <button type="button" onClick={() => setDetail(t)} className="text-left text-foreground-900 hover:text-primary-600 cursor-pointer">
          {phrases.find((p) => p.id === t.phrase)?.text ?? 'Unknown phrase'}
        </button>
      ),
    },
    { key: 'language', header: 'Language', render: (t) => t.language_name },
    { key: 'contributor', header: 'Contributor', render: (t) => getDisplayName(users.find((u) => u.id === t.contributor) ?? { first_name: '', last_name: '', username: `#${t.contributor}` }) },
    {
      key: 'audio',
      header: 'Audio',
      render: (t) => (t.audio_recordings.length > 0 ? <i className="ri-mic-line text-primary-600" /> : <i className="ri-mic-off-line text-foreground-300" />),
    },
    { key: 'status', header: 'Status', render: (t) => <StatusBadge status={t.status} /> },
    {
      key: 'actions',
      header: '',
      render: (t) =>
        t.status === 'pending' ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApprove(t)}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors duration-200 cursor-pointer"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => setRejectTarget(t)}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent-100 text-accent-800 hover:bg-accent-200 transition-colors duration-200 cursor-pointer"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-foreground-400">Reviewed</span>
        ),
    },
  ];

  if (loading) return <p className="text-sm text-foreground-500">Loading translations...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Translations</h1>
        <p className="text-sm text-foreground-500 mt-1">Review and manage all submitted translations.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm outline-none focus:border-primary-400 transition-colors duration-200"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm outline-none focus:border-primary-400 transition-colors duration-200"
        >
          <option value="">All languages</option>
          {languages.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(t) => String(t.id)}
        emptyState={<EmptyState icon="ri-file-list-3-line" title="No translations found" description="Try a different filter." />}
      />

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-900/40 px-4" onClick={() => setDetail(null)}>
          <div className="w-full max-w-lg bg-background-50 rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg text-foreground-900">Submission detail</h3>
              <button type="button" onClick={() => setDetail(null)} aria-label="Close" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-200 cursor-pointer">
                <i className="ri-close-line text-foreground-500" />
              </button>
            </div>
            <p className="text-xs font-medium text-foreground-500 mb-1">Source phrase</p>
            <p className="text-sm text-foreground-900 mb-4">{phrases.find((p) => p.id === detail.phrase)?.text}</p>
            <p className="text-xs font-medium text-foreground-500 mb-1">Translation</p>
            <p className="text-sm text-foreground-900 mb-4">{detail.text}</p>
            {detail.audio_recordings.length > 0 && (
              <>
                <p className="text-xs font-medium text-foreground-500 mb-1">Pronunciation audio</p>
                <div className="space-y-2 mb-4">
                  {detail.audio_recordings.map((audio) => (
                    <audio key={audio.id} controls src={audio.audio_url} className="w-full" />
                  ))}
                </div>
              </>
            )}
            <StatusBadge status={detail.status} />
          </div>
        </div>
      )}

      <EntityFormModal
        open={rejectTarget !== null}
        title="Reject translation"
        fields={[{ name: 'comment', label: 'Feedback for the contributor', type: 'textarea', required: true }]}
        submitLabel="Reject"
        onSubmit={handleReject}
        onClose={() => setRejectTarget(null)}
      />
    </div>
  );
}
