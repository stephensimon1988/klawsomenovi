import React, { createContext, useContext, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface EditModeContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  password: string;
  toggleEditMode: () => void;
  authenticate: (password: string) => Promise<boolean>;
  logout: () => void;
  cmsInvoke: (body: Record<string, unknown>) => Promise<any>;
  refreshKey: number;
  triggerRefresh: () => void;
}

const EditModeContext = createContext<EditModeContextType | null>(null);

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) return { isEditMode: false, isAuthenticated: false, password: '', toggleEditMode: () => {}, authenticate: async () => false, logout: () => {}, cmsInvoke: async () => {}, refreshKey: 0, triggerRefresh: () => {} };
  return ctx;
}

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [isEditMode, setIsEditMode] = useState(false);
  const queryClient = useQueryClient();
  const [password, setPassword] = useState(() => sessionStorage.getItem('cms_password') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('cms_password'));
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
    queryClient.invalidateQueries();
  }, [queryClient]);

  const authenticate = useCallback(async (pwd: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('cms-admin', {
        body: { password: pwd, action: 'read', table: 'site_settings' },
      });
      if (error || data?.error) return false;
      setPassword(pwd);
      setIsAuthenticated(true);
      sessionStorage.setItem('cms_password', pwd);
      setIsEditMode(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsEditMode(false);
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('cms_password');
  }, []);

  const toggleEditMode = useCallback(() => {
    if (isEditMode) {
      setIsEditMode(false);
    } else if (isAuthenticated) {
      setIsEditMode(true);
    }
    // If not authenticated, the toggle component handles prompting
  }, [isEditMode, isAuthenticated]);

  const cmsInvoke = useCallback(async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke('cms-admin', {
      body: { password, ...body },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  }, [password]);

  // Don't provide edit capabilities on mobile
  if (isMobile) {
    return (
      <EditModeContext.Provider value={{ isEditMode: false, isAuthenticated: false, password: '', toggleEditMode: () => {}, authenticate: async () => false, logout: () => {}, cmsInvoke: async () => {}, refreshKey: 0, triggerRefresh: () => {} }}>
        {children}
      </EditModeContext.Provider>
    );
  }

  return (
    <EditModeContext.Provider value={{ isEditMode, isAuthenticated, password, toggleEditMode, authenticate, logout, cmsInvoke, refreshKey, triggerRefresh }}>
      {children}
    </EditModeContext.Provider>
  );
}
