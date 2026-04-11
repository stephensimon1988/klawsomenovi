import React, { createContext, useContext } from 'react';
import { useCmsSingle } from '@/hooks/useCmsContent';
import type { SiteSettings } from '@/hooks/useCmsContent';

interface SiteSettingsWithContainer extends SiteSettings {
  container_max_width: string;
}

const SiteSettingsContext = createContext<SiteSettingsWithContainer | null>(null);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const { data } = useCmsSingle<SiteSettingsWithContainer>('site_settings');
  return (
    <SiteSettingsContext.Provider value={data ?? null}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useContainerMaxWidth(): string {
  const settings = useContext(SiteSettingsContext);
  return settings?.container_max_width || '1200px';
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
