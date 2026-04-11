import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImageUploadField = ({ value, onChange, label }: ImageUploadFieldProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from('site-images').upload(path, file);
      if (error) throw error;

      const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
      onChange(urlData.publicUrl);
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    }
    setUploading(false);
  };

  return (
    <div className="space-y-1">
      {label && <label className="text-white/70 text-sm font-heading">{label}</label>}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste URL or upload"
          className="bg-white/10 border-white/20 text-white text-sm flex-1"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 h-10 px-3"
        >
          <Upload className="w-4 h-4" />
        </Button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>
    </div>
  );
};

export default ImageUploadField;
