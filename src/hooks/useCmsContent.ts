// Hybrid CMS layer: `site_settings` and `store_hours` fetch live from
// Supabase (edited via /klawsome-admin). All other tables still come from
// the static cmsData.ts snapshot.
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cmsData } from '@/content/cmsData';

// Tables that read live from Supabase instead of cmsData.ts
const LIVE_TABLES = new Set(['site_settings', 'store_hours']);

function sortRows<T extends Record<string, any>>(rows: T[]): T[] {
  if (!rows || rows.length === 0) return rows;
  if ('sort_order' in rows[0]) {
    return [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }
  return rows;
}

function useLiveTable<T>(table: string, enabled = true) {
  return useQuery({
    queryKey: ['cms', table],
    enabled,
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select('*');
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export function useCmsTable<T = Record<string, unknown>>(table: string, _options?: { enabled?: boolean }) {
  const fallback = (cmsData[table] as T[]) || [];
  const live = useLiveTable<T>(table, LIVE_TABLES.has(table));
  const rows = LIVE_TABLES.has(table) ? (live.data ?? fallback) : fallback;
  return {
    data: sortRows(rows as any) as T[],
    isLoading: LIVE_TABLES.has(table) ? live.isLoading : false,
    isError: LIVE_TABLES.has(table) ? live.isError : false,
    error: (LIVE_TABLES.has(table) ? live.error : null) as Error | null,
  };
}

export function useCmsSingle<T = Record<string, unknown>>(table: string) {
  const fallback = (cmsData[table] as T[]) || [];
  const live = useLiveTable<T>(table, LIVE_TABLES.has(table));
  const rows = LIVE_TABLES.has(table) ? (live.data ?? fallback) : fallback;
  return {
    data: (rows[0] ?? null) as T | null,
    isLoading: LIVE_TABLES.has(table) ? live.isLoading : false,
    isError: LIVE_TABLES.has(table) ? live.isError : false,
    error: (LIVE_TABLES.has(table) ? live.error : null) as Error | null,
  };
}

export function usePageHero(pageKey: string) {
  const rows = (cmsData['page_heroes'] as any[]) || [];
  const match = rows.find((r) => r.page_key === pageKey) ?? null;
  return {
    data: match,
    isLoading: false,
    isError: false,
    error: null as Error | null,
  };
}

// ---- Type definitions (preserved) ----
export interface SiteSettings {
  id: string; business_name: string; phone: string; email: string; address: string;
  google_maps_url: string; instagram_url: string; tiktok_url: string; facebook_url: string;
  youtube_url: string; gift_card_url: string; newsletter_text: string;
}
export interface StoreHour {
  id: string; day_of_week: number; day_label: string; open_time: string;
  close_time: string; is_closed: boolean; sort_order: number;
}
export interface HomepageContent {
  id: string; hero_headline: string; hero_subheadline: string; hero_cta_text: string;
  hero_image_url: string; story_title: string; story_body: string; story_image_url: string;
  about_title: string; about_subtitle: string;
}
export interface HomepageStep { id: string; icon: string; title: string; description: string; sort_order: number; }
export interface TokenTier { id: string; price: string; tokens: string; bonus: string; is_highlight: boolean; sort_order: number; }
export interface NewsArticle { id: string; title: string; source: string; date: string; url: string; image_url: string; is_active: boolean; sort_order: number; }
export interface BirthdaysContent { id: string; hero_headline: string; hero_subheadline: string; hero_image_url: string; promo_text: string; rules_text: string; booking_email: string; booking_phone: string; }
export interface PartyOption { id: string; name: string; description: string; price: string; features: string[]; sort_order: number; }
export interface FaqItem { id: string; question: string; answer: string; page: string; sort_order: number; }
export interface InviteTemplate { id: string; name: string; url: string; thumbnail_url: string; sort_order: number; }
export interface JobListing { id: string; title: string; category: string; description: string; image_url: string; job_desc_url: string; apply_url: string; is_paid: boolean; is_active: boolean; sort_order: number; }
export interface BusinessSection { id: string; section_key: string; title: string; subtitle: string; description: string; bullet_points: string[]; image_url: string; sort_order: number; }
export interface BusinessPricingTier { id: string; name: string; price: string; features: string[]; is_highlight: boolean; sort_order: number; }
export interface BusinessHowStep { id: string; title: string; description: string; icon: string; sort_order: number; }
export interface PageHero { id: string; page_key: string; eyebrow: string; title: string; subtitle: string; image_url: string; cta_text: string; cta_url: string; sort_order: number; }
export interface OurStorySection { id: string; eyebrow: string; title: string; body: string; sort_order: number; }
export interface Review { id: string; author_name: string; author_role: string; review_text: string; rating: number; is_active: boolean; sort_order: number; }
export interface GiftCardsContent { id: string; eyebrow: string; headline: string; body_1: string; body_2: string; cta_text: string; cta_url: string; }
export interface GiftCardImage { id: string; image_url: string; alt_text: string; sort_order: number; }
export interface RewardsBenefit { id: string; title: string; body: string; sort_order: number; }
