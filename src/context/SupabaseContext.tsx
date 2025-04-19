
import React, { createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';

interface SupabaseContextType {
  client: typeof supabase;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SupabaseContext.Provider value={{ client: supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
