import { supabase } from '@/integrations/supabase/client';

export type ApprovalStatus = 'pending' | 'approved' | 'denied';

export interface ApprovalRecord {
  code: string;
  zip: string;
  status: ApprovalStatus;
}

const KEY = 'klawsome-zip-approvals';

/* ---------- local persistence (per device, keyed by ZIP) ---------- */

function readAll(): Record<string, ApprovalRecord> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, ApprovalRecord>) : {};
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, ApprovalRecord>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch { /* storage unavailable — approval just won't persist */ }
}

export function getStoredApproval(zip: string): ApprovalRecord | null {
  return readAll()[zip.trim()] ?? null;
}

export function storeApproval(rec: ApprovalRecord) {
  const map = readAll();
  map[rec.zip.trim()] = rec;
  writeAll(map);
}

export function clearApproval(zip: string) {
  const map = readAll();
  delete map[zip.trim()];
  writeAll(map);
}

/* ---------- server ---------- */

export interface ApprovalRequestInput {
  zip: string;
  city?: string;
  zipLevel?: string;
  eventType?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  requestedDate?: string | null;
  partySize?: number | null;
  isIndoors?: boolean;
  over200?: boolean;
  notes?: string;
}

export async function createApprovalRequest(input: ApprovalRequestInput): Promise<ApprovalRecord> {
  const { data, error } = await supabase.functions.invoke('request-booking-approval', {
    body: {
      zip: input.zip,
      city: input.city ?? '',
      zip_level: input.zipLevel ?? 'review',
      event_type: input.eventType ?? 'mobile',
      contact_name: input.contactName,
      contact_phone: input.contactPhone,
      contact_email: input.contactEmail ?? '',
      requested_date: input.requestedDate ?? null,
      party_size: input.partySize ?? null,
      is_indoors: !!input.isIndoors,
      over_200: !!input.over200,
      customer_notes: input.notes ?? '',
    },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  const rec: ApprovalRecord = { code: data.request_code, zip: input.zip.trim(), status: 'pending' };
  storeApproval(rec);
  return rec;
}

export async function fetchApprovalStatus(code: string): Promise<ApprovalStatus | null> {
  const { data, error } = await supabase
    .from('booking_approval_status')
    .select('status')
    .eq('request_code', code)
    .maybeSingle();
  if (error || !data) return null;
  return (data.status as ApprovalStatus) ?? null;
}

/** Realtime subscription on the status-only table (no personal data). */
export function subscribeApprovalStatus(code: string, onChange: (s: ApprovalStatus) => void) {
  const channel = supabase
    .channel(`approval-${code}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'booking_approval_status',
        filter: `request_code=eq.${code}`,
      },
      (payload) => {
        const status = (payload.new as { status?: string } | null)?.status;
        if (status) onChange(status as ApprovalStatus);
      },
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
