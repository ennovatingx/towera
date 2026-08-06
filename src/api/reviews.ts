import type { Review, ReviewDecision, Translation } from '@/types/studio';
import { fetchAllPages, request } from './client';

export interface ReviewActionInput {
  comment?: string;
}

export interface ReviewFilter {
  translationId?: number;
}

export async function listReviews(filter?: ReviewFilter): Promise<Review[]> {
  return fetchAllPages<Review>('/api/reviews/', { translation: filter?.translationId });
}

async function submitReview(translationId: number, decision: ReviewDecision, comment?: string): Promise<Translation> {
  return request<Translation>(`/api/translations/${translationId}/review/`, {
    method: 'POST',
    body: JSON.stringify({ decision, comment: comment ?? '' }),
  });
}

export async function approveTranslation(translationId: number, input?: ReviewActionInput): Promise<Translation> {
  return submitReview(translationId, 'approved', input?.comment);
}

export async function rejectTranslation(translationId: number, input: ReviewActionInput): Promise<Translation> {
  return submitReview(translationId, 'rejected', input.comment);
}
