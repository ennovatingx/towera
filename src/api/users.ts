import type { AdminUser, UserRole } from '@/types/studio';
import { fetchAllPages, request } from './client';

export async function listUsers(): Promise<AdminUser[]> {
  return fetchAllPages<AdminUser>('/api/users/');
}

export async function updateUserRole(userId: number, role: UserRole): Promise<AdminUser> {
  return request<AdminUser>(`/api/users/${userId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export async function deleteUser(userId: number): Promise<void> {
  await request<void>(`/api/users/${userId}/`, { method: 'DELETE' });
}
