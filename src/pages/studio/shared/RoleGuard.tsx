import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/types/studio';
import { useStudioAuth } from '../layout/useStudioAuth';

interface RoleGuardProps {
  allow: UserRole[];
}

export default function RoleGuard({ allow }: RoleGuardProps) {
  // StudioAppLayout (the parent route) already blocks rendering <Outlet/> until
  // loading is false and a user is confirmed present, so `user` is safe to read here.
  const { user } = useStudioAuth();
  if (!user) return null;
  if (!allow.includes(user.role)) return <Navigate to="/studio/dashboard" replace />;
  return <Outlet />;
}
