import { createContext, useContext } from 'react';
import type { Store } from '@/hooks/useStore';

export const StoreContext = createContext<Store | null>(null);

export function useStoreContext(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStoreContext must be used within StoreProvider');
  return ctx;
}
