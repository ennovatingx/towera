import { Navigate } from 'react-router-dom';
import { useStudioAuth } from './useStudioAuth';

export default function DashboardRedirect() {
  const { user } = useStudioAuth();
  if (!user) return <Navigate to="/studio/login" replace />;
  const target =
    user.role === 'admin' ? '/studio/admin' : user.role === 'reviewer' ? '/studio/review' : '/studio/contribute';
  return <Navigate to={target} replace />;
}
