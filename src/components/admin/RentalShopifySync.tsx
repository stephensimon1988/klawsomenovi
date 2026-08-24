import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

type SyncResult = { row: string; variant: string; status: string; detail?: string };

const STATUS_STYLES: Record<string, string> = {
  updated: 'text-emerald-300',
  'would-update': 'text-sky-300',
  'up-to-date': 'text-white/50',
  skipped: 'text-white/40',
  missing: 'text-amber-300',
  failed: 'text-rose-300',
};

/** Pushes Command Center rental prices/labels to the matching Shopify items. */
export function useRentalShopifySync() {
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<SyncResult[] | null>(null);

  const run = useCallback(async (opts?: { silent?: boolean }) => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('shopify-rental-sync', { body: {} });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const list: SyncResult[] = data?.results ?? [];
      setResults(list);
      const changed = list.filter((r) => r.status === 'updated').length;
      const failed = list.filter((r) => r.status === 'failed' || r.status === 'missing').length;
      if (failed) toast.error(`Shopify sync finished with ${failed} problem${failed > 1 ? 's' : ''}`);
      else if (!opts?.silent) toast.success(changed ? `Synced ${changed} price${changed > 1 ? 's' : ''} to Shopify` : 'Shopify already matches');
      else if (changed) toast.success(`Synced ${changed} price${changed > 1 ? 's' : ''} to Shopify`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error('Shopify sync failed', { description: msg });
      setResults([{ row: 'Shopify connection', variant: '—', status: 'failed', detail: msg }]);
    }
    setBusy(false);
  }, []);

  return { busy, results, run };
}

export function RentalShopifySyncPanel({ busy, results, run }: ReturnType<typeof useRentalShopifySync>) {
  return (
    <div className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={() => run()} disabled={busy}>
          {busy ? 'SYNCING…' : 'SYNC TO SHOPIFY'}
        </Button>
        <p className="text-xs text-white/60 font-heading">
          Sends every price and label below to the matching Shopify item, so checkout charges exactly
          what customers are quoted. This also runs automatically after you save a row.
        </p>
      </div>
      {results && results.length > 0 && (
        <ul className="mt-3 space-y-1 max-h-52 overflow-y-auto text-xs font-heading">
          {results.map((r, i) => (
            <li key={`${r.variant}-${i}`} className={STATUS_STYLES[r.status] ?? 'text-white/60'}>
              <span className="uppercase">{r.status}</span> — {r.row}
              {r.detail ? ` (${r.detail})` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
