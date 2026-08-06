import { createContext, useContext } from 'react';
import type { User } from '@/types/studio';

export interface StudioAuthContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export const StudioAuthContext = createContext<StudioAuthContextValue | null>(null);

export function useStudioAuth(): StudioAuthContextValue {
  const ctx = useContext(StudioAuthContext);
  if (!ctx) throw new Error('useStudioAuth must be used within StudioAuthProvider');
  return ctx;
}
