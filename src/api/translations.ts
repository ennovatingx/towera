import type { Translation, TranslationStatus } from '@/types/studio';
import { fetchAllPages, request } from './client';

export interface SubmitTranslationInput {
  phraseId: number;
  languageId: number;
  dialectId?: number | null;
  text: string;
}

export interface TranslationFilter {
  status?: TranslationStatus;
  languageId?: number;
  contributorId?: number;
  phraseId?: number;
  dialectId?: number;
}

export async function listTranslations(filter?: TranslationFilter): Promise<Translation[]> {
  return fetchAllPages<Translation>('/api/translations/', {
    status: filter?.status,
    language: filter?.languageId,
    contributor: filter?.contributorId,
    phrase: filter?.phraseId,
    dialect: filter?.dialectId,
  });
}

export async function getTranslation(id: number): Promise<Translation | null> {
  try {
    return await request<Translation>(`/api/translations/${id}/`);
  } catch {
    return null;
  }
}

export async function submitTranslation(input: SubmitTranslationInput): Promise<Translation> {
  return request<Translation>('/api/translations/', {
    method: 'POST',
    body: JSON.stringify({
      phrase: input.phraseId,
      language: input.languageId,
      dialect: input.dialectId ?? null,
      text: input.text,
    }),
  });
}

export async function updateTranslationText(id: number, text: string): Promise<Translation> {
  return request<Translation>(`/api/translations/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ text }),
  });
}
