import { useState, lazy, Suspense } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Palette, Settings, Eye, EyeOff, ArrowUp, ArrowDown, Trash2, Plus, Sparkles, Shuffle, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { LAYOUT_TEMPLATES } from '@/components/DynamicSection';
import { ANIMATION_PRESETS } from '@/components/SectionWrapper';
import type { PageSectionConfig } from '@/components/SectionWrapper';
import ColorPickerField from '@/components/ColorPickerField';
import ImageUploadField from '@/components/ImageUploadField';
import MultiImageUpload from '@/components/MultiImageUpload';
import MediaLibraryPicker from '@/components/MediaLibraryPicker';

const RichTextEditor = lazy(() => import('@/components/RichTextEditor'));

interface SectionToolbarProps {
  config: PageSectionConfig;
  onAddSection?: (position: 'before' | 'after') => void;
}

const BLOCK_TYPES = [
  { value: 'heading', label: '📝 Heading' },
  { value: 'text', label: '📄 Text' },
  { value: 'richtext', label: '📰 Rich Text' },
  { value: 'image', label: '🖼 Image' },
  { value: 'video', label: '🎬 Video' },
  { value: 'button', label: '🔘 Button' },
  { value: 'data_cards', label: '📊 Data Cards' },
  { value: 'divider', label: '— Divider' },
  { value: 'spacer', label: '↕ Spacer' },
];

