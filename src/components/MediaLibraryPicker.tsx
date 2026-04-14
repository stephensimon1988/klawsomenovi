import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Upload, Image, Search, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MediaLibraryPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

interface StorageFile {
  name: string;
  url: string;
  created_at?: string;
}

const MediaLibraryPicker = ({ open, onClose, onSelect }: MediaLibraryPickerProps) => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('site-images').list('', {
        limit: 200,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;

      const items: StorageFile[] = (data || [])
        .filter(f => !f.name.startsWith('.'))
        .map(f => {
          const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(f.name);
          return { name: f.name, url: urlData.publicUrl, created_at: f.created_at };
        });
      setFiles(items);
    } catch (err: any) {
      console.error('Failed to load media library', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchFiles();
      setSelected(null);
      setSearch('');
    }
  }, [open]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;

    setUploading(true);
    let uploaded = 0;
    for (const file of Array.from(fileList)) {
      try {
        const ext = file.name.split('.').pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('site-images').upload(path, file);
        if (error) throw error;
        uploaded++;
      } catch (err: any) {
        toast.error(`Failed: ${file.name}`);
      }
    }
    if (uploaded > 0) {
      toast.success(`${uploaded} image${uploaded > 1 ? 's' : ''} uploaded`);
      await fetchFiles();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInsert = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Image className="w-5 h-5" /> Media Library
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 flex flex-col min-h-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search media..."
                className="pl-9 text-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 border rounded-lg p-2">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Image className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm">No images found</p>
                  <p className="text-xs">Upload some images to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {filtered.map(f => (
                    <button
                      key={f.name}
                      onClick={() => setSelected(f.url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:opacity-90 ${
                        selected === f.url
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={f.url}
                        alt={f.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {selected === f.url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-primary-foreground bg-primary rounded-full p-1" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                <Button size="sm" onClick={handleInsert} disabled={!selected}>
                  Insert Image
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 flex flex-col items-center justify-center space-y-4 py-8">
            <div
              className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-12 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors w-full max-w-md"
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              ) : (
                <Upload className="w-10 h-10 text-muted-foreground" />
              )}
              <p className="text-sm font-medium text-foreground">
                {uploading ? 'Uploading...' : 'Click to upload or drag & drop'}
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP up to 10MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibraryPicker;
