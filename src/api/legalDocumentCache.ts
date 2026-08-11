import type { LegalDocument, LegalDocumentType } from '@/types/studio';

const CACHE_KEY = 'towera_legal_documents';

function readCache(): Partial<Record<LegalDocumentType, LegalDocument>> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCache(cache: Partial<Record<LegalDocumentType, LegalDocument>>): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function getCachedLegalDocument(type: LegalDocumentType): LegalDocument | undefined {
  return readCache()[type];
}

export function setCachedLegalDocument(doc: LegalDocument): void {
  const cache = readCache();
  cache[doc.type] = doc;
  writeCache(cache);
}
