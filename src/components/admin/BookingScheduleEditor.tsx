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
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');

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
    if (!newDate) {
      toast.error('Pick a date first');
      return;
    }
    try {
      await cmsInvoke(password, {
        action: 'insert',
        table: 'event_blackout_dates',
        data: { event_type: eventType, blackout_date: newDate, reason: newReason || null },
      });
      setNewDate('');
      setNewReason('');
      toast.success('Blackout added');
      onReload();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const removeBlackout = async (id: string) => {
    if (!confirm('Remove this blackout?')) return;
    try {
      await cmsInvoke(password, { action: 'delete', table: 'event_blackout_dates', id });
      toast.success('Removed');
      onReload();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

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
          {blackouts.length === 0 ? (
            <p className="text-white/40 text-sm italic">No blackout dates</p>
          ) : (
            <ul className="space-y-1">
              {blackouts.map((b) => (
                <li key={b.id} className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="font-mono text-white">{b.blackout_date}</span>
                  <span className="flex-1 text-white/60">{b.reason || '—'}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBlackout(b.id)}
                    className="text-red-400 h-7 px-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <div className="grid grid-cols-[160px_1fr_auto] gap-2">
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="bg-white/10 border-white/20 text-white text-sm"
            />
            <Input
              placeholder="Reason (optional)"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="bg-white/10 border-white/20 text-white text-sm"
            />
            <Button
              onClick={addBlackout}
              className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>
    </div>
  );
}

export function BookingScheduleEditor({ password }: { password: string }) {
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