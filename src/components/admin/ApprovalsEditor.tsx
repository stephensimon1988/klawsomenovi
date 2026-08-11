import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, X, RefreshCw, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { cmsInvoke } from '@/components/admin/CmsEditors';

interface ApprovalRow {
  id: string;
  request_code: string;
  event_type: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  requested_date: string | null;
  zip: string;
  city: string;
  zip_level: string;
  is_indoors: boolean;
  over_200: boolean;
  party_size: number | null;
  customer_notes: string;
  status: string;
  staff_note: string;
  decided_at: string | null;
  created_at: string;
}

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export function ApprovalsEditor({ password }: { password: string }) {
  const [rows, setRows] = useState<ApprovalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await cmsInvoke(password, { action: 'read', table: 'booking_approval_requests' });
      const all = (res.rows || []) as ApprovalRow[];
      all.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setRows(all);
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  // Live refresh whenever any approval status changes.
  useEffect(() => {
    const channel = supabase
      .channel('admin-approvals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'booking_approval_status' }, () => { load(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  const decide = async (row: ApprovalRow, decision: 'approved' | 'denied') => {
    setBusy(row.id);
    try {
      await cmsInvoke(password, {
        action: 'decide_approval',
        id: row.id,
        decision,
        staff_note: notes[row.id] || '',
      });
      toast.success(decision === 'approved' ? 'Approved — customer is unlocked.' : 'Request denied.');
      await load();
    } catch (e: any) { toast.error(e.message); }
    setBusy(null);
  };

  const pending = rows.filter((r) => r.status === 'pending');

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white font-heading flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-klawsome-yellow" />
          Booking Approvals
          {pending.length > 0 && (
            <Badge className="bg-klawsome-red text-white">{pending.length} pending</Badge>
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={load} className="text-white/60 hover:text-white">
          <RefreshCw className="w-4 h-4 mr-2" />Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-white/50 text-sm font-body">
          Requests from customers in restricted ZIP codes. Call them back, then approve to unlock their
          booking instantly — or deny it.
        </p>
        {loading && <p className="text-white/40 py-8 text-center">Loading…</p>}
        {!loading && rows.length === 0 && (
          <p className="text-white/40 py-8 text-center">No approval requests yet.</p>
        )}
        {rows.map((r) => (
          <div
            key={r.id}
            className={`rounded-xl border p-4 space-y-3 ${
              r.status === 'pending'
                ? 'border-klawsome-yellow/50 bg-klawsome-yellow/5'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-bold text-white">{r.contact_name}</span>
              <Badge variant="outline" className="text-white/70 border-white/30">#{r.request_code}</Badge>
              <Badge
                className={
                  r.status === 'approved' ? 'bg-green-600 text-white'
                  : r.status === 'denied' ? 'bg-klawsome-red text-white'
                  : 'bg-klawsome-yellow text-klawsome-navy'
                }
              >
                {r.status}
              </Badge>
              <Badge variant="outline" className="text-white/70 border-white/30 uppercase">{r.event_type}</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-white/80 font-body">
              <p><span className="text-white/50">Phone:</span> <a className="underline" href={`tel:${r.contact_phone.replace(/[^0-9+]/g, '')}`}>{r.contact_phone}</a></p>
              <p><span className="text-white/50">Email:</span> {r.contact_email || '—'}</p>
              <p><span className="text-white/50">ZIP:</span> {r.zip}{r.city ? ` — ${r.city}` : ''} <span className="text-white/40">({r.zip_level})</span></p>
              <p><span className="text-white/50">Event date:</span> {r.requested_date || '—'}</p>
              <p><span className="text-white/50">Indoors:</span> {r.is_indoors ? 'Yes' : 'No'}</p>
              <p><span className="text-white/50">Over 200 guests:</span> {r.over_200 ? 'Yes' : 'No'}</p>
              <p><span className="text-white/50">Party size:</span> {r.party_size ?? '—'}</p>
              <p><span className="text-white/50">Submitted:</span> {fmt(r.created_at)}</p>
            </div>
            {r.customer_notes && (
              <p className="text-sm text-white/70 font-body"><span className="text-white/50">Notes:</span> {r.customer_notes}</p>
            )}
            {r.status === 'pending' ? (
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <Input
                  value={notes[r.id] ?? ''}
                  onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                  placeholder="Internal note (optional)"
                  className="bg-white/10 border-white/20 text-white text-sm md:flex-1"
                />
                <div className="flex gap-2">
                  <Button size="sm" disabled={busy === r.id} onClick={() => decide(r, 'approved')} className="bg-green-600 hover:bg-green-700 text-white rounded-full">
                    <Check className="w-4 h-4 mr-1" />Approve
                  </Button>
                  <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => decide(r, 'denied')} className="rounded-full border-klawsome-red text-klawsome-red hover:bg-klawsome-red hover:text-white">
                    <X className="w-4 h-4 mr-1" />Deny
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/50 font-body">
                Decided {fmt(r.decided_at)}{r.staff_note ? ` — ${r.staff_note}` : ''}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
