import { createContext, useContext } from 'react';
import type { StoreType } from '@/types';

export const StoreContext = createContext<StoreType | null>(null);

export function useStoreContext(): StoreType {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStoreContext must be used within StoreContext.Provider');
  return ctx;
}
