// Machine rental pricing: reads the live tables edited in /klawsome-admin and
// falls back to the values baked into src/lib/booking/catalog.ts.
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MACHINES, type DayType, type MachineDef, type MachineId } from '@/lib/booking/catalog';

interface PricingRow {
  machine: string; day_type: string; unit: string; label: string;
  price_cents: number; variant_id: string; is_active: boolean;
}
interface OptionRow {
  machine: string; option_key: string; label: string;
  price_cents: number; numeric_value: number | string; variant_id: string; is_active: boolean;
}

function applyOverrides(pricing: PricingRow[], options: OptionRow[]): MachineDef[] {
  return MACHINES.map((base) => {
    const m: MachineDef = {
      ...base,
      first: { ...base.first },
      extraBlock: base.extraBlock ? { ...base.extraBlock } : undefined,
      plushPack: { ...base.plushPack },
      notes: [...base.notes],
    };
    for (const row of pricing) {
      if (row.machine !== m.id || row.is_active === false) continue;
      const days: DayType[] = row.day_type === 'any' ? ['weekday', 'weekend'] : [row.day_type as DayType];
      for (const d of days) {
        const rate = { cents: Number(row.price_cents) || 0, variantId: row.variant_id || '' };
        if (row.unit === 'whole_day' || row.unit === 'first_block') m.first[d] = rate;
        else if (row.unit === 'extra_block' && m.extraBlock) m.extraBlock[d] = rate;
      }
    }
    for (const row of options) {
      if (row.machine !== m.id || row.is_active === false) continue;
      switch (row.option_key) {
        case 'delivery_base':
          m.deliveryBaseCents = Number(row.price_cents) || 0;
          m.deliveryBaseVariantId = row.variant_id || '';
          break;
        case 'free_miles':
          m.freeMiles = Number(row.numeric_value) || 0;
          break;
        case 'plush_pack':
          m.plushPack = {
            label: row.label || m.plushPack.label,
            priceCents: Number(row.price_cents) || 0,
            variantId: row.variant_id || '',
          };
          break;
      }
    }
    return m;
  });
}

export function useRentalPricing() {
  const query = useQuery({
    queryKey: ['booking-rental-pricing'],
    staleTime: 60_000,
    queryFn: async () => {
      const [pricing, options] = await Promise.all([
        supabase.from('booking_rental_pricing').select('*'),
        supabase.from('booking_rental_options').select('*'),
      ]);
      if (pricing.error) throw pricing.error;
      if (options.error) throw options.error;
      return {
        pricing: (pricing.data ?? []) as unknown as PricingRow[],
        options: (options.data ?? []) as unknown as OptionRow[],
      };
    },
  });

  const machines = query.data && query.data.pricing.length
    ? applyOverrides(query.data.pricing, query.data.options)
    : MACHINES;

  return {
    machines,
    machineById: (id: MachineId | null | undefined) => machines.find((m) => m.id === id) ?? null,
    isLoading: query.isLoading,
  };
}
