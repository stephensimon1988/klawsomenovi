import { useState, lazy, Suspense, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import MultiImageUpload from '@/components/MultiImageUpload';
import MediaLibraryPicker from '@/components/MediaLibraryPicker';
import DynamicSection from '@/components/DynamicSection';
import SectionWrapper from '@/components/SectionWrapper';
import { Plus, Trash2, Link as LinkIcon, Sparkles, Shuffle, Image, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const RichTextEditor = lazy(() => import('@/components/RichTextEditor'));

interface LinkItem { label: string; url: string; }

interface AIBuilderTabProps {
  page: string;
  password: string;
  onSectionCreated?: () => void;
}

const AIBuilderTab = ({ page, password, onSectionCreated }: AIBuilderTabProps) => {
  const [label, setLabel] = useState('');
  const [columns, setColumns] = useState('1');
  const [textBlocks, setTextBlocks] = useState<string[]>(['']);
  const [images, setImages] = useState<string[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [openAccordion, setOpenAccordion] = useState('text-0');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [building, setBuilding] = useState(false);
  const [remixing, setRemixing] = useState(false);
  const [createdSectionId, setCreatedSectionId] = useState<string | null>(null);
  const [createdTemplate, setCreatedTemplate] = useState<string>('stacked');
  const [previewKey, setPreviewKey] = useState(0);

  const addTextBlock = () => {
    setTextBlocks(prev => [...prev, '']);
    setOpenAccordion(`text-${textBlocks.length}`);
  };

  const updateTextBlock = (idx: number, val: string) => {
    setTextBlocks(prev => prev.map((t, i) => i === idx ? val : t));
  };

  const removeTextBlock = (idx: number) => {
    setTextBlocks(prev => prev.filter((_, i) => i !== idx));
    setOpenAccordion('');
  };

  const addLink = () => setLinks(prev => [...prev, { label: '', url: '' }]);
  const updateLink = (idx: number, field: 'label' | 'url', val: string) => {
    setLinks(prev => prev.map((l, i) => i === idx ? { ...l, [field]: val } : l));
  };
  const removeLink = (idx: number) => setLinks(prev => prev.filter((_, i) => i !== idx));

  const handleMediaSelect = (url: string) => {
    setImages(prev => [...prev, url]);
    setMediaPickerOpen(false);
  };

  const hasContent = textBlocks.some(t => t.trim()) || images.length > 0 || links.length > 0;

  const handleBuild = async () => {
    if (!label.trim()) { toast.error('Please enter a section label'); return; }
    if (!hasContent) { toast.error('Add at least one text block, image, or link'); return; }

    setBuilding(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-layout', {
        body: {
          password,
          mode: 'build',
          page,
          label: label.trim(),
          columns: parseInt(columns),
          textBlocks: textBlocks.filter(t => t.trim()),
          images,
          links: links.filter(l => l.url.trim()),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setCreatedSectionId(data.section_id);
      toast.success(`Section created with "${data.template}" layout ✨`);
      onSectionCreated?.();
    } catch (e: any) {
      toast.error(e.message || 'Failed to create section');
    }
    setBuilding(false);
  };

  const handleRemix = async () => {
    if (!createdSectionId) return;
    setRemixing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-layout', {
        body: {
          password,
          mode: 'remix',
          section_id: createdSectionId,
          columns: parseInt(columns),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Remixed to "${data.template}" layout 🔀`);
      onSectionCreated?.();
    } catch (e: any) {
      toast.error(e.message || 'Remix failed');
    }
    setRemixing(false);
  };

  const resetForm = () => {
    setLabel('');
    setColumns('1');
    setTextBlocks(['']);
    setImages([]);
    setLinks([]);
    setCreatedSectionId(null);
    setOpenAccordion('text-0');
  };

  return (
    <div className="space-y-6">
      {/* Section Label */}
      <div className="space-y-2">
        <label className="text-white/60 text-xs font-heading">Section Label</label>
        <Input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g. About Us, Features, Gallery…"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
        />
      </div>

      {/* Column Picker */}
      <div className="space-y-2">
        <label className="text-white/60 text-xs font-heading">Columns</label>
        <ToggleGroup type="single" value={columns} onValueChange={v => v && setColumns(v)} className="justify-start">
          {['1', '2', '3', '4'].map(n => (
            <ToggleGroupItem
              key={n}
              value={n}
              className="text-xs h-8 px-4 border border-white/20 data-[state=on]:bg-klawsome-yellow data-[state=on]:text-klawsome-navy data-[state=on]:border-klawsome-yellow font-heading font-bold"
            >
              {n} {parseInt(n) === 1 ? 'Column' : 'Columns'}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Text Blocks (Accordion WYSIWYG) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white/60 text-xs font-heading">Text Blocks</label>
          <Button size="sm" variant="ghost" onClick={addTextBlock} className="text-klawsome-yellow text-xs h-7 px-2">
            <Plus className="w-3 h-3 mr-1" />Add Text Block
          </Button>
        </div>
        <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion}>
          {textBlocks.map((text, idx) => (
            <AccordionItem key={idx} value={`text-${idx}`} className="border-white/10">
              <div className="flex items-center gap-2">
                <AccordionTrigger className="text-white/80 text-sm font-heading flex-1 py-2">
                  Text Block {idx + 1}
                  {text.trim() && <span className="text-white/30 text-xs ml-2">(has content)</span>}
                </AccordionTrigger>
                {textBlocks.length > 1 && (
                  <Button size="sm" variant="ghost" onClick={() => removeTextBlock(idx)} className="text-red-400/60 h-6 w-6 p-0">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
              <AccordionContent>
                <Suspense fallback={<div className="h-32 bg-white/5 rounded animate-pulse" />}>
                  <div className="bg-white rounded-lg">
                    <RichTextEditor value={text} onChange={val => updateTextBlock(idx, val)} placeholder="Write your content here…" />
                  </div>
                </Suspense>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white/60 text-xs font-heading">Images</label>
          <Button size="sm" variant="ghost" onClick={() => setMediaPickerOpen(true)} className="text-klawsome-yellow text-xs h-7 px-2">
            <Image className="w-3 h-3 mr-1" />Browse Library
          </Button>
        </div>
        <MultiImageUpload value={images} onChange={setImages} />
        <MediaLibraryPicker open={mediaPickerOpen} onClose={() => setMediaPickerOpen(false)} onSelect={handleMediaSelect} />
      </div>

      {/* Links */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white/60 text-xs font-heading">Links / Buttons</label>
          <Button size="sm" variant="ghost" onClick={addLink} className="text-klawsome-yellow text-xs h-7 px-2">
            <LinkIcon className="w-3 h-3 mr-1" />Add Link
          </Button>
        </div>
        {links.map((link, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input
              value={link.label}
              onChange={e => updateLink(idx, 'label', e.target.value)}
              placeholder="Label (e.g. Learn More)"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 text-sm flex-1"
            />
            <Input
              value={link.url}
              onChange={e => updateLink(idx, 'url', e.target.value)}
              placeholder="URL (e.g. /about)"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 text-sm flex-1"
            />
            <Button size="sm" variant="ghost" onClick={() => removeLink(idx)} className="text-red-400/60 h-8 w-8 p-0">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
        {links.length === 0 && (
          <p className="text-white/20 text-xs italic">No links added yet</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <Button
          onClick={handleBuild}
          disabled={building || !hasContent || !label.trim()}
          className="bg-klawsome-yellow text-klawsome-navy hover:bg-klawsome-yellow/90 font-heading font-bold text-sm"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {building ? 'Creating…' : createdSectionId ? 'Recreate Section' : 'Create Section'}
        </Button>

        {createdSectionId && (
          <Button
            onClick={handleRemix}
            disabled={remixing}
            variant="outline"
            className="border-klawsome-yellow/40 text-klawsome-yellow hover:bg-klawsome-yellow/10 font-heading font-bold text-sm"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            {remixing ? 'Remixing…' : 'Remix Layout'}
          </Button>
        )}

        {createdSectionId && (
          <Button onClick={resetForm} variant="ghost" className="text-white/40 text-sm font-heading">
            Start Fresh
          </Button>
        )}
      </div>

      {createdSectionId && (
        <p className="text-green-400/80 text-xs font-heading">
          ✅ Section created! Switch to the "Sections" tab to see it, or click Remix to try a different layout.
        </p>
      )}
    </div>
  );
};

export default AIBuilderTab;
