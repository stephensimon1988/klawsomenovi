import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const cmsInvoke = async (password: string, body: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke('cms-admin', {
    body: { password, ...body },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

const EVENT_TYPES: { key: string; label: string; blurb: string }[] = [
  { key: 'private', label: 'Private Parties', blurb: 'Full-venue private bookings' },
  { key: 'semi_private', label: 'Semi-Private Parties', blurb: 'Shared-floor semi-private bookings' },
  { key: 'rental', label: 'In-Store Rental', blurb: 'On-site machine rentals' },
  { key: 'mobile', label: 'Klawsome Mobile', blurb: 'Delivered / off-site bookings' },
];

const DAYS: { key: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'; label: string }[] = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

const DAY_KEY_BY_INDEX = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

const MAX_RANGE_DAYS = 366;

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function toISO(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}
function expandRange(startISO: string, endISO: string): string[] {
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  if (end < start) return [];
  const out: string[] = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    out.push(toISO(new Date(t)));
    if (out.length > MAX_RANGE_DAYS) break;
  }
  return out;
}
function fmtISO(iso: string): string {
  return parseISO(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

interface BlackoutGroup {
  start: string;
  end: string;
  reason: string | null;
  ids: string[];
}
function groupBlackouts(rows: BlackoutRow[]): BlackoutGroup[] {
  const sorted = [...rows].sort((a, b) => a.blackout_date.localeCompare(b.blackout_date));
  const groups: BlackoutGroup[] = [];
  for (const r of sorted) {
    const last = groups[groups.length - 1];
    const nextDay = last ? toISO(new Date(parseISO(last.end).getTime() + 86400000)) : null;
    if (last && (last.reason || '') === (r.reason || '') && r.blackout_date === nextDay) {
      last.end = r.blackout_date;
      last.ids.push(r.id);
    } else {
      groups.push({ start: r.blackout_date, end: r.blackout_date, reason: r.reason, ids: [r.id] });
    }
  }
  return groups;
}

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const hr = ((h + 11) % 12) + 1;
  return m ? `${hr}:${String(m).padStart(2, '0')}${period}` : `${hr}${period}`;
}

function Next7Preview({
  hours,
  blackouts,
}: {
  hours: HoursMap;
  blackouts: BlackoutRow[];
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const blackoutMap = new Map(blackouts.map((b) => [b.blackout_date, b.reason]));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayKey = DAY_KEY_BY_INDEX[d.getDay()];
    const dayHours = hours[dayKey];
    const blackoutReason = blackoutMap.get(iso);
    let status: 'open' | 'closed' | 'blackout' = 'closed';
    if (blackoutReason !== undefined) status = 'blackout';
    else if (dayHours) status = 'open';
    return { d, iso, dayHours, status, blackoutReason };
  });

  return (
    <div className="pt-4 border-t border-white/10 space-y-2">
      <p className="text-white/60 text-xs font-heading uppercase tracking-wider">Preview — next 7 days</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {days.map(({ d, iso, dayHours, status, blackoutReason }) => (
          <div
            key={iso}
            className={`rounded-lg border p-2 text-xs ${
              status === 'blackout'
                ? 'bg-red-500/10 border-red-400/40'
                : status === 'open'
                ? 'bg-emerald-500/10 border-emerald-400/40'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-white font-heading text-sm">
                {d.toLocaleDateString(undefined, { weekday: 'short' })}
              </span>
              <span className="text-white/60 font-mono text-[11px]">
                {d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
              </span>
            </div>
            <div className="mt-1">
              {status === 'blackout' ? (
                <>
                  <div className="text-red-300 font-heading uppercase text-[10px] tracking-wider">Blackout</div>
                  {blackoutReason && (
                    <div className="text-white/60 truncate" title={blackoutReason}>{blackoutReason}</div>
                  )}
                </>
              ) : status === 'open' && dayHours ? (
                <div className="text-emerald-200">
                  {fmtTime(dayHours.open)}–{fmtTime(dayHours.close)}
                </div>
              ) : (
                <div className="text-white/40 uppercase text-[10px] tracking-wider font-heading">Closed</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type DayHours = { open: string; close: string } | null;
type HoursMap = Record<string, DayHours>;

interface AvailabilityRow {
  id: string;
  event_type: string;
  hours: HoursMap;
  slot_minutes: number;
  lead_time_hours: number;
}

interface BlackoutRow {
  id: string;
  event_type: string;
  blackout_date: string;
  reason: string | null;
}

function EventTypeEditor({
  eventType,
  label,
  blurb,
  password,
  availability,
  blackouts,
  onReload,
}: {
  eventType: string;
  label: string;
  blurb: string;
  password: string;
  availability: AvailabilityRow | undefined;
  blackouts: BlackoutRow[];
  onReload: () => void;
}) {
  const [hours, setHours] = useState<HoursMap>(availability?.hours || {});
  const [leadHours, setLeadHours] = useState<number>(availability?.lead_time_hours ?? 48);
  const [saving, setSaving] = useState(false);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [newReason, setNewReason] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setHours(availability?.hours || {});
    setLeadHours(availability?.lead_time_hours ?? 48);
  }, [availability]);

  const setDay = (day: string, next: DayHours) => setHours((h) => ({ ...h, [day]: next }));

  const save = async () => {
    if (!availability) return;
    setSaving(true);
    try {
      await cmsInvoke(password, {
        action: 'update',
        table: 'event_availability',
        id: availability.id,
        data: { hours, lead_time_hours: leadHours },
      });
      toast.success(`${label} schedule saved`);
      onReload();
    } catch (e: any) {
      toast.error(e.message);
    }
    setSaving(false);
  };

  const addBlackout = async () => {
    if (!rangeStart) {
      toast.error('Pick a start date');
      return;
    }
    const end = rangeEnd || rangeStart;
    const dates = expandRange(rangeStart, end);
    if (!dates.length) {
      toast.error('End date must be on or after start date');
      return;
    }
    const existing = new Set(blackouts.map((b) => b.blackout_date));
    const toAdd = dates.filter((d) => !existing.has(d));
    if (!toAdd.length) {
      toast.info('All dates in that range are already blacked out');
      return;
    }
    setAdding(true);
    const tId = toast.loading(`Adding ${toAdd.length} blackout${toAdd.length > 1 ? 's' : ''}…`);
    try {
      for (const d of toAdd) {
        await cmsInvoke(password, {
          action: 'insert',
          table: 'event_blackout_dates',
          data: { event_type: eventType, blackout_date: d, reason: newReason || null },
        });
      }
      setRangeStart('');
      setRangeEnd('');
      setNewReason('');
      toast.success(`Added ${toAdd.length} blackout${toAdd.length > 1 ? 's' : ''}`, { id: tId });
      onReload();
    } catch (e: any) {
      toast.error(e.message, { id: tId });
    }
    setAdding(false);
  };

  const removeGroup = async (ids: string[]) => {
    if (!confirm(`Remove ${ids.length > 1 ? `${ids.length} blackout dates` : 'this blackout'}?`)) return;
    const tId = toast.loading('Removing…');
    try {
      for (const id of ids) {
        await cmsInvoke(password, { action: 'delete', table: 'event_blackout_dates', id });
      }
      toast.success('Removed', { id: tId });
      onReload();
    } catch (e: any) {
      toast.error(e.message, { id: tId });
    }
  };

  const groups = groupBlackouts(blackouts);

  return (
    <div className="space-y-5 pb-2">
        {/* Lead time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-white/70 text-xs font-heading">
            Lead time (hours before booking)
            <Input
              type="number"
              min={0}
              value={leadHours}
              onChange={(e) => setLeadHours(Number(e.target.value) || 0)}
              className="bg-white/10 border-white/20 text-white"
            />
          </label>
        </div>

        {/* Weekly hours */}
        <div className="space-y-2">
          <p className="text-white/60 text-xs font-heading uppercase tracking-wider">Weekly hours</p>
          {DAYS.map(({ key, label: dLabel }) => {
            const val = hours[key];
            const closed = !val;
            return (
              <div key={key} className="grid grid-cols-[60px_1fr_1fr_120px] gap-2 items-center">
                <span className="text-white text-sm font-heading">{dLabel}</span>
                <Input
                  type="time"
                  disabled={closed}
                  value={val?.open || ''}
                  onChange={(e) => setDay(key, { open: e.target.value, close: val?.close || '17:00' })}
                  className="bg-white/10 border-white/20 text-white text-sm"
                />
                <Input
                  type="time"
                  disabled={closed}
                  value={val?.close || ''}
                  onChange={(e) => setDay(key, { open: val?.open || '10:00', close: e.target.value })}
                  className="bg-white/10 border-white/20 text-white text-sm"
                />
                <div className="flex items-center gap-2 justify-end">
                  <Switch
                    checked={!closed}
                    onCheckedChange={(v) => setDay(key, v ? { open: '10:00', close: '20:00' } : null)}
                  />
                  <span className="text-white/50 text-xs">{closed ? 'Closed' : 'Open'}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={save}
            disabled={saving || !availability}
            className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving…' : 'Save schedule'}
          </Button>
        </div>

        {/* Blackout dates */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <p className="text-white/60 text-xs font-heading uppercase tracking-wider">Blackout dates</p>
          {groups.length === 0 ? (
            <p className="text-white/40 text-sm italic">No blackout dates</p>
          ) : (
            <ul className="space-y-1">
              {groups.map((g) => (
                <li key={g.ids[0]} className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="font-mono text-white whitespace-nowrap">
                    {g.start === g.end ? fmtISO(g.start) : `${fmtISO(g.start)} → ${fmtISO(g.end)}`}
                    {g.ids.length > 1 && (
                      <span className="text-white/40 ml-2">({g.ids.length} days)</span>
                    )}
                  </span>
                  <span className="flex-1 text-white/60">{g.reason || '—'}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeGroup(g.ids)}
                    className="text-red-400 h-7 px-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <div className="grid grid-cols-1 md:grid-cols-[150px_150px_1fr_auto] gap-2">
            <label className="flex flex-col gap-1 text-white/50 text-[10px] font-heading uppercase tracking-wider">
              Start
              <Input
                type="date"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                className="bg-white/10 border-white/20 text-white text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-white/50 text-[10px] font-heading uppercase tracking-wider">
              End (optional)
              <Input
                type="date"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                className="bg-white/10 border-white/20 text-white text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-white/50 text-[10px] font-heading uppercase tracking-wider">
              Reason
              <Input
                placeholder="Reason (optional)"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="bg-white/10 border-white/20 text-white text-sm"
              />
            </label>
            <Button
              onClick={addBlackout}
              disabled={adding}
              className="self-end bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold"
            >
              <Plus className="w-4 h-4 mr-1" /> {adding ? 'Adding…' : 'Add'}
            </Button>
          </div>
          <p className="text-white/40 text-xs">
            Leave End blank to blackout a single day. Max {MAX_RANGE_DAYS} days per range.
          </p>
        </div>

        <Next7Preview hours={hours} blackouts={blackouts} />
    </div>
  );
}

export function BookingScheduleEditor({ password }: { password: string }) {
  return <BookingScheduleEditorInner password={password} />;
}

function AllTypesBlackout({
  password,
  blackouts,
  onReload,
}: {
  password: string;
  blackouts: BlackoutRow[];
  onReload: () => void;
}) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  // Group dates that are blacked out for ALL 4 event types with the same reason
  const allTypeGroups = (() => {
    const byDate = new Map<string, BlackoutRow[]>();
    for (const b of blackouts) {
      const arr = byDate.get(b.blackout_date) || [];
      arr.push(b);
      byDate.set(b.blackout_date, arr);
    }
    const fullDates: { date: string; reason: string | null; ids: string[] }[] = [];
    for (const [date, rows] of byDate) {
      const types = new Set(rows.map((r) => r.event_type));
      if (types.size === EVENT_TYPES.length) {
        const reasons = new Set(rows.map((r) => r.reason || ''));
        fullDates.push({
          date,
          reason: reasons.size === 1 ? rows[0].reason : rows[0].reason,
          ids: rows.map((r) => r.id),
        });
      }
    }
    fullDates.sort((a, b) => a.date.localeCompare(b.date));
    const groups: { start: string; end: string; reason: string | null; ids: string[] }[] = [];
    for (const f of fullDates) {
      const last = groups[groups.length - 1];
      const nextDay = last ? toISO(new Date(parseISO(last.end).getTime() + 86400000)) : null;
      if (last && (last.reason || '') === (f.reason || '') && f.date === nextDay) {
        last.end = f.date;
        last.ids.push(...f.ids);
      } else {
        groups.push({ start: f.date, end: f.date, reason: f.reason, ids: [...f.ids] });
      }
    }
    return groups;
  })();

  const addAll = async () => {
    if (!start) {
      toast.error('Pick a start date');
      return;
    }
    const dates = expandRange(start, end || start);
    if (!dates.length) {
      toast.error('End date must be on or after start date');
      return;
    }
    const existing = new Set(blackouts.map((b) => `${b.event_type}|${b.blackout_date}`));
    const inserts: { event_type: string; blackout_date: string }[] = [];
    for (const d of dates) {
      for (const t of EVENT_TYPES) {
        if (!existing.has(`${t.key}|${d}`)) inserts.push({ event_type: t.key, blackout_date: d });
      }
    }
    if (!inserts.length) {
      toast.info('All dates already blacked out for every event type');
      return;
    }
    setBusy(true);
    const tId = toast.loading(`Adding ${inserts.length} blackout row${inserts.length > 1 ? 's' : ''}…`);
    try {
      for (const row of inserts) {
        await cmsInvoke(password, {
          action: 'insert',
          table: 'event_blackout_dates',
          data: { ...row, reason: reason || null },
        });
      }
      setStart('');
      setEnd('');
      setReason('');
      toast.success(`Blacked out ${dates.length} day${dates.length > 1 ? 's' : ''} for all event types`, { id: tId });
      onReload();
    } catch (e: any) {
      toast.error(e.message, { id: tId });
    }
    setBusy(false);
  };

  const removeAll = async (ids: string[]) => {
    if (!confirm(`Remove ${ids.length} blackout row${ids.length > 1 ? 's' : ''} across all event types?`)) return;
    const tId = toast.loading('Removing…');
    try {
      for (const id of ids) {
        await cmsInvoke(password, { action: 'delete', table: 'event_blackout_dates', id });
      }
      toast.success('Removed', { id: tId });
      onReload();
    } catch (e: any) {
      toast.error(e.message, { id: tId });
    }
  };

  return (
    <div className="border border-klawsome-yellow/30 bg-klawsome-yellow/5 rounded-lg p-4 space-y-3">
      <div>
        <p className="text-klawsome-yellow font-heading uppercase text-xs tracking-wider">
          Blackout — all event types
        </p>
        <p className="text-white/60 text-xs mt-1">
          Block Private, Semi-Private, In-Store Rental, and Klawsome Mobile all at once for a date or range.
          Add multiple ranges for holidays, vacations, or launches you're planning ahead for.
        </p>
      </div>

      {allTypeGroups.length > 0 && (
        <ul className="space-y-1">
          {allTypeGroups.map((g) => (
            <li key={g.ids[0]} className="flex items-center gap-3 text-white/80 text-sm">
              <span className="font-mono text-white whitespace-nowrap">
                {g.start === g.end ? fmtISO(g.start) : `${fmtISO(g.start)} → ${fmtISO(g.end)}`}
              </span>
              <span className="flex-1 text-white/60">{g.reason || '—'}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeAll(g.ids)}
                className="text-red-400 h-7 px-2"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[150px_150px_1fr_auto] gap-2">
        <label className="flex flex-col gap-1 text-white/50 text-[10px] font-heading uppercase tracking-wider">
          Start
          <Input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="bg-white/10 border-white/20 text-white text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-white/50 text-[10px] font-heading uppercase tracking-wider">
          End (optional)
          <Input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="bg-white/10 border-white/20 text-white text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-white/50 text-[10px] font-heading uppercase tracking-wider">
          Reason
          <Input
            placeholder="e.g. Holiday closure"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="bg-white/10 border-white/20 text-white text-sm"
          />
        </label>
        <Button
          onClick={addAll}
          disabled={busy}
          className="self-end bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold"
        >
          <Plus className="w-4 h-4 mr-1" /> {busy ? 'Adding…' : 'Blackout all types'}
        </Button>
      </div>
    </div>
  );
}

function BookingScheduleEditorInner({ password }: { password: string }) {
  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [blackouts, setBlackouts] = useState<BlackoutRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, b] = await Promise.all([
        cmsInvoke(password, { action: 'read', table: 'event_availability' }),
        cmsInvoke(password, { action: 'read', table: 'event_blackout_dates' }),
      ]);
      setAvailability((a.rows || []) as AvailabilityRow[]);
      setBlackouts((b.rows || []) as BlackoutRow[]);
    } catch (e: any) {
      toast.error(e.message);
    }
    setLoading(false);
  }, [password]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="text-white/40 py-8 text-center">Loading schedule…</p>;

  return (
    <div className="space-y-5">
      <p className="text-white/60 text-sm">
        Set the days and times customers can book each service. Blackout dates block booking for a specific day.
        Changes take effect immediately on the booking flow.
      </p>
      <AllTypesBlackout password={password} blackouts={blackouts} onReload={load} />
      <Accordion type="multiple" className="space-y-3">
        {EVENT_TYPES.map((t) => (
          <AccordionItem
            key={t.key}
            value={t.key}
            className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg px-4"
          >
            <AccordionTrigger className="text-white font-heading hover:no-underline">
              <div className="flex flex-col items-start text-left">
                <span>{t.label}</span>
                <span className="text-white/40 text-xs font-body font-normal">{t.blurb}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <EventTypeEditor
                eventType={t.key}
                label={t.label}
                blurb={t.blurb}
                password={password}
                availability={availability.find((a) => a.event_type === t.key)}
                blackouts={blackouts
                  .filter((b) => b.event_type === t.key)
                  .sort((x, y) => x.blackout_date.localeCompare(y.blackout_date))}
                onReload={load}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default BookingScheduleEditor;