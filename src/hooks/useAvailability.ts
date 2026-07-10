import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Pathway } from '@/lib/booking/catalog';

// Maps wizard pathway → event_type row in DB
export const PATHWAY_EVENT_TYPE: Record<Pathway, string> = {
  private: 'private',
  semi: 'semi_private',
  rental: 'rental',
  mobile: 'mobile',
};

interface HoursDay { open: string; close: string }
type Hours = Partial<Record<'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat', HoursDay | null>>;

interface Availability {
  hours: Hours;
  slot_minutes: number;
  lead_time_hours: number;
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export function useAvailability(pathway: Pathway | null) {
  const eventType = pathway ? PATHWAY_EVENT_TYPE[pathway] : null;

  const { data: availability } = useQuery({
    queryKey: ['availability', eventType],
    enabled: !!eventType,
    queryFn: async (): Promise<Availability | null> => {
      const { data, error } = await supabase
        .from('event_availability')
        .select('hours, slot_minutes, lead_time_hours')
        .eq('event_type', eventType!)
        .maybeSingle();
      if (error) throw error;
      return (data as Availability | null) ?? null;
    },
  });

  const { data: blackouts } = useQuery({
    queryKey: ['blackouts', eventType],
    enabled: !!eventType,
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await supabase
        .from('event_blackout_dates')
        .select('blackout_date')
        .eq('event_type', eventType!);
      if (error) throw error;
      return new Set(((data as Array<{ blackout_date: string }>) || []).map((r) => r.blackout_date));
    },
  });

  return { availability, blackouts };
}

export function isDateAvailable(date: Date, hours: Hours | undefined, blackouts: Set<string> | undefined, leadHours: number) {
  if (!hours) return false;
  const iso = date.toISOString().slice(0, 10);
  if (blackouts?.has(iso)) return false;
  const key = DAY_KEYS[date.getDay()];
  const day = hours[key];
  if (!day) return false;
  const now = new Date();
  const leadMs = leadHours * 60 * 60 * 1000;
  return date.getTime() + 24 * 60 * 60 * 1000 - 1 >= now.getTime() + leadMs;
}

export function generateSlots(date: Date, hours: Hours | undefined, slotMinutes: number, leadHours: number): string[] {
  if (!hours) return [];
  const key = DAY_KEYS[date.getDay()];
  const day = hours[key];
  if (!day) return [];
  const [oh, om] = day.open.split(':').map(Number);
  const [ch, cm] = day.close.split(':').map(Number);
  const start = new Date(date); start.setHours(oh, om, 0, 0);
  const end = new Date(date);   end.setHours(ch, cm, 0, 0);
  const now = new Date();
  const leadMs = leadHours * 60 * 60 * 1000;
  const slots: string[] = [];
  const step = slotMinutes * 60 * 1000;
  for (let t = start.getTime(); t + slotMinutes * 60 * 1000 <= end.getTime(); t += step) {
    if (t < now.getTime() + leadMs) continue;
    const d = new Date(t);
    slots.push(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
  }
  return slots;
}
