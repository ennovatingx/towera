import { request } from './client';

// Known seam: no consent-tracking endpoint exists in the current API spec.
// A localStorage record (src/api/consentCache.ts) is what actually gates the
// modal today, but that alone isn't defensible proof of consent once a
// browser is cleared — recording it server-side is what the NDPA really
// expects. This call is wired up so it starts working the moment the backend
// adds POST /api/consents/; until then every caller swallows its failure.

export interface RecordConsentInput {
  termsUpdatedAt: string;
  privacyUpdatedAt: string;
}

export async function recordConsentRemote(input: RecordConsentInput): Promise<void> {
  await request<void>('/api/consents/', {
    method: 'POST',
    body: JSON.stringify({ terms_updated_at: input.termsUpdatedAt, privacy_updated_at: input.privacyUpdatedAt }),
  });
}
