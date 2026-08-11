import { useEffect, useState } from 'react';
import { getLegalDocument, getLegalDocumentSync } from '@/api/legal';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { parseMarkdownLiteSections } from '@/lib/markdownLite';
import LegalPageLayout from './LegalPageLayout';

export default function LicensesPage() {
  const [doc, setDoc] = useState(() => getLegalDocumentSync('licenses'));

  useEffect(() => {
    let cancelled = false;
    getLegalDocument('licenses').then((fetched) => {
      if (!cancelled) setDoc(fetched);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useDocumentMeta(
    `${doc.title} — Towera`,
    'How organizations can license structured Nigerian-language datasets from Towera, including license tiers, permitted uses, and restrictions.'
  );

  const { intro, sections } = parseMarkdownLiteSections(doc.content);

  return (
    <LegalPageLayout
      title={doc.title}
      lastUpdated={new Date(doc.updatedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
      intro={intro}
      sections={sections}
    />
  );
}
