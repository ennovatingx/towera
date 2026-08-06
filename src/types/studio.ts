export type UserRole = 'admin' | 'contributor' | 'reviewer';
export type TranslationStatus = 'pending' | 'approved' | 'rejected';
export type ReviewDecision = 'approved' | 'rejected';
/** UI-only distinction for how a clip was captured; the backend doesn't track this. */
export type AudioSource = 'recorded' | 'uploaded';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  date_joined: string;
}

export interface AdminUser extends User {
  is_active: boolean;
}

export interface Language {
  id: number;
  name: string;
  code: string | null;
  is_active: boolean;
  created_at: string;
  dialects: Dialect[];
}

export interface Dialect {
  id: number;
  language: number;
  language_name: string;
  name: string;
  region: string;
  created_at: string;
}

export interface Phrase {
  id: number;
  source_language: number;
  source_language_name: string;
  text: string;
  category: string;
  notes: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  /** Payout weight, 0.1–1.0. Not a real backend field yet — see src/api/phrases.ts. */
  weight: number;
}

export interface Translation {
  id: number;
  phrase: number;
  language: number;
  language_name: string;
  dialect: number | null;
  text: string;
  contributor: number;
  status: TranslationStatus;
  reviewed_by: number | null;
  reviewed_at: string | null;
  audio_recordings: AudioRecording[];
  created_at: string;
  updated_at: string;
}

export interface AudioRecording {
  id: number;
  translation: number;
  s3_key: string;
  content_type: string;
  duration_seconds: number | null;
  uploaded_by: number;
  audio_url: string;
  created_at: string;
}

export interface Review {
  id: number;
  translation: number;
  reviewer: number;
  decision: ReviewDecision;
  comment: string;
  created_at: string;
}

export type PayoutRequestStatus = 'pending' | 'in_review' | 'approved';

/** Not a real backend concept yet — see src/api/payouts.ts. */
export interface Bank {
  name: string;
  code: string;
  slug: string;
}

/** Not a real backend concept yet — see src/api/payouts.ts. */
export interface PayoutAccount {
  id: number;
  bank_code: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  created_at: string;
}

/** Not a real backend concept yet — see src/api/payouts.ts. */
export interface PayoutRequest {
  id: number;
  amount: number;
  payout_account: number;
  status: PayoutRequestStatus;
  created_at: string;
}

export interface DatasetRow {
  phrase_id: number;
  source_language: string;
  source_text: string;
  category: string;
  target_language: string;
  dialect: string;
  translation_text: string;
  contributor: string;
  status: string;
  audio_s3_key: string;
  audio_url: string;
  created_at: string;
}

export function getDisplayName(user: Pick<User, 'first_name' | 'last_name' | 'username'>): string {
  const fullName = `${user.first_name} ${user.last_name}`.trim();
  return fullName || user.username;
}
