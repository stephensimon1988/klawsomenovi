import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Lock, Settings, Home, Newspaper, Cake, Briefcase, Building2, Save, Plus, Trash2,
  ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import ImageUploadField from '@/components/ImageUploadField';
import ColorPickerField from '@/components/ColorPickerField';
import DynamicSection, { LAYOUT_TEMPLATES } from '@/components/DynamicSection';
import SectionWrapper from '@/components/SectionWrapper';

const RichTextEditor = lazy(() => import('@/components/RichTextEditor'));

// ─── CMS helpers ────────────────────────────────────────────
const cmsInvoke = async (password: string, body: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke('cms-admin', {
    body: { password, ...body },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

// ─── Reusable inline field ──────────────────────────────────
function InlineField({ label, value, onChange, multiline = false, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-white/60 text-xs font-heading">{label}</label>
      {multiline ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="bg-white/10 border-white/20 text-white text-sm min-h-[60px]" />
      ) : (
        <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="bg-white/10 border-white/20 text-white text-sm" />
      )}
    </div>
  );
}

// ─── Mini table editor (reusable for steps, tiers, articles, etc.) ─
function MiniTableEditor({ password, table, columns, defaultRow, filterFn }: {
  password: string;
  table: string;
  columns: { key: string; label: string; type?: 'text' | 'textarea' | 'bool' | 'array'; width?: string }[];
  defaultRow?: Record<string, unknown>;
  filterFn?: (row: any) => boolean;
}) {
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cmsInvoke(password, { action: 'read', table });
      let r = res.rows || [];
      if (filterFn) r = r.filter(filterFn);
      setRows(r);
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }, [table, password]);

  useEffect(() => { load(); }, [load]);

  const startEdit = (row: any) => setEditing({ ...editing, [row.id]: { ...row } });
  const cancelEdit = (id: string) => { const next = { ...editing }; delete next[id]; setEditing(next); };
  const updateField = (id: string, key: string, value: any) => {
    setEditing({ ...editing, [id]: { ...editing[id], [key]: value } });
  };

  const saveRow = async (id: string) => {
    setSaving(id);
    try {
      const edited = editing[id];
      const { id: _, ...data } = edited;
      await cmsInvoke(password, { action: 'update', table, id, data });
      toast.success('Saved');
      cancelEdit(id);
      load();
    } catch (e: any) { toast.error(e.message); }
    setSaving(null);
  };

  const addRow = async () => {
    try {
      const newData = { ...(defaultRow || {}) };
      columns.forEach((c) => {
        if (!(c.key in newData)) {
          if (c.type === 'bool') (newData as any)[c.key] = true;
          else if (c.type === 'array') (newData as any)[c.key] = [];
          else (newData as any)[c.key] = '';
        }
      });
      (newData as any).sort_order = rows.length;
      await cmsInvoke(password, { action: 'insert', table, data: newData });
      toast.success('Added');
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

  if (loading) return <p className="text-white/40 py-4 text-center text-sm">Loading…</p>;

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              {columns.map((c) => (
                <TableHead key={c.key} className="text-white/60 font-heading text-xs" style={{ width: c.width }}>{c.label}</TableHead>
              ))}
              <TableHead className="text-white/60 font-heading text-xs w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const isEditing = editing[row.id];
              return (
                <TableRow key={row.id} className="border-white/10 hover:bg-white/5">
                  {columns.map((c) => (
                    <TableCell key={c.key} className="text-white/80 align-top py-1.5">
                      {isEditing ? (
                        c.type === 'bool' ? (
                          <Switch checked={!!isEditing[c.key]} onCheckedChange={(v) => updateField(row.id, c.key, v)} />
                        ) : c.type === 'array' ? (
                          <Textarea value={(isEditing[c.key] || []).join('\n')} onChange={(e) => updateField(row.id, c.key, e.target.value.split('\n'))} className="bg-white/10 border-white/20 text-white text-xs min-h-[50px]" placeholder="One per line" />
                        ) : c.type === 'textarea' ? (
                          <Textarea value={isEditing[c.key] || ''} onChange={(e) => updateField(row.id, c.key, e.target.value)} className="bg-white/10 border-white/20 text-white text-xs min-h-[50px]" />
                        ) : (
                          <Input value={isEditing[c.key] || ''} onChange={(e) => updateField(row.id, c.key, e.target.value)} className="bg-white/10 border-white/20 text-white text-xs h-8" />
                        )
                      ) : (
                        c.type === 'bool' ? (
                          <Badge variant="outline" className={`text-xs ${row[c.key] ? 'text-green-300 border-green-500/30' : 'text-red-300 border-red-500/30'}`}>
                            {row[c.key] ? 'Yes' : 'No'}
                          </Badge>
                        ) : c.type === 'array' ? (
                          <span className="text-xs">{(row[c.key] || []).join(', ') || '—'}</span>
                        ) : (
                          <span className="text-xs line-clamp-2">{row[c.key] || '—'}</span>
                        )
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="align-top py-1.5">
                    <div className="flex gap-1">
                      {isEditing ? (
                        <>
                          <Button size="sm" onClick={() => saveRow(row.id)} disabled={saving === row.id} className="bg-green-600 hover:bg-green-700 text-white text-xs h-6 px-2">{saving === row.id ? '…' : 'Save'}</Button>
                          <Button size="sm" variant="ghost" onClick={() => cancelEdit(row.id)} className="text-white/50 text-xs h-6 px-1">✕</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => startEdit(row)} className="text-klawsome-yellow text-xs h-6 px-2">Edit</Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteRow(row.id)} className="text-red-400 text-xs h-6 px-1"><Trash2 className="w-3 h-3" /></Button>
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
      <Button onClick={addRow} size="sm" className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold text-xs h-7">
        <Plus className="w-3 h-3 mr-1" />Add Row
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

  if (loading) return <p className="text-white/40 py-4 text-center text-sm">Loading…</p>;

  return (
    <div className="space-y-2">
      {hours.map((h, i) => (
        <div key={h.id} className="grid grid-cols-4 gap-2 items-center">
          <span className="text-white font-heading text-xs">{h.day_label}</span>
          <Input value={h.open_time || ''} onChange={(e) => update(i, 'open_time', e.target.value)} disabled={h.is_closed} placeholder="10:00 AM" className="bg-white/10 border-white/20 text-white text-xs h-8" />
          <Input value={h.close_time || ''} onChange={(e) => update(i, 'close_time', e.target.value)} disabled={h.is_closed} placeholder="8:00 PM" className="bg-white/10 border-white/20 text-white text-xs h-8" />
          <div className="flex items-center gap-1">
            <Switch checked={h.is_closed} onCheckedChange={(v) => update(i, 'is_closed', v)} />
            <span className="text-white/50 text-xs">Closed</span>
          </div>
        </div>
      ))}
      <div className="flex justify-end pt-1">
        <Button onClick={saveAll} disabled={saving} size="sm" className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold text-xs h-7">
          <Save className="w-3 h-3 mr-1" />{saving ? 'Saving…' : 'Save Hours'}
        </Button>
      </div>
    </div>
  );
}

// ─── Content Block Editor ───────────────────────────────────
const BLOCK_TYPES = [
  { type: 'heading', icon: 'H', label: 'Heading' },
  { type: 'richtext', icon: '📝', label: 'Rich Text' },
  { type: 'image', icon: '🖼', label: 'Image' },
  { type: 'video', icon: '🎬', label: 'Video' },
  { type: 'iframe', icon: '🔗', label: 'Embed/iFrame' },
  { type: 'code', icon: '💻', label: 'Code' },
  { type: 'list', icon: '📋', label: 'List' },
  { type: 'button', icon: '▶', label: 'Button' },
  { type: 'divider', icon: '—', label: 'Divider' },
  
  { type: 'pricing', icon: '💰', label: 'Token Prices' },
  { type: 'hours', icon: '🕐', label: 'Store Hours' },
  { type: 'reviews', icon: '⭐', label: 'Google Reviews' },
  { type: 'news', icon: '📰', label: 'News Articles' },
  { type: 'faq', icon: '❓', label: 'FAQ' },
  { type: 'jobs', icon: '💼', label: 'Job Listings' },
  { type: 'party_options', icon: '🎂', label: 'Party Options' },
  { type: 'templates', icon: '📄', label: 'Invite Templates' },
  { type: 'cards', icon: '🃏', label: 'Cards Grid' },
];

function ContentBlockEditor({ password, sectionId, onBlocksChanged }: { password: string; sectionId: string; onBlocksChanged?: () => void }) {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cmsInvoke(password, { action: 'read', table: 'section_content_blocks' });
      const filtered = (res.rows || [])
        .filter((b: any) => b.section_id === sectionId)
        .sort((a: any, b: any) => a.row_order - b.row_order);
      setBlocks(filtered);
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }, [password, sectionId]);

  useEffect(() => { load(); }, [load]);

  const addBlock = async (blockType: string) => {
    try {
      const defaultContent: Record<string, any> =
        blockType === 'heading' ? { text: 'New Heading' } :
        blockType === 'richtext' ? { html: '<p>Your text here...</p>' } :
        blockType === 'text' ? { text: 'Your text here...' } :
        blockType === 'image' ? { url: '', alt: '' } :
        blockType === 'video' ? { url: '', alt: '' } :
        blockType === 'iframe' ? { url: '', title: '' } :
        blockType === 'code' ? { code: '// Your code here', language: 'javascript' } :
        blockType === 'list' ? { items: ['Item 1', 'Item 2', 'Item 3'] } :
        blockType === 'button' ? { text: 'Learn More', url: '/' } :
        blockType === 'divider' ? {} :
        blockType === 'faq' ? { page: 'general' } :
        blockType === 'jobs' ? { category: '' } :
        blockType === 'cards' ? { items: [{ icon: '⭐', title: 'Card 1', description: 'Description' }] } :
        {};
      await cmsInvoke(password, {
        action: 'insert', table: 'section_content_blocks',
        data: { section_id: sectionId, column_index: 0, row_order: blocks.length, block_type: blockType, content: defaultContent }
      });
      toast.success('Added!');
      load();
      onBlocksChanged?.();
    } catch (e: any) { toast.error(e.message); }
  };

  const updateBlock = async (id: string, updates: Record<string, any>) => {
    setSaving(id);
    try {
      await cmsInvoke(password, { action: 'update', table: 'section_content_blocks', id, data: updates });
      toast.success('Saved');
      load();
      onBlocksChanged?.();
    } catch (e: any) { toast.error(e.message); }
    setSaving(null);
  };

  const deleteBlock = async (id: string) => {
    if (!confirm('Remove this item?')) return;
    try {
      await cmsInvoke(password, { action: 'delete', table: 'section_content_blocks', id });
      toast.success('Removed');
      load();
      onBlocksChanged?.();
    } catch (e: any) { toast.error(e.message); }
  };

  const moveBlock = async (id: string, direction: 'up' | 'down') => {
    const idx = blocks.findIndex(b => b.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= blocks.length) return;
    try {
      const a = blocks[idx];
      const b = blocks[swapIdx];
      await cmsInvoke(password, { action: 'update', table: 'section_content_blocks', id: a.id, data: { row_order: b.row_order } });
      await cmsInvoke(password, { action: 'update', table: 'section_content_blocks', id: b.id, data: { row_order: a.row_order } });
      load();
      onBlocksChanged?.();
    } catch (e: any) { toast.error(e.message); }
  };

  if (loading) return <p className="text-white/40 py-2 text-center text-xs">Loading…</p>;

  return (
    <div className="space-y-3">
      <p className="text-white/30 text-[10px] italic">↑↓ Items at the top are most prominent on the page.</p>
      {blocks.map((block, idx) => (
        <div key={block.id} className="flex gap-2 items-start">
          <span className="text-klawsome-yellow/60 text-xs font-mono pt-3 w-5 text-right flex-shrink-0">{idx + 1}</span>
          <div className="flex-1">
            <BlockItem block={block} saving={saving}
              onUpdate={updateBlock} onDelete={deleteBlock}
              onMove={moveBlock} isFirst={idx === 0} isLast={idx === blocks.length - 1} />
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="text-white/30 text-xs self-center mr-1">Add:</span>
        {BLOCK_TYPES.map(item => (
          <Button key={item.type} size="sm" variant="ghost"
            onClick={() => addBlock(item.type)}
            className="text-white/60 hover:text-klawsome-yellow text-xs h-7 px-2 border border-white/10 hover:border-klawsome-yellow/30">
            <span className="mr-1">{item.icon}</span>{item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function BlockItem({ block, saving, onUpdate, onDelete, onMove, isFirst, isLast }: {
  block: any; saving: string | null;
  onUpdate: (id: string, data: any) => void; onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean; isLast: boolean;
}) {
  const [localContent, setLocalContent] = useState(block.content || {});

  const handleSave = () => {
    onUpdate(block.id, { block_type: block.block_type, content: localContent });
  };

  const typeLabel = BLOCK_TYPES.find(t => t.type === block.block_type);

  // Specialized blocks that pull from DB tables — no inline editing needed
  const isDataBlock = ['pricing', 'hours', 'reviews', 'news', 'party_options', 'templates'].includes(block.block_type);

  return (
    <div className="bg-white/5 rounded-lg p-3 space-y-2 border border-white/10">
      <div className="flex items-center gap-2">
        <span className="text-lg">{typeLabel?.icon || '?'}</span>
        <span className="text-white/60 text-xs font-heading font-bold uppercase">{typeLabel?.label || block.block_type}</span>
        <div className="flex-1" />
        <Button size="sm" variant="ghost" onClick={() => onMove(block.id, 'up')} disabled={isFirst}
          className="text-white/40 h-6 w-6 p-0"><ArrowUp className="w-3 h-3" /></Button>
        <Button size="sm" variant="ghost" onClick={() => onMove(block.id, 'down')} disabled={isLast}
          className="text-white/40 h-6 w-6 p-0"><ArrowDown className="w-3 h-3" /></Button>
        {!isDataBlock && (
          <Button size="sm" variant="ghost" onClick={handleSave} disabled={saving === block.id}
            className="text-green-400 text-xs h-6 px-2"><Save className="w-3 h-3 mr-1" />{saving === block.id ? '…' : 'Save'}</Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onDelete(block.id)}
          className="text-red-400 text-xs h-6 px-1"><Trash2 className="w-3 h-3" /></Button>
      </div>

      {/* Data blocks — auto-pull from DB */}
      {isDataBlock && (
        <p className="text-white/30 text-xs italic">This block automatically pulls data from the database. Edit it in the Settings tab or dedicated data tables.</p>
      )}

      {/* Heading */}
      {block.block_type === 'heading' && (
        <Input value={localContent.text || ''} onChange={e => setLocalContent({ ...localContent, text: e.target.value })}
          placeholder="Heading text" className="bg-white/10 border-white/20 text-white text-sm h-9" />
      )}

      {/* Rich Text (WYSIWYG) */}
      {block.block_type === 'richtext' && (
        <Suspense fallback={<p className="text-white/30 text-xs">Loading editor…</p>}>
          <RichTextEditor value={localContent.html || ''} onChange={html => setLocalContent({ ...localContent, html })} />
        </Suspense>
      )}

      {/* Plain text */}
      {block.block_type === 'text' && (
        <Textarea value={localContent.text || ''} onChange={e => setLocalContent({ ...localContent, text: e.target.value })}
          placeholder="Body text" className="bg-white/10 border-white/20 text-white text-sm min-h-[60px]" />
      )}

      {/* Image */}
      {block.block_type === 'image' && (
        <div className="space-y-1">
          <ImageUploadField value={localContent.url || ''} onChange={url => setLocalContent({ ...localContent, url })} />
          <Input value={localContent.alt || ''} onChange={e => setLocalContent({ ...localContent, alt: e.target.value })}
            placeholder="Alt text (for accessibility)" className="bg-white/10 border-white/20 text-white text-xs h-8" />
        </div>
      )}

      {/* Video */}
      {block.block_type === 'video' && (
        <div className="space-y-1">
          <Input value={localContent.url || ''} onChange={e => setLocalContent({ ...localContent, url: e.target.value })}
            placeholder="YouTube, Vimeo, or direct video URL" className="bg-white/10 border-white/20 text-white text-sm h-9" />
        </div>
      )}

      {/* iFrame / Embed */}
      {block.block_type === 'iframe' && (
        <div className="space-y-1">
          <Input value={localContent.url || ''} onChange={e => setLocalContent({ ...localContent, url: e.target.value })}
            placeholder="Embed URL (Google Maps, Calendly, etc.)" className="bg-white/10 border-white/20 text-white text-sm h-9" />
          <Input value={localContent.title || ''} onChange={e => setLocalContent({ ...localContent, title: e.target.value })}
            placeholder="Title (optional)" className="bg-white/10 border-white/20 text-white text-xs h-8" />
        </div>
      )}

      {/* Code */}
      {block.block_type === 'code' && (
        <Textarea value={localContent.code || ''} onChange={e => setLocalContent({ ...localContent, code: e.target.value })}
          placeholder="Paste your code here" className="bg-white/10 border-white/20 text-white text-sm min-h-[80px] font-mono" />
      )}

      {/* List */}
      {block.block_type === 'list' && (
        <div className="space-y-1">
          {(localContent.items || []).map((item: string, i: number) => (
            <div key={i} className="flex gap-1">
              <span className="text-white/30 text-xs self-center w-4">{i + 1}.</span>
              <Input value={item} onChange={e => {
                const newItems = [...(localContent.items || [])];
                newItems[i] = e.target.value;
                setLocalContent({ ...localContent, items: newItems });
              }} className="bg-white/10 border-white/20 text-white text-xs h-7 flex-1" />
              <Button size="sm" variant="ghost" onClick={() => {
                const newItems = (localContent.items || []).filter((_: any, idx: number) => idx !== i);
                setLocalContent({ ...localContent, items: newItems });
              }} className="text-red-400 h-7 w-7 p-0"><Trash2 className="w-3 h-3" /></Button>
            </div>
          ))}
          <Button size="sm" variant="ghost" onClick={() => {
            setLocalContent({ ...localContent, items: [...(localContent.items || []), ''] });
          }} className="text-white/40 text-xs h-7"><Plus className="w-3 h-3 mr-1" />Add item</Button>
        </div>
      )}

      {/* Button */}
      {block.block_type === 'button' && (
        <div className="grid grid-cols-2 gap-1">
          <Input value={localContent.text || ''} onChange={e => setLocalContent({ ...localContent, text: e.target.value })}
            placeholder="Button text" className="bg-white/10 border-white/20 text-white text-xs h-8" />
          <Input value={localContent.url || ''} onChange={e => setLocalContent({ ...localContent, url: e.target.value })}
            placeholder="URL" className="bg-white/10 border-white/20 text-white text-xs h-8" />
        </div>
      )}

      {/* Spacer */}
      {block.block_type === 'spacer' && (
        <Input value={localContent.height || '2rem'} onChange={e => setLocalContent({ ...localContent, height: e.target.value })}
          placeholder="Height (e.g. 2rem)" className="bg-white/10 border-white/20 text-white text-xs h-8" />
      )}

      {/* Divider */}
      {block.block_type === 'divider' && (
        <p className="text-white/20 text-xs italic">Horizontal divider line</p>
      )}

      {/* FAQ — page filter */}
      {block.block_type === 'faq' && (
        <div className="space-y-1">
          <Input value={localContent.page || 'general'} onChange={e => setLocalContent({ ...localContent, page: e.target.value })}
            placeholder="Page filter (e.g. birthdays, general)" className="bg-white/10 border-white/20 text-white text-xs h-8" />
          <Button size="sm" variant="ghost" onClick={handleSave} disabled={saving === block.id}
            className="text-green-400 text-xs h-6 px-2"><Save className="w-3 h-3 mr-1" />Save</Button>
        </div>
      )}

      {/* Jobs — category filter */}
      {block.block_type === 'jobs' && (
        <div className="space-y-1">
          <Input value={localContent.category || ''} onChange={e => setLocalContent({ ...localContent, category: e.target.value })}
            placeholder="Category filter (e.g. in-store, hybrid, unpaid — leave empty for all)" className="bg-white/10 border-white/20 text-white text-xs h-8" />
          <Button size="sm" variant="ghost" onClick={handleSave} disabled={saving === block.id}
            className="text-green-400 text-xs h-6 px-2"><Save className="w-3 h-3 mr-1" />Save</Button>
        </div>
      )}

      {/* Cards — inline JSON editor */}
      {block.block_type === 'cards' && (
        <div className="space-y-2">
          {(localContent.items || []).map((card: any, i: number) => (
            <div key={i} className="grid grid-cols-3 gap-1 items-center">
              <Input value={card.icon || ''} onChange={e => {
                const items = [...(localContent.items || [])];
                items[i] = { ...items[i], icon: e.target.value };
                setLocalContent({ ...localContent, items });
              }} placeholder="Icon" className="bg-white/10 border-white/20 text-white text-xs h-7" />
              <Input value={card.title || ''} onChange={e => {
                const items = [...(localContent.items || [])];
                items[i] = { ...items[i], title: e.target.value };
                setLocalContent({ ...localContent, items });
              }} placeholder="Title" className="bg-white/10 border-white/20 text-white text-xs h-7" />
              <div className="flex gap-1">
                <Input value={card.description || ''} onChange={e => {
                  const items = [...(localContent.items || [])];
                  items[i] = { ...items[i], description: e.target.value };
                  setLocalContent({ ...localContent, items });
                }} placeholder="Description" className="bg-white/10 border-white/20 text-white text-xs h-7 flex-1" />
                <Button size="sm" variant="ghost" onClick={() => {
                  const items = (localContent.items || []).filter((_: any, idx: number) => idx !== i);
                  setLocalContent({ ...localContent, items });
                }} className="text-red-400 h-7 w-7 p-0"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="ghost" onClick={() => {
            setLocalContent({ ...localContent, items: [...(localContent.items || []), { icon: '⭐', title: '', description: '' }] });
          }} className="text-white/40 text-xs h-7"><Plus className="w-3 h-3 mr-1" />Add card</Button>
        </div>
      )}
    </div>
  );
}

// ─── Section Card (expandable) ──────────────────────────────
function SectionCard({ section, password, page, onReorder, onToggleVisibility, onUpdateLayout, onDelete }: {
  section: any;
  password: string;
  page: string;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  onUpdateLayout: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [cleaningUp, setCleaningUp] = useState<string | null>(null);
  const refreshPreview = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['cms', 'section_content_blocks'] });
    setPreviewKey(k => k + 1);
  }, [queryClient]);

  const handleCleanUp = async (sec: any) => {
    setCleaningUp(sec.id);
    try {
      const { data, error } = await supabase.functions.invoke('ai-layout', {
        body: { password, section_id: sec.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.template) {
        onUpdateLayout(sec.id, 'layout_template', data.template);
        toast.success(`Switched to "${data.template}" — ${data.reason || 'AI suggestion'}`);
        setTimeout(refreshPreview, 300);
      }
    } catch (e: any) {
      toast.error(e.message || 'Clean up failed');
    }
    setCleaningUp(null);
  };
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${section.is_visible ? 'border-white/15 bg-white/5' : 'border-white/5 bg-white/[0.02] opacity-60'}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
        <span className="text-white/40 text-xs font-mono w-6">{section.sort_order}</span>
        <span className="font-heading font-bold text-white text-sm flex-1">{section.label || section.section_key}</span>
        <Badge variant="outline" className="text-xs text-white/40 border-white/10">{section.section_key}</Badge>

        <div className="flex items-center gap-1 ml-2" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => onReorder(section.id, 'up')} className="text-white/40 h-6 w-6 p-0"><ChevronUp className="w-3 h-3" /></Button>
          <Button size="sm" variant="ghost" onClick={() => onReorder(section.id, 'down')} className="text-white/40 h-6 w-6 p-0"><ChevronDown className="w-3 h-3" /></Button>
          <Button size="sm" variant="ghost" onClick={() => onToggleVisibility(section.id, !section.is_visible)} className="h-6 w-6 p-0">
            {section.is_visible ? <Eye className="w-3 h-3 text-green-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(section.id)} className="text-red-400/60 h-6 w-6 p-0"><Trash2 className="w-3 h-3" /></Button>
        </div>

        {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-3">
          {/* Two-column: Controls left, Template preview right */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6">
            {/* LEFT: Controls */}
            <div className="space-y-4">
              {/* Label */}
              <InlineField label="Label" value={section.label || ''} onChange={v => onUpdateLayout(section.id, 'label', v)} />

              {/* Section Type Toggle */}
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-heading">Section Type</label>
                <div className="flex gap-2">
                  {(['hero', 'section', 'small'] as const).map(type => (
                    <Button key={type} size="sm" variant="ghost"
                      onClick={() => onUpdateLayout(section.id, 'section_type', type)}
                      className={`text-xs h-8 px-4 border ${section.section_type === type || (!section.section_type && type === 'section')
                        ? 'bg-klawsome-yellow text-klawsome-navy border-klawsome-yellow font-bold'
                        : 'text-white/60 border-white/20 hover:border-klawsome-yellow/40'}`}>
                      {type === 'hero' ? '🖼 Hero Banner' : type === 'section' ? '📄 Section' : '📌 Small Section'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Hero Height Toggle */}
              {(section.section_type === 'hero') && (
                <div className="space-y-2">
                  <label className="text-white/60 text-xs font-heading">Hero Height</label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost"
                      onClick={() => onUpdateLayout(section.id, 'hero_height', '50vh')}
                      className={`text-xs h-8 px-4 border ${section.hero_height === '50vh'
                        ? 'bg-klawsome-yellow text-klawsome-navy border-klawsome-yellow font-bold'
                        : 'text-white/60 border-white/20'}`}>
                      Half Screen
                    </Button>
                    <Button size="sm" variant="ghost"
                      onClick={() => onUpdateLayout(section.id, 'hero_height', '100vh')}
                      className={`text-xs h-8 px-4 border ${section.hero_height !== '50vh'
                        ? 'bg-klawsome-yellow text-klawsome-navy border-klawsome-yellow font-bold'
                        : 'text-white/60 border-white/20'}`}>
                      Full Screen
                    </Button>
                  </div>
                </div>
              )}

              {/* Layout Template Dropdown */}
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-heading">Layout Template</label>
                <select
                  value={section.layout_template || 'stacked'}
                  onChange={e => onUpdateLayout(section.id, 'layout_template', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm font-heading focus:outline-none focus:border-klawsome-yellow"
                >
                  {Object.entries(LAYOUT_TEMPLATES).map(([key, tmpl]) => (
                    <option key={key} value={key} className="bg-[#1e293b] text-white">
                      {tmpl.label} — {tmpl.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Background controls */}
              <ColorPickerField label="Background Color" value={section.bg_color || ''} onChange={v => onUpdateLayout(section.id, 'bg_color', v)} />
              <ImageUploadField value={section.bg_image_url || ''} onChange={v => onUpdateLayout(section.id, 'bg_image_url', v)} label="Background Image" />
            </div>

            {/* RIGHT: Live Section Preview */}
            <div className="flex flex-col items-start">
              <div className="flex items-center justify-between w-full mb-2">
                <label className="text-white/60 text-xs font-heading">Live Preview</label>
                <Button size="sm" variant="ghost" onClick={refreshPreview} className="text-white/40 h-6 px-2 text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />Refresh
                </Button>
              </div>
              <div
                className="w-full rounded-xl border border-white/10 overflow-hidden relative"
                style={{
                  backgroundColor: section.bg_color || '#ffffff',
                  backgroundImage: section.bg_image_url ? `url(${section.bg_image_url})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {section.bg_image_url && (
                  <div className="absolute inset-0 bg-black/40 z-0" />
                )}
                <div className="relative z-10 origin-top-left" style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', maxHeight: '400px', overflow: 'hidden' }}>
                  <DynamicSection
                    key={`preview-${section.id}-${previewKey}-${section.layout_template}`}
                    sectionId={section.id}
                    sectionType={section.section_type || 'section'}
                    layoutTemplate={section.layout_template || 'stacked'}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between w-full mt-2">
                <span className="text-white/40 text-[11px] font-heading">
                  {LAYOUT_TEMPLATES[(section.layout_template || 'stacked') as keyof typeof LAYOUT_TEMPLATES]?.description || ''}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCleanUp(section)}
                  disabled={cleaningUp === section.id}
                  className="text-klawsome-yellow text-xs h-7 px-3 border border-klawsome-yellow/30 hover:bg-klawsome-yellow/10"
                >
                  {cleaningUp === section.id ? '✨ Redesigning…' : '✨ Clean Up'}
                </Button>
              </div>
            </div>
          </div>

          {/* Content editor */}
          <div className="border-t border-white/10 pt-3">
            <p className="text-white/50 text-xs font-heading mb-2">Content Blocks</p>
            <ContentBlockEditor password={password} sectionId={section.id} onBlocksChanged={refreshPreview} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page Builder ───────────────────────────────────────────
function PageBuilder({ page, password }: { page: string; password: string }) {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingLayout, setSavingLayout] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cmsInvoke(password, { action: 'read', table: 'page_sections' });
      const filtered = (res.rows || [])
        .filter((s: any) => s.page === page)
        .sort((a: any, b: any) => a.sort_order - b.sort_order);
      setSections(filtered);
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }, [page, password]);

  useEffect(() => { load(); }, [load]);

  const reorder = async (id: string, direction: 'up' | 'down') => {
    const idx = sections.findIndex(s => s.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sections.length) return;

    try {
      const a = sections[idx];
      const b = sections[swapIdx];
      await cmsInvoke(password, { action: 'update', table: 'page_sections', id: a.id, data: { sort_order: b.sort_order } });
      await cmsInvoke(password, { action: 'update', table: 'page_sections', id: b.id, data: { sort_order: a.sort_order } });
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const toggleVisibility = async (id: string, visible: boolean) => {
    try {
      await cmsInvoke(password, { action: 'update', table: 'page_sections', id, data: { is_visible: visible } });
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const updateLayout = async (id: string, field: string, value: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== id) return s;
      if (field === 'columns') return { ...s, [field]: parseInt(value) || 1 };
      if (field === 'photos') return { ...s, [field]: JSON.parse(value as string) };
      return { ...s, [field]: value };
    }));

    setSavingLayout(true);
    try {
      let dbValue: any = value;
      if (field === 'columns') dbValue = parseInt(value) || 1;
      if (field === 'photos') dbValue = JSON.parse(value as string);
      await cmsInvoke(password, { action: 'update', table: 'page_sections', id, data: { [field]: dbValue } });
    } catch (e: any) { toast.error(e.message); }
    setSavingLayout(false);
  };

  const deleteSection = async (id: string) => {
    if (!confirm('Delete this section? This cannot be undone.')) return;
    try {
      await cmsInvoke(password, { action: 'delete', table: 'page_sections', id });
      toast.success('Section deleted');
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const addSection = async () => {
    try {
      const sectionKey = `custom:new-${Date.now()}`;
      await cmsInvoke(password, {
        action: 'insert', table: 'page_sections',
        data: {
          page,
          section_key: sectionKey,
          label: 'New Section',
          sort_order: sections.length + 1,
          is_visible: true,
          section_type: 'section',
          hero_height: '100vh',
          bg_color: '',
          bg_image_url: '',
        }
      });
      toast.success('Section added');
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  if (loading) return <p className="text-white/40 py-8 text-center">Loading page sections…</p>;

  return (
    <div className="space-y-3">
      {savingLayout && <div className="text-xs text-klawsome-yellow animate-pulse text-right">Saving layout…</div>}
      {sections.map((s) => (
        <SectionCard
          key={s.id}
          section={s}
          password={password}
          page={page}
          onReorder={reorder}
          onToggleVisibility={toggleVisibility}
          onUpdateLayout={updateLayout}
          onDelete={deleteSection}
        />
      ))}
      <div className="flex gap-2 pt-2">
        <Button onClick={addSection} className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold text-xs">
          <Plus className="w-3 h-3 mr-1" />Add Section
        </Button>
      </div>
    </div>
  );
}

// ─── Settings Tab ───────────────────────────────────────────
function SettingsEditor({ password }: { password: string }) {
  const [row, setRow] = useState<Record<string, string>>({});
  const [originalId, setOriginalId] = useState('');
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const fields = ['business_name', 'phone', 'email', 'address', 'google_maps_url', 'instagram_url', 'tiktok_url', 'facebook_url', 'youtube_url', 'gift_card_url', 'newsletter_text'];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cmsInvoke(password, { action: 'read', table: 'site_settings' });
      const r = res.rows?.[0] || {};
      const mapped: Record<string, string> = {};
      fields.forEach((f) => (mapped[f] = r[f] ?? ''));
      setRow(mapped);
      setOriginalId(r.id || '');
      setDirty(false);
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const update = (key: string, value: string) => {
    setRow(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await cmsInvoke(password, { action: 'upsert', table: 'site_settings', data: { ...row, id: originalId } });
      toast.success('Saved!');
      setDirty(false);
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  if (loading) return <p className="text-white/40 py-8 text-center">Loading…</p>;

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-white font-heading text-lg">Vital Info</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InlineField label="Business Name" value={row.business_name} onChange={v => update('business_name', v)} />
            <InlineField label="Phone" value={row.phone} onChange={v => update('phone', v)} />
            <InlineField label="Email" value={row.email} onChange={v => update('email', v)} />
            <InlineField label="Address" value={row.address} onChange={v => update('address', v)} />
            <InlineField label="Google Maps URL" value={row.google_maps_url} onChange={v => update('google_maps_url', v)} />
            <InlineField label="Gift Card URL" value={row.gift_card_url} onChange={v => update('gift_card_url', v)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InlineField label="Instagram" value={row.instagram_url} onChange={v => update('instagram_url', v)} />
            <InlineField label="TikTok" value={row.tiktok_url} onChange={v => update('tiktok_url', v)} />
            <InlineField label="Facebook" value={row.facebook_url} onChange={v => update('facebook_url', v)} />
            <InlineField label="YouTube" value={row.youtube_url} onChange={v => update('youtube_url', v)} />
          </div>
          <InlineField label="Newsletter Text" value={row.newsletter_text} onChange={v => update('newsletter_text', v)} multiline />
          {dirty && (
            <Button onClick={save} disabled={saving} className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold text-xs">
              <Save className="w-3 h-3 mr-1" />{saving ? 'Saving…' : 'Save Changes'}
            </Button>
          )}
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-white font-heading text-lg">Store Hours</CardTitle></CardHeader>
        <CardContent><StoreHoursEditor password={password} /></CardContent>
      </Card>

      {/* Data Table Editors */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-white font-heading text-lg">Token Tiers</CardTitle></CardHeader>
        <CardContent>
          <MiniTableEditor password={password} table="token_tiers" columns={[
            { key: 'tokens', label: 'Tokens' },
            { key: 'price', label: 'Price' },
            { key: 'bonus', label: 'Bonus' },
            { key: 'is_highlight', label: '⭐', type: 'bool' },
            { key: 'sort_order', label: '#', width: '40px' },
          ]} />
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-white font-heading text-lg">News Articles</CardTitle></CardHeader>
        <CardContent>
          <MiniTableEditor password={password} table="news_articles" columns={[
            { key: 'title', label: 'Title' },
            { key: 'source', label: 'Source' },
            { key: 'date', label: 'Date' },
            { key: 'url', label: 'URL' },
            { key: 'image_url', label: 'Image' },
            { key: 'is_active', label: 'Active', type: 'bool' },
            { key: 'sort_order', label: '#', width: '40px' },
          ]} />
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-white font-heading text-lg">Job Listings</CardTitle></CardHeader>
        <CardContent>
          <MiniTableEditor password={password} table="job_listings" columns={[
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'is_paid', label: 'Paid', type: 'bool' },
            { key: 'is_active', label: 'Active', type: 'bool' },
            { key: 'apply_url', label: 'Apply URL' },
            { key: 'sort_order', label: '#', width: '40px' },
          ]} />
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-white font-heading text-lg">Party Options</CardTitle></CardHeader>
        <CardContent>
          <MiniTableEditor password={password} table="party_options" columns={[
            { key: 'name', label: 'Name' },
            { key: 'price', label: 'Price' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'features', label: 'Features', type: 'array' },
            { key: 'sort_order', label: '#', width: '40px' },
          ]} />
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-white font-heading text-lg">FAQ Items</CardTitle></CardHeader>
        <CardContent>
          <MiniTableEditor password={password} table="faq_items" columns={[
            { key: 'question', label: 'Question' },
            { key: 'answer', label: 'Answer', type: 'textarea' },
            { key: 'page', label: 'Page' },
            { key: 'sort_order', label: '#', width: '40px' },
          ]} />
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-white font-heading text-lg">Invite Templates</CardTitle></CardHeader>
        <CardContent>
          <MiniTableEditor password={password} table="invite_templates" columns={[
            { key: 'name', label: 'Name' },
            { key: 'url', label: 'Download URL' },
            { key: 'thumbnail_url', label: 'Thumbnail' },
            { key: 'sort_order', label: '#', width: '40px' },
          ]} />
        </CardContent>
      </Card>
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

  const pages = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'birthdays', label: 'Birthdays', icon: Cake },
    { key: 'careers', label: 'Careers', icon: Briefcase },
    { key: 'business', label: 'Business', icon: Building2 },
    { key: 'news', label: 'News', icon: Newspaper },
  ];

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

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto gap-1 p-1">
            {pages.map(p => (
              <TabsTrigger key={p.key} value={p.key} className="data-[state=active]:bg-klawsome-yellow data-[state=active]:text-klawsome-navy text-white/60 font-heading text-xs">
                <p.icon className="w-3 h-3 mr-1" />{p.label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="settings" className="data-[state=active]:bg-klawsome-yellow data-[state=active]:text-klawsome-navy text-white/60 font-heading text-xs">
              <Settings className="w-3 h-3 mr-1" />Settings
            </TabsTrigger>
          </TabsList>

          {pages.map(p => (
            <TabsContent key={p.key} value={p.key}>
              <PageBuilder page={p.key} password={storedPassword} />
            </TabsContent>
          ))}

          <TabsContent value="settings">
            <SettingsEditor password={storedPassword} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KlawsomeAdmin;
