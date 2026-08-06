import { useCallback, useEffect, useState } from 'react';
import { listTranslations, listUsers, updateUserRole } from '@/api';
import { getDisplayName, type AdminUser, type Translation, type UserRole } from '@/types/studio';
import DataTable, { type DataTableColumn } from '../shared/DataTable';
import EmptyState from '../shared/EmptyState';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [userList, translationList] = await Promise.all([listUsers(), listTranslations()]);
    setUsers(userList);
    setTranslations(translationList);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRoleChange = async (userId: number, role: UserRole) => {
    await updateUserRole(userId, role);
    await load();
  };

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (u) => (
        <div>
          <p className="text-foreground-900">{getDisplayName(u)}</p>
          <p className="text-xs text-foreground-500">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'submissions',
      header: 'Submissions',
      render: (u) => translations.filter((t) => t.contributor === u.id).length,
    },
    { key: 'joined', header: 'Joined', render: (u) => new Date(u.date_joined).toLocaleDateString() },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <select
          value={u.role}
          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
          className="px-2.5 py-1.5 rounded-lg border border-background-300 bg-background-50 text-xs outline-none focus:border-primary-400 transition-colors duration-200 capitalize cursor-pointer"
        >
          <option value="contributor">Contributor</option>
          <option value="reviewer">Reviewer</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
  ];

  if (loading) return <p className="text-sm text-foreground-500">Loading users...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground-900">Users</h1>
        <p className="text-sm text-foreground-500 mt-1">Promote contributors to reviewers, or manage admin access.</p>
      </div>
      <DataTable
        columns={columns}
        rows={users}
        rowKey={(u) => String(u.id)}
        emptyState={<EmptyState icon="ri-team-line" title="No users yet" />}
      />
    </div>
  );
}
