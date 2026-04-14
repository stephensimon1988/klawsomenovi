import { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Settings, Eye, EyeOff, ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { LAYOUT_TEMPLATES } from '@/components/DynamicSection';
import { ANIMATION_PRESETS } from '@/components/SectionWrapper';
import type { PageSectionConfig } from '@/components/SectionWrapper';
import ColorPickerField from '@/components/ColorPickerField';
import ImageUploadField from '@/components/ImageUploadField';

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
  const { cmsInvoke, triggerRefresh } = useEditMode();
  const [expanded, setExpanded] = useState(false);
  const [bgColor, setBgColor] = useState(config.bg_color || '');
  const [layoutTemplate, setLayoutTemplate] = useState(config.layout_template || 'stacked');
  const [animation, setAnimation] = useState(config.animation || '');
  const [sectionType, setSectionType] = useState(config.section_type || 'section');
  const [saving, setSaving] = useState(false);

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
        </div>
      )}
    </div>
  );
};

export default SectionToolbar;
