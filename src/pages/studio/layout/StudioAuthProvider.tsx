import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser, logout as apiLogout } from '@/api';
import type { User } from '@/types/studio';
import { StudioAuthContext } from './useStudioAuth';

export default function StudioAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const current = await getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return (
    <StudioAuthContext.Provider value={{ user, loading, refresh, logout }}>{children}</StudioAuthContext.Provider>
  );
}
