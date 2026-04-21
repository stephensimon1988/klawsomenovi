import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageItem {
  id: string;
  name: string;
  url: string;
  category: string;
  tags: string;
  sort_order: number;
}

const CATEGORIES = ['all', 'gif', 'photo', 'logo', 'graphic'] as const;

const cmsInvoke = async (password: string, body: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke('cms-admin', {
    body: { password, ...body },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

export default function ImageLibraryEditor({ password }: { password: string }) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', url: '', category: 'graphic' });

  const load = useCallback(async () => {
    try {
      const res = await cmsInvoke(password, { action: 'read', table: 'image_library' });
      setItems(res.data || []);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Load failed');
    }
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const copy = async (item: ImageItem) => {
    await navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 1500);
  };

  const add = async () => {
    if (!newItem.url) { toast.error('URL required'); return; }
    try {
      await cmsInvoke(password, {
        action: 'insert',
        table: 'image_library',
        data: { ...newItem, sort_order: items.length },
      });
      setNewItem({ name: '', url: '', category: 'graphic' });
      toast.success('Image added');
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Insert failed');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this image from the library?')) return;
    try {
      await cmsInvoke(password, { action: 'delete', table: 'image_library', id });
      toast.success('Removed');
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const filtered = items.filter(i =>
    (filter === 'all' || i.category === filter) &&
    (search === '' || i.name.toLowerCase().includes(search.toLowerCase()) || i.url.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
        <h3 className="text-white font-heading text-sm">Add Image to Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <Input
            placeholder="Name (optional)"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="md:col-span-3 bg-white/10 border-white/20 text-white"
          />
          <Input
            placeholder="Image URL"
            value={newItem.url}
            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
            className="md:col-span-6 bg-white/10 border-white/20 text-white"
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="md:col-span-2 bg-white/10 border border-white/20 text-white rounded-md px-2 text-sm"
          >
            {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c} className="bg-klawsome-navy">{c}</option>)}
          </select>
          <Button onClick={add} className="md:col-span-1 bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90"><Plus className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {CATEGORIES.map(c => (
          <Button
            key={c}
            size="sm"
            variant={filter === c ? 'default' : 'outline'}
            onClick={() => setFilter(c)}
            className={filter === c ? 'bg-klawsome-yellow text-klawsome-navy' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}
          >
            {c} {c !== 'all' && <span className="ml-1 opacity-60">({items.filter(i => i.category === c).length})</span>}
          </Button>
        ))}
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs ml-auto bg-white/10 border-white/20 text-white"
        />
      </div>

      <p className="text-white/60 text-xs">Click any image to copy its URL. Paste it into any image field in the admin (hero images, step icons, gallery, etc.).</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map(item => (
          <div key={item.id} className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => copy(item)}
              className="block w-full aspect-square bg-white/5 hover:ring-2 hover:ring-klawsome-yellow transition"
              title="Click to copy URL"
            >
              <img src={item.url} alt={item.name} className="w-full h-full object-contain" loading="lazy" />
            </button>
            <div className="p-2 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <Badge variant="outline" className="text-[10px] border-white/20 text-white/70 capitalize">{item.category}</Badge>
                <button onClick={() => remove(item.id)} className="text-white/40 hover:text-red-400" title="Remove"><Trash2 className="w-3 h-3" /></button>
              </div>
              <p className="text-white/80 text-xs truncate font-heading" title={item.name}>{item.name || '—'}</p>
              <button
                onClick={() => copy(item)}
                className="w-full flex items-center justify-center gap-1 text-[10px] text-klawsome-yellow hover:text-white py-1 border border-white/10 rounded"
              >
                {copiedId === item.id ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy URL</>}
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-white/50 text-center py-8">No images match.</p>}
    </div>
  );
}