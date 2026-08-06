import { Navigate, Outlet } from 'react-router-dom';
import { useStudioAuth } from './useStudioAuth';
import StudioSidebar from './StudioSidebar';

export default function StudioAppLayout() {
  const { user, loading, logout } = useStudioAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-100">
        <p className="text-foreground-500 text-sm">Loading Studio...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/studio/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background-100">
      <StudioSidebar user={user} onLogout={logout} />
      <main className="flex-1 min-w-0 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
