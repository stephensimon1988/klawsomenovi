import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Generic hook for fetching any CMS table
export function useCmsTable<T = Record<string, unknown>>(table: string, options?: { enabled?: boolean }) {
  return useQuery<T[]>({
    queryKey: ['cms', table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as any)
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) {
        // Fallback without sort_order
        const { data: d2, error: e2 } = await supabase.from(table as any).select('*');
        if (e2) throw new Error(e2.message);
        return (d2 || []) as T[];
      }
      return (data || []) as T[];
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
    enabled: options?.enabled !== false,
  });
}

// Single-row table hook (site_settings, homepage_content, birthdays_content)
export function useCmsSingle<T = Record<string, unknown>>(table: string) {
  return useQuery<T | null>({
    queryKey: ['cms', table, 'single'],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select('*').limit(1).single();
      if (error) return null;
      return data as T;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Type definitions for CMS content
export interface SiteSettings {
  id: string;
  business_name: string;
  phone: string;
  email: string;
  address: string;
  google_maps_url: string;
  instagram_url: string;
  tiktok_url: string;
  facebook_url: string;
  youtube_url: string;
  gift_card_url: string;
  newsletter_text: string;
}

export interface StoreHour {
  id: string;
  day_of_week: number;
  day_label: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  sort_order: number;
}

export interface HomepageContent {
  id: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_text: string;
  hero_image_url: string;
  story_title: string;
  story_body: string;
  story_image_url: string;
  about_title: string;
  about_subtitle: string;
}

export interface HomepageStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface TokenTier {
  id: string;
  price: string;
  tokens: string;
  bonus: string;
  is_highlight: boolean;
  sort_order: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface BirthdaysContent {
  id: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_image_url: string;
  promo_text: string;
  rules_text: string;
  booking_email: string;
  booking_phone: string;
}

export interface PartyOption {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  sort_order: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  page: string;
  sort_order: number;
}

export interface InviteTemplate {
  id: string;
  name: string;
  url: string;
  thumbnail_url: string;
  sort_order: number;
}

export interface JobListing {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  job_desc_url: string;
  apply_url: string;
  is_paid: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface BusinessSection {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  bullet_points: string[];
  image_url: string;
  sort_order: number;
}

export interface BusinessPricingTier {
  id: string;
  name: string;
  price: string;
  features: string[];
  is_highlight: boolean;
  sort_order: number;
}

export interface BusinessHowStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface PageSection {
  id: string;
  page: string;
  section_key: string;
  label: string;
  sort_order: number;
  is_visible: boolean;
  section_height: string;
  wrapper_max_width: string;
  padding_y: string;
  bg_color: string;
  bg_image_url: string;
  custom_css_class: string;
  columns: number;
  photos?: string[];
  text_color?: string;
  layout_json?: Record<string, any>;
}

export interface SectionContentBlock {
  id: string;
  section_id: string;
  column_index: number;
  row_order: number;
  block_type: string;
  content: Record<string, any>;
}

export interface CustomBlock {
  id: string;
  block_key: string;
  headline: string;
  body: string;
  image_url: string;
  image_position: string;
  cta_text: string;
  cta_url: string;
  sort_order: number;
}

// Hook for fetching page sections for a specific page
export function usePageSections(page: string) {
  return useQuery<PageSection[]>({
    queryKey: ['cms', 'page_sections', page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_sections' as any)
        .select('*')
        .eq('page', page)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      if (error) throw new Error(error.message);
      return (data || []) as unknown as PageSection[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
