import { useCallback, useEffect, useState } from 'react';
import { createPhrase, deletePhrase, listLanguages, listPhrases, updatePhrase } from '@/api';
import type { Language, Phrase } from '@/types/studio';
import { formatNaira, weightToNaira } from '@/lib/payout';
import DataTable, { type DataTableColumn } from '../shared/DataTable';
import EntityFormModal from '../shared/EntityFormModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import EmptyState from '../shared/EmptyState';

const WEIGHT_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const weight = Number(((i + 1) / 10).toFixed(1));
  return { value: String(weight), label: `${weight.toFixed(1)} — ${formatNaira(weightToNaira(weight))}` };
});

export default function PhrasesPage() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Phrase | null | 'new'>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [phraseList, languageList] = await Promise.all([listPhrases(), listLanguages()]);
    setPhrases(phraseList);
    setLanguages(languageList);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (values: Record<string, string>) => {
    const payload = {
      text: values.text,
      source_language: Number(values.source_language),
      category: values.category || undefined,
      notes: values.notes || undefined,
      weight: Number(values.weight),
    };
    if (modal === 'new') {
      await createPhrase(payload);
    } else if (modal) {
      await updatePhrase(modal.id, payload);
    }
    setModal(null);
    await load();
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    setError(null);
    try {
      await deletePhrase(pendingDeleteId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete');
    } finally {
      setPendingDeleteId(null);
    }
  };

  const filtered = phrases.filter((p) => p.text.toLowerCase().includes(search.toLowerCase()));

  const columns: DataTableColumn<Phrase>[] = [
    { key: 'text', header: 'Phrase', render: (p) => <span className="text-foreground-900">{p.text}</span> },
    { key: 'source_language', header: 'Source language', render: (p) => p.source_language_name },
    { key: 'category', header: 'Category', render: (p) => p.category || '—' },
    {
      key: 'weight',
      header: 'Weight',
      render: (p) => (
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-800">
          {p.weight.toFixed(1)} — {formatNaira(weightToNaira(p.weight))}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setModal(p)} aria-label="Edit phrase" className="text-foreground-500 hover:text-foreground-800 cursor-pointer">
            <i className="ri-edit-line" />
          </button>
          <button type="button" onClick={() => setPendingDeleteId(p.id)} aria-label="Delete phrase" className="text-accent-500 hover:text-accent-700 cursor-pointer">
            <i className="ri-delete-bin-line" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <p className="text-sm text-foreground-500">Loading phrases...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Phrases</h1>
          <p className="text-sm text-foreground-500 mt-1">Source prompts contributors translate.</p>
        </div>
        <button
          type="button"
          onClick={() => setModal('new')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line" />
          Add phrase
        </button>
      </div>

      {error && <p className="text-sm text-accent-600 mb-4">{error}</p>}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search phrases..."
        className="w-full max-w-sm mb-4 px-3 py-2 rounded-xl border border-background-300 bg-background-50 text-sm outline-none focus:border-primary-400 transition-colors duration-200"
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(p) => String(p.id)}
        emptyState={
          <EmptyState icon="ri-chat-quote-line" title="No phrases found" description="Add a phrase or adjust your search." />
        }
      />

      <EntityFormModal
        open={modal !== null}
        title={modal === 'new' ? 'Add phrase' : 'Edit phrase'}
        fields={[
          { name: 'text', label: 'Phrase text', type: 'textarea', required: true },
          {
            name: 'source_language',
            label: 'Source language',
            type: 'select',
            required: true,
            options: languages.map((l) => ({ value: String(l.id), label: l.name })),
          },
          { name: 'category', label: 'Category', placeholder: 'greeting, proverb, conversation...' },
          { name: 'notes', label: 'Notes', type: 'textarea' },
          {
            name: 'weight',
            label: 'Payout weight',
            type: 'select',
            required: true,
            options: WEIGHT_OPTIONS,
          },
        ]}
        initialValues={
          modal && modal !== 'new'
            ? {
                text: modal.text,
                source_language: String(modal.source_language),
                category: modal.category ?? '',
                notes: modal.notes ?? '',
                weight: modal.weight.toFixed(1),
              }
            : { weight: '0.1' }
        }
        onSubmit={handleSave}
        onClose={() => setModal(null)}
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete phrase?"
        description="This can't be undone. Deletion is blocked if translations already exist for it."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
