import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// Table/Badge also used by multi-row editor
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Lock, Settings, Save, Plus, Trash2 } from 'lucide-react';

import { toast } from 'sonner';

// ─── CMS helpers ────────────────────────────────────────────
const cmsInvoke = async (password: string, body: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke('cms-admin', {
    body: { password, ...body },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

// ─── Reusable field editor ──────────────────────────────────
function FieldRow({ label, value, onChange, multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
      <label className="text-white/70 text-sm font-heading pt-2 md:text-right pr-4">{label}</label>
      <div className="md:col-span-2">
        {multiline ? (
          <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/30 min-h-[80px]" />
        ) : (
          <Input value={value} onChange={(e) => onChange(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
        )}
      </div>
    </div>
  );
}

// ─── Single-row editor (site_settings, homepage_content, birthdays_content) ─
function SingleRowEditor({ table, password, fields }: {
  table: string; password: string;
  fields: { key: string; label: string; multiline?: boolean }[];
}) {
  const [row, setRow] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cmsInvoke(password, { action: 'read', table });
      const r = res.rows?.[0] || {};
      const mapped: Record<string, string> = {};
      fields.forEach((f) => (mapped[f.key] = r[f.key] ?? ''));
      setRow(mapped);
      setOriginal({ ...mapped, id: r.id });
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }, [table, password, fields]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      await cmsInvoke(password, { action: 'upsert', table, data: { ...row, id: original.id } });
      toast.success('Saved!');
      setOriginal({ ...row, id: original.id });
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  if (loading) return <p className="text-white/40 py-8 text-center">Loading…</p>;

  const dirty = fields.some((f) => row[f.key] !== original[f.key]);

  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <FieldRow key={f.key} label={f.label} value={row[f.key] || ''} onChange={(v) => setRow({ ...row, [f.key]: v })} multiline={f.multiline} />
      ))}
      <div className="flex justify-end pt-2">
        <Button onClick={save} disabled={saving || !dirty} className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold">
          <Save className="w-4 h-4 mr-2" />{saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

// ─── Multi-row editor (token_tiers, news_articles, etc.) ────
function MultiRowEditor({ table, password, columns, defaultRow }: {
  table: string; password: string;
  columns: { key: string; label: string; type?: 'text' | 'textarea' | 'bool' | 'array'; width?: string }[];
  defaultRow?: Record<string, unknown>;
}) {
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cmsInvoke(password, { action: 'read', table });
      setRows(res.rows || []);
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }, [table, password]);

  useEffect(() => { load(); }, [load]);

  const startEdit = (row: any) => setEditing({ ...editing, [row.id]: { ...row } });
  const cancelEdit = (id: string) => {
    const next = { ...editing };
    delete next[id];
    setEditing(next);
  };
  const updateField = (id: string, key: string, value: any) => {
    setEditing({ ...editing, [id]: { ...editing[id], [key]: value } });
  };

  const saveRow = async (id: string) => {
    setSaving(id);
    try {
      const edited = editing[id];
      const { id: _, ...data } = edited;
      await cmsInvoke(password, { action: 'update', table, id, data });
      toast.success('Row saved');
      cancelEdit(id);
      load();
    } catch (e: any) { toast.error(e.message); }
    setSaving(null);
  };

  const addRow = async () => {
    try {
      const newData = defaultRow || {};
      columns.forEach((c) => {
        if (!(c.key in (newData as any))) {
          if (c.type === 'bool') (newData as any)[c.key] = true;
          else if (c.type === 'array') (newData as any)[c.key] = [];
          else (newData as any)[c.key] = '';
        }
      });
      (newData as any).sort_order = rows.length;
      await cmsInvoke(password, { action: 'insert', table, data: newData });
      toast.success('Row added');
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const deleteRow = async (id: string) => {
    if (!confirm('Delete this row?')) return;
    try {
      await cmsInvoke(password, { action: 'delete', table, id });
      toast.success('Deleted');
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  if (loading) return <p className="text-white/40 py-8 text-center">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              {columns.map((c) => (
                <TableHead key={c.key} className="text-white/60 font-heading" style={{ width: c.width }}>{c.label}</TableHead>
              ))}
              <TableHead className="text-white/60 font-heading w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const isEditing = editing[row.id];
              return (
                <TableRow key={row.id} className="border-white/10 hover:bg-white/5">
                  {columns.map((c) => (
                    <TableCell key={c.key} className="text-white/80 align-top">
                      {isEditing ? (
                        c.type === 'bool' ? (
                          <Switch checked={!!isEditing[c.key]} onCheckedChange={(v) => updateField(row.id, c.key, v)} />
                        ) : c.type === 'array' ? (
                          <Textarea
                            value={(isEditing[c.key] || []).join('\n')}
                            onChange={(e) => updateField(row.id, c.key, e.target.value.split('\n'))}
                            className="bg-white/10 border-white/20 text-white text-sm min-h-[60px]"
                            placeholder="One per line"
                          />
                        ) : c.type === 'textarea' ? (
                          <Textarea value={isEditing[c.key] || ''} onChange={(e) => updateField(row.id, c.key, e.target.value)} className="bg-white/10 border-white/20 text-white text-sm min-h-[60px]" />
                        ) : (
                          <Input value={isEditing[c.key] || ''} onChange={(e) => updateField(row.id, c.key, e.target.value)} className="bg-white/10 border-white/20 text-white text-sm" />
                        )
                      ) : (
                        c.type === 'bool' ? (
                          <Badge variant="outline" className={row[c.key] ? 'text-green-300 border-green-500/30' : 'text-red-300 border-red-500/30'}>
                            {row[c.key] ? 'Yes' : 'No'}
                          </Badge>
                        ) : c.type === 'array' ? (
                          <span className="text-sm">{(row[c.key] || []).join(', ') || '—'}</span>
                        ) : (
                          <span className="text-sm line-clamp-2">{row[c.key] || '—'}</span>
                        )
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="align-top">
                    <div className="flex gap-1">
                      {isEditing ? (
                        <>
                          <Button size="sm" onClick={() => saveRow(row.id)} disabled={saving === row.id} className="bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-2">
                            {saving === row.id ? '…' : 'Save'}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => cancelEdit(row.id)} className="text-white/50 text-xs h-7 px-2">Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => startEdit(row)} className="text-klawsome-yellow text-xs h-7 px-2">Edit</Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteRow(row.id)} className="text-red-400 text-xs h-7 px-2"><Trash2 className="w-3 h-3" /></Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Button onClick={addRow} className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold">
        <Plus className="w-4 h-4 mr-2" />Add Row
      </Button>
    </div>
  );
}

// ─── Store Hours Editor ─────────────────────────────────────
function StoreHoursEditor({ password }: { password: string }) {
  const [hours, setHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cmsInvoke(password, { action: 'read', table: 'store_hours' });
      setHours((res.rows || []).sort((a: any, b: any) => a.sort_order - b.sort_order));
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const update = (index: number, field: string, value: any) => {
    const next = [...hours];
    next[index] = { ...next[index], [field]: value };
    setHours(next);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const h of hours) {
        await cmsInvoke(password, { action: 'update', table: 'store_hours', id: h.id, data: { open_time: h.open_time, close_time: h.close_time, is_closed: h.is_closed } });
      }
      toast.success('Hours saved!');
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  if (loading) return <p className="text-white/40 py-8 text-center">Loading…</p>;

  return (
    <div className="space-y-3">
      {hours.map((h, i) => (
        <div key={h.id} className="grid grid-cols-4 gap-3 items-center">
          <span className="text-white font-heading text-sm">{h.day_label}</span>
          <Input value={h.open_time || ''} onChange={(e) => update(i, 'open_time', e.target.value)} disabled={h.is_closed} placeholder="10:00 AM" className="bg-white/10 border-white/20 text-white text-sm" />
          <Input value={h.close_time || ''} onChange={(e) => update(i, 'close_time', e.target.value)} disabled={h.is_closed} placeholder="8:00 PM" className="bg-white/10 border-white/20 text-white text-sm" />
          <div className="flex items-center gap-2">
            <Switch checked={h.is_closed} onCheckedChange={(v) => update(i, 'is_closed', v)} />
            <span className="text-white/50 text-xs">Closed</span>
          </div>
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <Button onClick={saveAll} disabled={saving} className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold">
          <Save className="w-4 h-4 mr-2" />{saving ? 'Saving…' : 'Save Hours'}
        </Button>
      </div>
    </div>
  );
}




// ─── Main Admin Component ───────────────────────────────────
const KlawsomeAdmin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('admin-auth', { body: { password } });
      if (fnError) throw fnError;
      if (data?.valid) {
        setAuthenticated(true);
        setStoredPassword(password);
        sessionStorage.setItem('klawsome-admin', 'true');
        sessionStorage.setItem('klawsome-admin-pw', password);
      } else {
        setError('Incorrect password');
      }
    } catch { setError('Authentication failed'); }
    setLoading(false);
  };

  useEffect(() => {
    const cached = sessionStorage.getItem('klawsome-admin');
    const pw = sessionStorage.getItem('klawsome-admin-pw');
    if (cached === 'true' && pw) {
      setAuthenticated(true);
      setStoredPassword(pw);
    }
  }, []);

  // Hide admin route from search engines
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Admin · Klawsome Arcade';

    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex';
    document.head.appendChild(robots);

    const googlebot = document.createElement('meta');
    googlebot.name = 'googlebot';
    googlebot.content = 'noindex, nofollow';
    document.head.appendChild(googlebot);

    return () => {
      document.title = prevTitle;
      robots.remove();
      googlebot.remove();
    };
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-klawsome-navy flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Lock className="w-10 h-10 mx-auto mb-3 text-klawsome-yellow" />
            <CardTitle className="font-heading text-2xl text-white">Klawsome Command Center</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" disabled={loading || !password} className="w-full bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold">
                {loading ? 'Checking…' : 'Enter'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-klawsome-navy p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-klawsome-yellow" />
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white">Klawsome Command Center</h1>
          </div>
          <Button onClick={() => { sessionStorage.removeItem('klawsome-admin'); sessionStorage.removeItem('klawsome-admin-pw'); setAuthenticated(false); }} variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">Log out</Button>
        </div>

        <Tabs defaultValue="vital" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="vital" className="data-[state=active]:bg-klawsome-yellow data-[state=active]:text-klawsome-navy text-white/60 font-heading text-xs"><Settings className="w-3 h-3 mr-1" />Vital Info</TabsTrigger>
            <TabsTrigger value="hours" className="data-[state=active]:bg-klawsome-yellow data-[state=active]:text-klawsome-navy text-white/60 font-heading text-xs">🕐 Hours</TabsTrigger>
          </TabsList>

          {/* ─── Vital Info ─── */}
          <TabsContent value="vital">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-white font-heading">Vital Info</CardTitle></CardHeader>
              <CardContent>
                <SingleRowEditor password={storedPassword} table="site_settings" fields={[
                  { key: 'business_name', label: 'Business Name' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'email', label: 'General Email' },
                  { key: 'events_email', label: 'Events / Booking Email' },
                  { key: 'address', label: 'Address' },
                  { key: 'google_maps_url', label: 'Google Maps URL' },
                  { key: 'instagram_url', label: 'Instagram URL' },
                  { key: 'tiktok_url', label: 'TikTok URL' },
                  { key: 'facebook_url', label: 'Facebook URL' },
                  { key: 'youtube_url', label: 'YouTube URL' },
                ]} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Store Hours ─── */}
          <TabsContent value="hours">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-white font-heading">Store Hours</CardTitle></CardHeader>
              <CardContent><StoreHoursEditor password={storedPassword} /></CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default KlawsomeAdmin;
