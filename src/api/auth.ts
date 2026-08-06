import type { User } from '@/types/studio';
import { clearTokens, hasStoredToken, request, setTokens } from './client';

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  password: string;
  email?: string;
}

interface TokenPair {
  access: string;
  refresh: string;
}

export { hasStoredToken };

export async function login(input: LoginInput): Promise<User> {
  const tokens = await request<TokenPair>('/api/auth/token/', {
    method: 'POST',
    body: JSON.stringify(input),
    skipAuth: true,
  });
  setTokens(tokens.access, tokens.refresh);
  const user = await getCurrentUser();
  if (!user) throw new Error('Login succeeded but the user profile could not be loaded');
  return user;
}

export async function register(input: RegisterInput): Promise<User> {
  await request('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify(input),
    skipAuth: true,
  });
  return login({ username: input.username, password: input.password });
}

export async function logout(): Promise<void> {
  clearTokens();
}

export async function getCurrentUser(): Promise<User | null> {
  if (!hasStoredToken()) return null;
  try {
    return await request<User>('/api/auth/me/');
  } catch {
    clearTokens();
    return null;
  }
}

export interface RequestPasswordResetInput {
  email: string;
}

export interface ConfirmPasswordResetInput {
  uid: string;
  token: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

// Known seam: none of the three endpoints below exist in the current API spec yet.
// The `User`/`PatchedUser` schemas behind /api/auth/me/ have no password field, and
// there is no password-reset path documented anywhere in the spec. These call the
// most conventional Django/DRF shape for this kind of flow (matching e.g. djoser's
// reset_password / reset_password_confirm endpoints) as a best guess for whenever
// the backend adds them — until then, all three will fail against the real server.

export async function requestPasswordReset(input: RequestPasswordResetInput): Promise<void> {
  await request('/api/auth/password-reset/', {
    method: 'POST',
    body: JSON.stringify({ email: input.email }),
    skipAuth: true,
  });
}

export async function confirmPasswordReset(input: ConfirmPasswordResetInput): Promise<void> {
  await request('/api/auth/password-reset/confirm/', {
    method: 'POST',
    body: JSON.stringify({ uid: input.uid, token: input.token, new_password: input.newPassword }),
    skipAuth: true,
  });
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
  await request('/api/auth/change-password/', {
    method: 'POST',
    body: JSON.stringify({ old_password: input.oldPassword, new_password: input.newPassword }),
  });
}
