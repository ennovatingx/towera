import type { Language } from '@/types/studio';
import { fetchAllPages, request } from './client';

export interface CreateLanguageInput {
  name: string;
  code?: string;
  is_active?: boolean;
}

export async function listLanguages(): Promise<Language[]> {
  return fetchAllPages<Language>('/api/languages/');
}

export async function createLanguage(input: CreateLanguageInput): Promise<Language> {
  return request<Language>('/api/languages/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateLanguage(id: number, patch: Partial<CreateLanguageInput>): Promise<Language> {
  return request<Language>(`/api/languages/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function deleteLanguage(id: number): Promise<void> {
  await request<void>(`/api/languages/${id}/`, { method: 'DELETE' });
}
