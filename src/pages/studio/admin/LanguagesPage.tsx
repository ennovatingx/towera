import { useCallback, useEffect, useState } from 'react';
import {
  createDialect,
  createLanguage,
  deleteDialect,
  deleteLanguage,
  listDialects,
  listLanguages,
  updateDialect,
  updateLanguage,
} from '@/api';
import type { Dialect, Language } from '@/types/studio';
import EntityFormModal from '../shared/EntityFormModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import EmptyState from '../shared/EmptyState';

type PendingDelete = { kind: 'language'; id: number } | { kind: 'dialect'; id: number };

export default function LanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [dialects, setDialects] = useState<Dialect[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [languageModal, setLanguageModal] = useState<Language | null | 'new'>(null);
  const [dialectModal, setDialectModal] = useState<{ languageId: number; dialect: Dialect | null } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const load = useCallback(async () => {
    const [langs, dias] = await Promise.all([listLanguages(), listDialects()]);
    setLanguages(langs);
    setDialects(dias);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveLanguage = async (values: Record<string, string>) => {
    if (languageModal === 'new') {
      await createLanguage({ name: values.name, code: values.code || undefined });
    } else if (languageModal) {
      await updateLanguage(languageModal.id, { name: values.name, code: values.code || undefined });
    }
    setLanguageModal(null);
    await load();
  };

  const handleToggleActive = async (language: Language) => {
    await updateLanguage(language.id, { is_active: !language.is_active });
    await load();
  };

  const handleSaveDialect = async (values: Record<string, string>) => {
    if (!dialectModal) return;
    if (dialectModal.dialect) {
      await updateDialect(dialectModal.dialect.id, { name: values.name, region: values.region });
    } else {
      await createDialect({ language: dialectModal.languageId, name: values.name, region: values.region });
    }
    setDialectModal(null);
    await load();
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setError(null);
    try {
      if (pendingDelete.kind === 'language') {
        await deleteLanguage(pendingDelete.id);
      } else {
        await deleteDialect(pendingDelete.id);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete');
    } finally {
      setPendingDelete(null);
    }
  };

  if (loading) return <p className="text-sm text-foreground-500">Loading languages...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Languages</h1>
          <p className="text-sm text-foreground-500 mt-1">Manage languages and their dialects.</p>
        </div>
        <button
          type="button"
          onClick={() => setLanguageModal('new')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 transition-colors duration-200 cursor-pointer"
        >
          <i className="ri-add-line" />
          Add language
        </button>
      </div>

      {error && <p className="text-sm text-accent-600 mb-4">{error}</p>}

      {languages.length === 0 ? (
        <EmptyState icon="ri-translate-2" title="No languages yet" description="Add your first language to start collecting phrases and translations." />
      ) : (
        <div className="space-y-3">
          {languages.map((lang) => {
            const langDialects = dialects.filter((d) => d.language === lang.id);
            const isExpanded = expanded === lang.id;
            return (
              <div key={lang.id} className="bg-background-50 border border-background-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : lang.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                >
                  <div>
                    <p className="font-heading text-base text-foreground-900">
                      {lang.name} {lang.code && <span className="text-foreground-400 text-sm">({lang.code})</span>}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(lang);
                      }}
                      className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer ${
                        lang.is_active ? 'bg-primary-100 text-primary-800' : 'bg-background-200 text-foreground-600'
                      }`}
                    >
                      {lang.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground-500">{langDialects.length} dialects</span>
                    <i className={`ri-arrow-down-s-line text-foreground-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-background-200 pt-4">
                    <div className="flex items-center justify-end gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setLanguageModal(lang)}
                        className="text-xs font-medium text-foreground-600 hover:text-foreground-900 cursor-pointer"
                      >
                        <i className="ri-edit-line mr-1" />
                        Edit language
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete({ kind: 'language', id: lang.id })}
                        className="text-xs font-medium text-accent-600 hover:text-accent-700 cursor-pointer"
                      >
                        <i className="ri-delete-bin-line mr-1" />
                        Delete
                      </button>
                    </div>
                    <div className="space-y-2">
                      {langDialects.map((dialect) => (
                        <div key={dialect.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-background-100">
                          <div>
                            <span className="text-sm text-foreground-800">{dialect.name}</span>
                            {dialect.region && <span className="text-xs text-foreground-500 ml-2">{dialect.region}</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setDialectModal({ languageId: lang.id, dialect })}
                              aria-label={`Edit ${dialect.name}`}
                              className="text-xs text-foreground-500 hover:text-foreground-800 cursor-pointer"
                            >
                              <i className="ri-edit-line" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete({ kind: 'dialect', id: dialect.id })}
                              aria-label={`Delete ${dialect.name}`}
                              className="text-xs text-accent-500 hover:text-accent-700 cursor-pointer"
                            >
                              <i className="ri-delete-bin-line" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDialectModal({ languageId: lang.id, dialect: null })}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
                    >
                      <i className="ri-add-line" />
                      Add dialect
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <EntityFormModal
        open={languageModal !== null}
        title={languageModal === 'new' ? 'Add language' : 'Edit language'}
        fields={[
          { name: 'name', label: 'Name', required: true, placeholder: 'Yoruba' },
          { name: 'code', label: 'ISO code', placeholder: 'yo' },
        ]}
        initialValues={
          languageModal && languageModal !== 'new'
            ? { name: languageModal.name, code: languageModal.code ?? '' }
            : undefined
        }
        onSubmit={handleSaveLanguage}
        onClose={() => setLanguageModal(null)}
      />

      <EntityFormModal
        open={dialectModal !== null}
        title={dialectModal?.dialect ? 'Edit dialect' : 'Add dialect'}
        fields={[
          { name: 'name', label: 'Name', required: true, placeholder: 'Ijebu' },
          { name: 'region', label: 'Region', placeholder: 'e.g. state/province' },
        ]}
        initialValues={dialectModal?.dialect ? { name: dialectModal.dialect.name, region: dialectModal.dialect.region ?? '' } : undefined}
        onSubmit={handleSaveDialect}
        onClose={() => setDialectModal(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete?.kind === 'language' ? 'Delete language?' : 'Delete dialect?'}
        description="This can't be undone. Deletion is blocked if translations still reference it."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