const SectionToolbar = ({ config }: SectionToolbarProps) => {
  const { cmsInvoke, triggerRefresh, password } = useEditMode();
  const [expanded, setExpanded] = useState(false);
  const [bgColor, setBgColor] = useState(config.bg_color || '');
  const [bgImageUrl, setBgImageUrl] = useState(config.bg_image_url || '');
  const [layoutTemplate, setLayoutTemplate] = useState(config.layout_template || 'stacked');
  const [animation, setAnimation] = useState(config.animation || '');
  const [sectionType, setSectionType] = useState(config.section_type || 'section');
  const [heroHeight, setHeroHeight] = useState(config.hero_height || '100vh');
  const [label, setLabel] = useState(config.label || '');
  const [paddingY, setPaddingY] = useState(config.padding_y || '');
  const [wrapperMaxWidth, setWrapperMaxWidth] = useState(config.wrapper_max_width || '');
  const [textColor, setTextColor] = useState(config.text_color || '');
  const [customCssClass, setCustomCssClass] = useState(config.custom_css_class || '');
  const [saving, setSaving] = useState(false);

  // AI Builder state
  const [aiTextBlocks, setAiTextBlocks] = useState<string[]>(['']);
  const [aiImages, setAiImages] = useState<string[]>([]);
  const [aiLinks, setAiLinks] = useState<{ label: string; url: string }[]>([]);
  const [aiColumns, setAiColumns] = useState('1');
  const [aiAccordion, setAiAccordion] = useState('ai-text-0');
  const [aiMediaOpen, setAiMediaOpen] = useState(false);
  const [aiBuilding, setAiBuilding] = useState(false);
  const [aiRemixing, setAiRemixing] = useState(false);

  const saveSectionSettings = async (updates: Record<string, any>) => {
    setSaving(true);
    try {
      await cmsInvoke({
        action: 'update',
        table: 'page_sections',
        id: config.id,
        data: updates,
      });
      toast.success('Section updated');
      triggerRefresh();
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    }
    setSaving(false);
  };

  const toggleVisibility = () => {
    saveSectionSettings({ is_visible: !config.is_visible });
  };

  const deleteSection = async () => {
    if (!confirm(`Delete section "${config.label || config.section_key}"?`)) return;
    try {
      // Delete content blocks first
      const { rows } = await cmsInvoke({ action: 'read', table: 'section_content_blocks' });
      const sectionBlocks = (rows || []).filter((b: any) => b.section_id === config.id);
      for (const block of sectionBlocks) {
        await cmsInvoke({ action: 'delete', table: 'section_content_blocks', id: block.id });
      }
      await cmsInvoke({ action: 'delete', table: 'page_sections', id: config.id });
      toast.success('Section deleted');
      triggerRefresh();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  const addBlock = async (blockType: string) => {
    try {
      const defaultContent: Record<string, any> = {};
      if (blockType === 'heading') defaultContent.text = 'New Heading';
      else if (blockType === 'text') defaultContent.text = 'New text content';
      else if (blockType === 'image') defaultContent.url = '';
      else if (blockType === 'button') { defaultContent.text = 'Click Me'; defaultContent.url = '#'; }
      else if (blockType === 'data_cards') { defaultContent.source = 'inline'; defaultContent.display = 'card-grid'; defaultContent.items = []; }
      else if (blockType === 'spacer') defaultContent.height = '2rem';
      else if (blockType === 'richtext') defaultContent.html = '<p>Content here</p>';

      await cmsInvoke({
        action: 'insert',
        table: 'section_content_blocks',
        data: {
          section_id: config.id,
          block_type: blockType,
          content: defaultContent,
          row_order: 99,
          column_index: 0,
        },
      });
      toast.success(`Added ${blockType} block`);
      triggerRefresh();
    } catch (e: any) {
      toast.error(e.message || 'Failed to add block');
    }
  };

  const moveSection = async (direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? config.sort_order - 1 : config.sort_order + 1;
    if (newOrder < 0) return;
    try {
      await cmsInvoke({
        action: 'update',
        table: 'page_sections',
        id: config.id,
        data: { sort_order: newOrder },
      });
      toast.success('Section moved');
      triggerRefresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const aiAddContent = async () => {
    const hasContent = aiTextBlocks.some(t => t.trim()) || aiImages.length > 0 || aiLinks.length > 0;
    if (!hasContent) { toast.error('Add at least one text block, image, or link'); return; }

    setAiBuilding(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-layout', {
        body: {
          password,
          mode: 'build',
          page: config.page,
          label: config.label || 'AI Section',
          columns: parseInt(aiColumns),
          textBlocks: aiTextBlocks.filter(t => t.trim()),
          images: aiImages,
          links: aiLinks.filter(l => l.url.trim()),
          existingSectionId: config.id,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setLayoutTemplate(data.template);
      setAiTextBlocks(['']);
      setAiImages([]);
      setAiLinks([]);
      toast.success(`AI organized content with "${data.template}" layout ✨`);
      triggerRefresh();
    } catch (e: any) {
      toast.error(e.message || 'AI build failed');
    }
    setAiBuilding(false);
  };

  const aiRemix = async () => {
    setAiRemixing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-layout', {
        body: {
          password,
          mode: 'remix',
          section_id: config.id,
          columns: parseInt(aiColumns),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setLayoutTemplate(data.template);
      toast.success(`Remixed to "${data.template}" 🔀`);
      triggerRefresh();
    } catch (e: any) {
      toast.error(e.message || 'Remix failed');
    }
    setAiRemixing(false);
  };

  return (
    <div className="relative z-20 w-full" style={{ color: 'hsl(var(--foreground))' }}>
      {/* Compact toolbar */}
      <div className="flex items-center gap-2 bg-background backdrop-blur border-b border-border px-3 py-1.5 rounded-b-lg shadow-lg text-foreground">
        <span className="font-heading font-bold text-xs text-foreground truncate flex-1">
          {config.label || config.section_key}
        </span>

        <Button size="sm" variant="ghost" onClick={() => moveSection('up')} className="h-6 w-6 p-0 text-foreground">
          <ArrowUp className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => moveSection('down')} className="h-6 w-6 p-0 text-foreground">
          <ArrowDown className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={toggleVisibility} className="h-6 w-6 p-0 text-foreground">
          {config.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)} className="h-6 px-2 text-xs font-heading text-foreground">
          <Settings className="w-3 h-3 mr-1" />
          {expanded ? 'Close' : 'Settings'}
        </Button>
        <Button size="sm" variant="ghost" onClick={deleteSection} className="h-6 w-6 p-0 text-destructive">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Expanded settings */}
      {expanded && (
        <div className="bg-background backdrop-blur border border-b-0 border-border rounded-b-lg p-4 shadow-lg space-y-4 text-foreground">
          {/* Label */}
          <div className="space-y-1">
            <label className="text-xs font-heading text-muted-foreground">Label</label>
            <Input
              value={label}
              onChange={e => setLabel(e.target.value)}
              onBlur={() => saveSectionSettings({ label })}
              className="h-8 text-xs bg-background border-border text-foreground"
              placeholder="Section label"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* BG Color */}
            <div className="space-y-1">
              <label className="text-xs font-heading text-muted-foreground">Background</label>
              <ColorPickerField
                value={bgColor}
                onChange={v => {
                  setBgColor(v);
                  saveSectionSettings({ bg_color: v });
                }}
              />
            </div>

            {/* Layout Template */}
            <div className="space-y-1">
              <label className="text-xs font-heading text-muted-foreground">Layout</label>
              <Select value={layoutTemplate} onValueChange={v => {
                setLayoutTemplate(v);
                saveSectionSettings({ layout_template: v });
              }}>
                <SelectTrigger className="h-8 text-xs text-foreground bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LAYOUT_TEMPLATES).map(([key, val]) => (
                    <SelectItem key={key} value={key} className="text-xs">{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section Type */}
            <div className="space-y-1">
              <label className="text-xs font-heading text-muted-foreground">Type</label>
              <Select value={sectionType} onValueChange={v => {
                setSectionType(v as any);
                saveSectionSettings({ section_type: v });
              }}>
                <SelectTrigger className="h-8 text-xs text-foreground bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero" className="text-xs">🖼 Hero</SelectItem>
                  <SelectItem value="section" className="text-xs">📄 Section</SelectItem>
                  <SelectItem value="small" className="text-xs">📌 Small</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Animation */}
            <div className="space-y-1">
              <label className="text-xs font-heading text-muted-foreground">Animation</label>
              <Select value={animation} onValueChange={v => {
                setAnimation(v);
                saveSectionSettings({ animation: v });
              }}>
                <SelectTrigger className="h-8 text-xs text-foreground bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ANIMATION_PRESETS).map(([key, val]) => (
                    <SelectItem key={key} value={key || 'none'} className="text-xs">{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hero Height (only when type is Hero) */}
          {sectionType === 'hero' && (
            <div className="space-y-1">
              <label className="text-xs font-heading text-muted-foreground">Hero Height</label>
              <div className="flex gap-2">
                <Button size="sm" variant={heroHeight === '50vh' ? 'default' : 'outline'}
                  className="text-xs h-8 px-4"
                  onClick={() => { setHeroHeight('50vh'); saveSectionSettings({ hero_height: '50vh' }); }}>
                  Half Screen
                </Button>
                <Button size="sm" variant={heroHeight !== '50vh' ? 'default' : 'outline'}
                  className="text-xs h-8 px-4"
                  onClick={() => { setHeroHeight('100vh'); saveSectionSettings({ hero_height: '100vh' }); }}>
                  Full Screen
                </Button>
              </div>
            </div>
          )}

          {/* Background Image */}
          <div className="space-y-1">
            <label className="text-xs font-heading text-muted-foreground">Background Image</label>
            <ImageUploadField
              value={bgImageUrl}
              onChange={v => {
                setBgImageUrl(v);
                saveSectionSettings({ bg_image_url: v });
              }}
              label=""
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Padding Y */}
            <div className="space-y-1">
              <label className="text-xs font-heading text-muted-foreground">Padding Y</label>
              <Input
                value={paddingY}
                onChange={e => setPaddingY(e.target.value)}
                onBlur={() => saveSectionSettings({ padding_y: paddingY })}
                className="h-8 text-xs bg-background border-border text-foreground"
                placeholder="e.g. 4rem"
              />
            </div>

            {/* Max Width */}
            <div className="space-y-1">
              <label className="text-xs font-heading text-muted-foreground">Max Width</label>
              <Input
                value={wrapperMaxWidth}
                onChange={e => setWrapperMaxWidth(e.target.value)}
                onBlur={() => saveSectionSettings({ wrapper_max_width: wrapperMaxWidth })}
                className="h-8 text-xs bg-background border-border text-foreground"
                placeholder="e.g. 1200px"
              />
            </div>

            {/* Text Color */}
            <div className="space-y-1">
              <label className="text-xs font-heading text-muted-foreground">Text Color</label>
              <Input
                value={textColor}
                onChange={e => setTextColor(e.target.value)}
                onBlur={() => saveSectionSettings({ text_color: textColor })}
                className="h-8 text-xs bg-background border-border text-foreground"
                placeholder="e.g. #ffffff"
              />
            </div>

            {/* CSS Class */}
            <div className="space-y-1">
              <label className="text-xs font-heading text-muted-foreground">CSS Class</label>
              <Input
                value={customCssClass}
                onChange={e => setCustomCssClass(e.target.value)}
                onBlur={() => saveSectionSettings({ custom_css_class: customCssClass })}
                className="h-8 text-xs bg-background border-border text-foreground"
                placeholder="custom-class"
              />
            </div>
          </div>

          {/* Add Block */}
          <div className="space-y-1">
            <label className="text-xs font-heading text-muted-foreground">Add Block</label>
            <div className="flex flex-wrap gap-1">
              {BLOCK_TYPES.map(bt => (
                <Button
                  key={bt.value}
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 font-heading"
                  onClick={() => addBlock(bt.value)}
                >
                  <Plus className="w-3 h-3 mr-1" />{bt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* AI Builder */}
          <div className="border-t border-border pt-4 space-y-3">
            <label className="text-xs font-heading text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Content Builder
            </label>

            {/* Column Picker */}
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground">Columns</label>
              <ToggleGroup type="single" value={aiColumns} onValueChange={v => v && setAiColumns(v)} className="justify-start">
                {['1', '2', '3', '4'].map(n => (
                  <ToggleGroupItem key={n} value={n} className="text-xs h-7 px-3">{n}</ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Text Blocks */}
            <Accordion type="single" collapsible value={aiAccordion} onValueChange={setAiAccordion}>
              {aiTextBlocks.map((text, idx) => (
                <AccordionItem key={idx} value={`ai-text-${idx}`} className="border-border">
                  <div className="flex items-center gap-2">
                    <AccordionTrigger className="text-xs py-1 flex-1">
                      Text {idx + 1} {text.trim() ? '✓' : ''}
                    </AccordionTrigger>
                    {aiTextBlocks.length > 1 && (
                      <Button size="sm" variant="ghost" onClick={() => setAiTextBlocks(prev => prev.filter((_, i) => i !== idx))} className="h-5 w-5 p-0 text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <AccordionContent>
                    <Suspense fallback={<div className="h-24 bg-muted rounded animate-pulse" />}>
                      <div className="bg-white rounded-lg">
                        <RichTextEditor value={text} onChange={val => setAiTextBlocks(prev => prev.map((t, i) => i === idx ? val : t))} placeholder="Write content…" />
                      </div>
                    </Suspense>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button size="sm" variant="ghost" onClick={() => { setAiTextBlocks(prev => [...prev, '']); setAiAccordion(`ai-text-${aiTextBlocks.length}`); }} className="text-xs h-6">
              <Plus className="w-3 h-3 mr-1" />Add Text
            </Button>

            {/* Images */}
            <MultiImageUpload value={aiImages} onChange={setAiImages} label="Images" />
            <Button size="sm" variant="ghost" onClick={() => setAiMediaOpen(true)} className="text-xs h-6">
              Browse Library
            </Button>
            <MediaLibraryPicker open={aiMediaOpen} onClose={() => setAiMediaOpen(false)} onSelect={url => { setAiImages(prev => [...prev, url]); setAiMediaOpen(false); }} />

            {/* Links */}
            {aiLinks.map((link, idx) => (
              <div key={idx} className="flex gap-1 items-center">
                <Input value={link.label} onChange={e => setAiLinks(prev => prev.map((l, i) => i === idx ? { ...l, label: e.target.value } : l))} placeholder="Label" className="h-7 text-xs bg-background border-border text-foreground flex-1" />
                <Input value={link.url} onChange={e => setAiLinks(prev => prev.map((l, i) => i === idx ? { ...l, url: e.target.value } : l))} placeholder="URL" className="h-7 text-xs bg-background border-border text-foreground flex-1" />
                <Button size="sm" variant="ghost" onClick={() => setAiLinks(prev => prev.filter((_, i) => i !== idx))} className="h-5 w-5 p-0 text-destructive"><Trash2 className="w-3 h-3" /></Button>
              </div>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setAiLinks(prev => [...prev, { label: '', url: '' }])} className="text-xs h-6">
              <LinkIcon className="w-3 h-3 mr-1" />Add Link
            </Button>

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" onClick={aiAddContent} disabled={aiBuilding} className="text-xs h-7 font-heading">
                <Sparkles className="w-3 h-3 mr-1" />{aiBuilding ? 'Creating…' : 'AI Create'}
              </Button>
              <Button size="sm" variant="outline" onClick={aiRemix} disabled={aiRemixing} className="text-xs h-7 font-heading">
                <Shuffle className="w-3 h-3 mr-1" />{aiRemixing ? 'Remixing…' : 'Remix'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionToolbar;
