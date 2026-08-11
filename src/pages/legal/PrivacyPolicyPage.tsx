import { useEffect, useState } from 'react';
import { getLegalDocument, getLegalDocumentSync } from '@/api/legal';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { parseMarkdownLiteSections } from '@/lib/markdownLite';
import LegalPageLayout from './LegalPageLayout';

export default function PrivacyPolicyPage() {
  const [doc, setDoc] = useState(() => getLegalDocumentSync('privacy'));

  useEffect(() => {
    let cancelled = false;
    getLegalDocument('privacy').then((fetched) => {
      if (!cancelled) setDoc(fetched);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useDocumentMeta(
    `${doc.title} — Towera`,
    'How Towera collects, stores, and uses personal data from contributors and visitors, in line with the Nigeria Data Protection Act 2023.'
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
