import { useEffect, useState } from 'react';
import { getLegalDocument, getLegalDocumentSync } from '@/api/legal';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { parseMarkdownLiteSections } from '@/lib/markdownLite';
import LegalPageLayout from './LegalPageLayout';

export default function TermsPage() {
  const [doc, setDoc] = useState(() => getLegalDocumentSync('terms'));

  useEffect(() => {
    let cancelled = false;
    getLegalDocument('terms').then((fetched) => {
      if (!cancelled) setDoc(fetched);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useDocumentMeta(
    `${doc.title} — Towera`,
    'The terms governing use of Towera and Towera Studio, including the contributor license for submitted translations and voice recordings.'
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
