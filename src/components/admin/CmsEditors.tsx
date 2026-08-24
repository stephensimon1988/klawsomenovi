import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Plus, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export const cmsInvoke = async (password: string, body: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke('cms-admin', {
    body: { password, ...body },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

export function FieldRow({ label, value, onChange, multiline = false, bool = false, checked, onCheckedChange }: {
  label: string; value?: string; onChange?: (v: string) => void; multiline?: boolean;
  bool?: boolean; checked?: boolean; onCheckedChange?: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
      <label className="text-white/70 text-sm font-heading pt-2 md:text-right pr-4">{label}</label>
      <div className="md:col-span-2">
        {bool ? (
          <Switch checked={!!checked} onCheckedChange={(v) => onCheckedChange?.(v)} />
        ) : multiline ? (
          <Textarea value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/30 min-h-[80px]" />
        ) : (
          <Input value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
        )}
      </div>
    </div>
  );
}

export type CmsField = { key: string; label: string; multiline?: boolean; type?: 'text' | 'textarea' | 'bool' };

/** Single-row editor (site_settings, homepage_content) */
export function SingleRowEditor({ table, password, fields }: {
  table: string; password: string; fields: CmsField[];
}) {
  const [row, setRow] = useState<Record<string, any>>({});
  const [original, setOriginal] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cmsInvoke(password, { action: 'read', table });
      const r = res.rows?.[0] || {};
      const mapped: Record<string, any> = {};
      fields.forEach((f) => (mapped[f.key] = f.type === 'bool' ? !!r[f.key] : (r[f.key] ?? '')));
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
        <FieldRow
          key={f.key}
          label={f.label}
          bool={f.type === 'bool'}
          checked={!!row[f.key]}
          onCheckedChange={(v) => setRow({ ...row, [f.key]: v })}
          value={row[f.key] ?? ''}
          onChange={(v) => setRow({ ...row, [f.key]: v })}
          multiline={f.multiline || f.type === 'textarea'}
        />
      ))}
      <div className="flex justify-end pt-2">
        <Button onClick={save} disabled={saving || !dirty} className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold">
          <Save className="w-4 h-4 mr-2" />{saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

export type CmsColumn = {
  key: string; label: string;
  type?: 'text' | 'textarea' | 'bool' | 'array' | 'number' | 'image';
  width?: string;
};

/** Multi-row editor with optional search + group filter */
export function MultiRowEditor({ table, password, columns, defaultRow, searchKeys, filterKey, filterLabel, note, onSaved }: {
  table: string; password: string;
  columns: CmsColumn[];
  defaultRow?: Record<string, unknown>;
  searchKeys?: string[];
  filterKey?: string;
  filterLabel?: string;
  note?: string;
  /** Runs after a row is saved (used to push rental prices to Shopify). */
  onSaved?: () => void;
}) {
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('__all__');

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
      const data: Record<string, any> = {};
      columns.forEach((c) => {
        let v = edited[c.key];
        if (c.type === 'number') v = Number(v) || 0;
        data[c.key] = v;
      });
      if ('sort_order' in edited && !columns.some((c) => c.key === 'sort_order')) {
        data.sort_order = Number(edited.sort_order) || 0;
      }
      await cmsInvoke(password, { action: 'update', table, id, data });
      toast.success('Row saved');
      cancelEdit(id);
      load();
      onSaved?.();
    } catch (e: any) { toast.error(e.message); }
    setSaving(null);
  };

  const addRow = async () => {
    try {
      const newData: Record<string, any> = { ...(defaultRow || {}) };
      columns.forEach((c) => {
        if (!(c.key in newData)) {
          if (c.type === 'bool') newData[c.key] = true;
          else if (c.type === 'array') newData[c.key] = [];
          else if (c.type === 'number') newData[c.key] = 0;
          else newData[c.key] = '';
        }
      });
      if (!('sort_order' in newData)) newData.sort_order = rows.length;
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

  const filterValues = useMemo(() => {
    if (!filterKey) return [];
    return Array.from(new Set(rows.map((r) => r[filterKey]).filter(Boolean))).sort();
  }, [rows, filterKey]);

  const visibleRows = useMemo(() => {
    let list = rows;
    if (filterKey && filter !== '__all__') list = list.filter((r) => r[filterKey] === filter);
    if (query.trim() && searchKeys?.length) {
      const q = query.toLowerCase();
      list = list.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
    }
    return list;
  }, [rows, filter, filterKey, query, searchKeys]);

  if (loading) return <p className="text-white/40 py-8 text-center">Loading…</p>;

  return (
    <div className="space-y-4">
      {note && <p className="text-xs text-klawsome-yellow/80 font-heading">{note}</p>}

      {(searchKeys?.length || filterKey) && (
        <div className="flex flex-wrap gap-3 items-center">
          {searchKeys?.length ? (
            <div className="relative">
              <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="pl-8 w-64 bg-white/10 border-white/20 text-white text-sm" />
            </div>
          ) : null}
          {filterKey && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-md text-white text-sm px-3 py-2"
            >
              <option value="__all__" className="text-black">All {filterLabel || filterKey}</option>
              {filterValues.map((v) => (
                <option key={String(v)} value={String(v)} className="text-black">{String(v)}</option>
              ))}
            </select>
          )}
          <span className="text-white/40 text-xs">{visibleRows.length} of {rows.length}</span>
        </div>
      )}

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
            {visibleRows.map((row) => {
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
                          <Input
                            type={c.type === 'number' ? 'number' : 'text'}
                            value={isEditing[c.key] ?? ''}
                            onChange={(e) => updateField(row.id, c.key, e.target.value)}
                            className="bg-white/10 border-white/20 text-white text-sm"
                          />
                        )
                      ) : c.type === 'bool' ? (
                        <Badge variant="outline" className={row[c.key] ? 'text-green-300 border-green-500/30' : 'text-red-300 border-red-500/30'}>
                          {row[c.key] ? 'Yes' : 'No'}
                        </Badge>
                      ) : c.type === 'array' ? (
                        <span className="text-sm">{(row[c.key] || []).join(', ') || '—'}</span>
                      ) : c.type === 'image' ? (
                        row[c.key] ? (
                          <img src={row[c.key]} alt="" loading="lazy" className="w-16 h-16 object-cover rounded-md border border-white/10" />
                        ) : <span className="text-sm">—</span>
                      ) : (
                        <span className="text-sm line-clamp-2">{row[c.key] === 0 ? '0' : (row[c.key] || '—')}</span>
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
