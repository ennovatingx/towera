import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getLegalDocument, getLegalDocumentSync, recordConsentRemote } from '@/api';
import { hasConsented, recordConsent } from '@/api/consentCache';
import { useStudioAuth } from '@/pages/studio/layout/useStudioAuth';
import ConsentModal from './ConsentModal';

export default function ContributorConsentGate() {
  const { user } = useStudioAuth();
  const [versions, setVersions] = useState(() => ({
    termsUpdatedAt: getLegalDocumentSync('terms').updatedAt,
    privacyUpdatedAt: getLegalDocumentSync('privacy').updatedAt,
  }));
  const [consented, setConsented] = useState(
    () => !user || hasConsented(user.id, versions.termsUpdatedAt, versions.privacyUpdatedAt)
  );

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const [terms, privacy] = await Promise.all([getLegalDocument('terms'), getLegalDocument('privacy')]);
      if (cancelled) return;
      setVersions({ termsUpdatedAt: terms.updatedAt, privacyUpdatedAt: privacy.updatedAt });
      setConsented(hasConsented(user.id, terms.updatedAt, privacy.updatedAt));
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;

  if (!consented) {
    return (
      <ConsentModal
        onAgree={() => {
          recordConsent(user.id, versions.termsUpdatedAt, versions.privacyUpdatedAt);
          recordConsentRemote(versions).catch(() => {});
          setConsented(true);
        }}
      />
    );
  }

  return <Outlet />;
}
