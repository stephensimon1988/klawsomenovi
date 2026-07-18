import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const cmsInvoke = async (password: string, body: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke('cms-admin', { body: { password, ...body } });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

interface Booking {
  id: string;
  booking_ref: string | null;
  event_type: string;
  pathway: string | null;
  start_at: string;
  duration_minutes: number | null;
  status: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  party_size: number | null;
  celebrant_name: string | null;
  celebrant_age: number | null;
  favorites: string | null;
  special_requests: string | null;
  character_pick: string | null;
  zip: string | null;
  miles: number | null;
  addons: any;
  shopify_order_id: string | null;
  total_cents: number | null;
}

interface Blackout { id: string; event_type: string; blackout_date: string; reason: string | null }

const TYPE_META: Record<string, { label: string; color: string }> = {
  private: { label: 'Private', color: 'bg-pink-500/80' },
  semi_private: { label: 'Semi', color: 'bg-purple-500/80' },
  rental: { label: 'Rental', color: 'bg-sky-500/80' },
  mobile: { label: 'Mobile', color: 'bg-emerald-500/80' },
};

const ALL_TYPE_KEYS = ['private', 'semi_private', 'rental', 'mobile'] as const;

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function BookingsCalendar({ password }: { password: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blackouts, setBlackouts] = useState<Blackout[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Booking | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [b, bo] = await Promise.all([
        cmsInvoke(password, { action: 'read', table: 'event_bookings' }),
        cmsInvoke(password, { action: 'read', table: 'event_blackout_dates' }),
      ]);
      setBookings((b.rows || []) as Booking[]);
      setBlackouts((bo.rows || []) as Blackout[]);
    } catch (e: any) {
      toast.error(e.message);
    }
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const sync = useCallback(async (silent = false) => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('shopify-booking-sync', { body: {} });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      await load();
      if (!silent) toast.success(`Synced ${data?.upserted ?? 0} bookings from Shopify (${data?.skipped ?? 0} non-booking orders skipped)`);
    } catch (e: any) {
      if (!silent) toast.error(`Sync failed: ${e.message}`);
    }
    setSyncing(false);
  }, [load]);

  const filtered = useMemo(
    () => bookings.filter((b) =>
      (typeFilter === 'all' || b.event_type === typeFilter) &&
      (statusFilter === 'all' || b.status === statusFilter)),
    [bookings, typeFilter, statusFilter],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, Booking[]>();
    filtered.forEach((b) => {
      const key = isoDay(new Date(b.start_at));
      const arr = map.get(key) || [];
      arr.push(b);
      map.set(key, arr);
    });
    map.forEach((arr) => arr.sort((x, y) => x.start_at.localeCompare(y.start_at)));
    return map;
  }, [filtered]);

  // Group blackouts by date, filtered by the active type filter.
  const blackoutsByDay = useMemo(() => {
    const map = new Map<string, Blackout[]>();
    blackouts.forEach((b) => {
      if (typeFilter !== 'all' && b.event_type !== typeFilter) return;
      const arr = map.get(b.blackout_date) || [];
      arr.push(b);
      map.set(b.blackout_date, arr);
    });
    return map;
  }, [blackouts, typeFilter]);

  // Build calendar grid (Sun-Sat)
  const gridDays = useMemo(() => {
    const first = new Date(cursor);
    const startOffset = first.getDay();
    const start = new Date(first); start.setDate(1 - startOffset);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [cursor]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    const in14 = now + 14 * 24 * 60 * 60 * 1000;
    return filtered
      .filter((b) => { const t = new Date(b.start_at).getTime(); return t >= now && t <= in14; })
      .sort((a, b) => a.start_at.localeCompare(b.start_at));
  }, [filtered]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await cmsInvoke(password, { action: 'update', table: 'event_bookings', id, data: { status } });
      toast.success('Status updated');
      setSelected((s) => (s && s.id === id ? { ...s, status } : s));
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const todayIso = isoDay(new Date());

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10"
            onClick={() => setCursor((d) => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; })}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-white font-heading text-lg min-w-[160px] text-center">{monthLabel}</span>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10"
            onClick={() => setCursor((d) => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; })}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="ml-2 text-white border-white/20 bg-white/5 hover:bg-white/10"
            onClick={() => { const d = new Date(); d.setDate(1); setCursor(d); }}>Today</Button>
          <Button
            size="sm"
            variant="outline"
            disabled={syncing}
            className="ml-2 text-white border-white/20 bg-white/5 hover:bg-white/10"
            onClick={() => sync(false)}
          >
            {syncing ? 'Syncing…' : 'Sync Shopify'}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {Object.entries(TYPE_META).map(([k, v]) => (<SelectItem key={k} value={k}>{v.label}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upcoming */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-white font-heading text-base">Upcoming (next 14 days)</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-white/40 text-sm">Loading…</p>
          ) : upcoming.length === 0 ? (
            <p className="text-white/40 text-sm italic">No upcoming bookings</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {upcoming.map((b) => (
                <li key={b.id}>
                  <button onClick={() => setSelected(b)}
                    className="w-full flex items-center gap-3 py-2 text-left hover:bg-white/5 rounded px-2">
                    <span className={`w-2 h-2 rounded-full ${TYPE_META[b.event_type]?.color || 'bg-white/40'}`} />
                    <span className="text-white text-sm font-mono w-40">
                      {new Date(b.start_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                    <span className="text-white/80 text-sm flex-1 truncate">
                      {TYPE_META[b.event_type]?.label || b.event_type} — {b.contact_name || 'Unknown'}
                      {b.party_size ? ` (${b.party_size})` : ''}
                    </span>
                    <Badge variant="outline" className="text-white/70 border-white/20 text-xs">{b.status}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Calendar grid */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-3">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mb-3 px-1 text-[11px] text-white/60">
            <span className="font-heading uppercase tracking-wider text-white/50">Legend:</span>
            {Object.entries(TYPE_META).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${v.color}`} />
                {v.label}
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/30 ring-1 ring-red-400/70" />
              Blackout dot (per event type)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-red-400 font-heading">BLACKOUT</span>
              = all types blocked
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-white/50 text-xs font-heading uppercase text-center py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {gridDays.map((d, i) => {
              const iso = isoDay(d);
              const inMonth = d.getMonth() === cursor.getMonth();
              const isToday = iso === todayIso;
              const dayBookings = byDay.get(iso) || [];
              const dayBlackouts = blackoutsByDay.get(iso) || [];
              const blackoutTypes = new Set(dayBlackouts.map((b) => b.event_type));
              const isFullBlackout =
                typeFilter === 'all' && ALL_TYPE_KEYS.every((k) => blackoutTypes.has(k));
              return (
                <div key={i} className={`min-h-[110px] rounded border p-1.5 text-xs
                  ${inMonth ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5 opacity-50'}
                  ${isToday ? 'ring-2 ring-klawsome-yellow' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-heading ${isToday ? 'text-klawsome-yellow' : 'text-white/80'}`}>{d.getDate()}</span>
                    {isFullBlackout ? (
                      <span
                        className="text-[10px] text-red-400 font-heading"
                        title="All event types blacked out"
                      >
                        BLACKOUT
                      </span>
                    ) : dayBlackouts.length > 0 ? (
                      <div className="flex items-center gap-0.5">
                        {dayBlackouts.map((b) => {
                          const meta = TYPE_META[b.event_type];
                          const title = `${meta?.label || b.event_type} blackout${b.reason ? ` — ${b.reason}` : ''}`;
                          return (
                            <span
                              key={b.id}
                              title={title}
                              className={`w-2 h-2 rounded-full ring-1 ring-red-400/60 ${meta?.color || 'bg-white/40'}`}
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.slice(0, 4).map((b) => (
                      <button key={b.id} onClick={() => setSelected(b)}
                        className={`w-full text-left rounded px-1.5 py-0.5 text-white text-[11px] leading-tight truncate ${TYPE_META[b.event_type]?.color || 'bg-white/40'} hover:brightness-110`}>
                        {fmtTime(b.start_at)} {b.contact_name || TYPE_META[b.event_type]?.label}
                      </button>
                    ))}
                    {dayBookings.length > 4 && (
                      <div className="text-white/50 text-[10px] px-1">+{dayBookings.length - 4} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-klawsome-navy border-white/10 text-white">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${TYPE_META[selected.event_type]?.color}`} />
                  {TYPE_META[selected.event_type]?.label || selected.event_type} Booking
                  {selected.booking_ref && <span className="text-white/40 text-xs font-mono">#{selected.booking_ref}</span>}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <Row label="When">
                  {new Date(selected.start_at).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
                  {selected.duration_minutes ? ` · ${selected.duration_minutes} min` : ''}
                </Row>
                <Row label="Status">
                  <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v)}>
                    <SelectTrigger className="w-[160px] h-8 bg-white/10 border-white/20 text-white text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </Row>
                <Row label="Contact">
                  <div>{selected.contact_name || '—'}</div>
                  <div className="text-white/60">{selected.contact_email || '—'}</div>
                  <div className="text-white/60">{selected.contact_phone || '—'}</div>
                </Row>
                {selected.party_size && <Row label="Party size">{selected.party_size}</Row>}
                {selected.celebrant_name && <Row label="Celebrant">{selected.celebrant_name}{selected.celebrant_age ? ` (age ${selected.celebrant_age})` : ''}</Row>}
                {selected.character_pick && <Row label="Character">{selected.character_pick}</Row>}
                {selected.favorites && <Row label="Favorites">{selected.favorites}</Row>}
                {selected.special_requests && <Row label="Requests">{selected.special_requests}</Row>}
                {selected.zip && <Row label="Location">{selected.zip}{selected.miles ? ` · ${selected.miles} mi` : ''}</Row>}
                {selected.addons && Array.isArray(selected.addons) && selected.addons.length > 0 && (
                  <Row label="Add-ons">
                    <pre className="text-white/70 text-xs whitespace-pre-wrap">{JSON.stringify(selected.addons, null, 2)}</pre>
                  </Row>
                )}
                {selected.shopify_order_id && <Row label="Order">{selected.shopify_order_id}</Row>}
                {selected.total_cents != null && <Row label="Total">${(selected.total_cents / 100).toFixed(2)}</Row>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2 items-start">
      <span className="text-white/50 font-heading text-xs uppercase tracking-wider pt-0.5">{label}</span>
      <div className="text-white">{children}</div>
    </div>
  );
}

export default BookingsCalendar;