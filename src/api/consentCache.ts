const CACHE_KEY = 'towera_contributor_consent';

interface ConsentRecord {
  termsUpdatedAt: string;
  privacyUpdatedAt: string;
  acceptedAt: string;
}

function readCache(): Record<string, ConsentRecord> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, ConsentRecord>): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

/**
 * Consent is tied to the exact version (updatedAt) of the Terms/Privacy docs
 * the user agreed to, so an Admin editing either one — via /studio/admin/legal
 * — invalidates prior consent and the modal reappears next time that
 * contributor opens the Contribute section.
 */
export function hasConsented(userId: number, termsUpdatedAt: string, privacyUpdatedAt: string): boolean {
  const record = readCache()[String(userId)];
  return !!record && record.termsUpdatedAt === termsUpdatedAt && record.privacyUpdatedAt === privacyUpdatedAt;
}

export function recordConsent(userId: number, termsUpdatedAt: string, privacyUpdatedAt: string): void {
  const cache = readCache();
  cache[String(userId)] = { termsUpdatedAt, privacyUpdatedAt, acceptedAt: new Date().toISOString() };
  writeCache(cache);
}
