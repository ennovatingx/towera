import type { LegalDocument, LegalDocumentType } from '@/types/studio';
import { request } from './client';
import { getCachedLegalDocument, setCachedLegalDocument } from './legalDocumentCache';
import { DEFAULT_LEGAL_DOCUMENTS } from './legalDocumentDefaults';

// Known seam: there's no legal-documents endpoint in the current API spec.
// This assumes a future GET/PUT /api/legal-documents/{type}/ (public read,
// admin-only write). Until the backend adds it, getLegalDocument() falls back
// to a per-device localStorage cache and then to the bundled default content,
// and updateLegalDocument() writes to that same cache — so an Admin's edits on
// /studio/admin/legal genuinely persist on their device even though the PUT
// itself is a no-op today.

interface RawLegalDocument {
  type: LegalDocumentType;
  title: string;
  content: string;
  updated_at: string;
}

function fromRaw(raw: RawLegalDocument): LegalDocument {
  return { type: raw.type, title: raw.title, content: raw.content, updatedAt: raw.updated_at };
}

/** Synchronous best-effort read (cache, then bundled default) — no network wait. */
export function getLegalDocumentSync(type: LegalDocumentType): LegalDocument {
  return getCachedLegalDocument(type) ?? DEFAULT_LEGAL_DOCUMENTS[type];
}

export async function getLegalDocument(type: LegalDocumentType): Promise<LegalDocument> {
  try {
    const raw = await request<RawLegalDocument>(`/api/legal-documents/${type}/`, { skipAuth: true });
    const doc = fromRaw(raw);
    setCachedLegalDocument(doc);
    return doc;
  } catch {
    return getLegalDocumentSync(type);
  }
}

export interface UpdateLegalDocumentInput {
  title: string;
  content: string;
}

export async function updateLegalDocument(
  type: LegalDocumentType,
  input: UpdateLegalDocumentInput
): Promise<LegalDocument> {
  const doc: LegalDocument = { type, title: input.title, content: input.content, updatedAt: new Date().toISOString() };
  try {
    await request<RawLegalDocument>(`/api/legal-documents/${type}/`, {
      method: 'PUT',
      body: JSON.stringify({ title: input.title, content: input.content }),
    });
  } catch {
    // Backend doesn't support this yet — the localStorage write below is what
    // actually makes the edit stick on this device.
  }
  setCachedLegalDocument(doc);
  return doc;
}
