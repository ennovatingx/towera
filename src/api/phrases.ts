import type { Phrase } from '@/types/studio';
import { fetchAllPages, request } from './client';
import { getCachedWeight, setCachedWeight } from './phraseWeightCache';

const DEFAULT_WEIGHT = 0.1;

export interface CreatePhraseInput {
  source_language: number;
  text: string;
  category?: string;
  notes?: string;
  weight: number;
}

export interface PhraseFilter {
  category?: string;
  sourceLanguage?: number;
}

// `weight` isn't a real field on the backend's Phrase model yet, so we merge in
// a localStorage-cached value here — every caller just sees a normal, always-
// populated `weight` regardless of what the server actually returns.
function withWeight(phrase: Phrase): Phrase {
  return { ...phrase, weight: phrase.weight ?? getCachedWeight(phrase.id) ?? DEFAULT_WEIGHT };
}

export async function listPhrases(filter?: PhraseFilter): Promise<Phrase[]> {
  const phrases = await fetchAllPages<Phrase>('/api/phrases/', {
    category: filter?.category,
    source_language: filter?.sourceLanguage,
  });
  return phrases.map(withWeight);
}

export async function getPhrase(id: number): Promise<Phrase | null> {
  try {
    const phrase = await request<Phrase>(`/api/phrases/${id}/`);
    return withWeight(phrase);
  } catch {
    return null;
  }
}

export async function createPhrase(input: CreatePhraseInput): Promise<Phrase> {
  const phrase = await request<Phrase>('/api/phrases/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  setCachedWeight(phrase.id, input.weight);
  return withWeight(phrase);
}

export async function updatePhrase(id: number, patch: Partial<CreatePhraseInput>): Promise<Phrase> {
  const phrase = await request<Phrase>(`/api/phrases/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  if (patch.weight !== undefined) setCachedWeight(id, patch.weight);
  return withWeight(phrase);
}

export async function deletePhrase(id: number): Promise<void> {
  await request<void>(`/api/phrases/${id}/`, { method: 'DELETE' });
}
