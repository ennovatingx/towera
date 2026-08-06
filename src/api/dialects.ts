import type { Dialect } from '@/types/studio';
import { fetchAllPages, request } from './client';

export interface CreateDialectInput {
  language: number;
  name: string;
  region?: string;
}

export async function listDialects(languageId?: number): Promise<Dialect[]> {
  return fetchAllPages<Dialect>('/api/dialects/', { language: languageId });
}

export async function createDialect(input: CreateDialectInput): Promise<Dialect> {
  return request<Dialect>('/api/dialects/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateDialect(id: number, patch: Partial<CreateDialectInput>): Promise<Dialect> {
  return request<Dialect>(`/api/dialects/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function deleteDialect(id: number): Promise<void> {
  await request<void>(`/api/dialects/${id}/`, { method: 'DELETE' });
}
