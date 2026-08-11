import { useEffect, useState } from 'react';
import { getLegalDocument, getLegalDocumentSync, updateLegalDocument } from '@/api/legal';
import type { LegalDocument, LegalDocumentType } from '@/types/studio';
import { parseMarkdownLite } from '@/lib/markdownLite';
import { LEGAL_PROSE_CLASSES } from '@/pages/legal/legalProseClasses';

const PUBLIC_PATH: Record<LegalDocumentType, string> = {
  privacy: '/privacy',
  terms: '/terms',
  licenses: '/licenses',
};

function tabClasses(active: boolean): string {
  return `px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer ${
    active ? 'border-primary-500 text-foreground-900' : 'border-transparent text-foreground-500 hover:text-foreground-800'
  }`;
}

export default function LegalDocumentsPage() {
  const [tab, setTab] = useState<LegalDocumentType>('privacy');
  const [docs, setDocs] = useState<Record<LegalDocumentType, LegalDocument>>({
    privacy: getLegalDocumentSync('privacy'),
    terms: getLegalDocumentSync('terms'),
    licenses: getLegalDocumentSync('licenses'),
  });
  const [title, setTitle] = useState(docs.privacy.title);
  const [content, setContent] = useState(docs.privacy.content);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [privacy, terms, licenses] = await Promise.all([
        getLegalDocument('privacy'),
        getLegalDocument('terms'),
        getLegalDocument('licenses'),
      ]);
      if (cancelled) return;
      setDocs({ privacy, terms, licenses });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleTabChange = (next: LegalDocumentType) => {
    setTab(next);
    setTitle(docs[next].title);
    setContent(docs[next].content);
    setSavedMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage(null);
    const updated = await updateLegalDocument(tab, { title, content });
    setDocs((prev) => ({ ...prev, [tab]: updated }));
    setSavedMessage(`Saved on this device — ${new Date(updated.updatedAt).toLocaleString('en-NG')}`);
    setSaving(false);
  };

  const dirty = title !== docs[tab].title || content !== docs[tab].content;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Legal pages</h1>
        <p className="text-sm text-foreground-500 mt-1">
          Edit the Privacy Policy, Terms of Service, and Data Licenses pages shown on the public site.
        </p>
      </div>

      <div className="rounded-2xl border border-accent-200 bg-accent-50 px-5 py-4 mb-6">
        <p className="text-sm text-accent-800 leading-relaxed">
          <strong className="font-semibold">Known limitation:</strong> there's no legal-documents endpoint on the
          backend yet, so saving here writes to this browser's storage only — it won't sync to other admins or
          devices until that ships. Edits that already reached a contributor's browser will re-prompt them for
          consent, since consent is tied to this document's version.
        </p>
      </div>

      <div className="flex items-center gap-1 border-b border-background-200 mb-6">
        <button type="button" onClick={() => handleTabChange('privacy')} className={tabClasses(tab === 'privacy')}>
          Privacy Policy
        </button>
        <button type="button" onClick={() => handleTabChange('terms')} className={tabClasses(tab === 'terms')}>
          Terms of Service
        </button>
        <button type="button" onClick={() => handleTabChange('licenses')} className={tabClasses(tab === 'licenses')}>
          Data Licenses
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-foreground-600">Title</label>
            <a
              href={PUBLIC_PATH[tab]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
            >
              View live page
              <i className="ri-external-link-line" />
            </a>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-900 outline-none focus:border-primary-400 transition-colors duration-200 mb-4"
          />

          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-foreground-600">Content</label>
            <span className="text-xs text-foreground-400">## heading · ### subheading · - bullet · **bold** · [text](url)</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={28}
            spellCheck={false}
            className="w-full px-3 py-3 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-900 font-mono leading-relaxed outline-none focus:border-primary-400 transition-colors duration-200 resize-y"
          />

          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !dirty || !title.trim() || !content.trim()}
              className="px-5 py-2.5 rounded-full text-sm font-medium bg-primary-500 text-background-50 hover:bg-primary-600 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            {savedMessage && <p className="text-xs text-foreground-500">{savedMessage}</p>}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-foreground-600 mb-1">Preview</p>
          <div className="rounded-2xl border border-background-200 bg-background-50 px-6 py-5 max-h-[42rem] overflow-y-auto">
            <article className={LEGAL_PROSE_CLASSES}>{parseMarkdownLite(content)}</article>
          </div>
        </div>
      </div>
    </div>
  );
}
