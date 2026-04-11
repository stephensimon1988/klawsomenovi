import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

const MultiImageUpload = ({ value, onChange, label }: MultiImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('site-images').upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
        newUrls.push(urlData.publicUrl);
      }
      onChange([...value, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploaded!`);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-white/60 text-xs font-heading">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {value.map((url, i) => (
          <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-0 right-0 bg-red-500 rounded-bl-lg p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-16 h-16 rounded-lg border-2 border-dashed border-white/20 hover:border-klawsome-yellow/50 flex items-center justify-center text-white/30 hover:text-klawsome-yellow transition-colors"
        >
          {uploading ? <Upload className="w-4 h-4 animate-pulse" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
      <p className="text-white/30 text-[10px]">
        {value.length} photo{value.length !== 1 ? 's' : ''} • Layout: {
          value.length === 0 ? 'none' :
          value.length === 1 ? 'full-width' :
          value.length === 2 ? '2-column' :
          value.length === 3 ? 'feature + 2' :
          value.length === 4 ? '2×2 grid' :
          'masonry grid'
        }
      </p>
    </div>
  );
};

export default MultiImageUpload;
