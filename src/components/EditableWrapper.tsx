import { useState, useRef, useEffect } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { Pencil, Save, X, Trash2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MediaLibraryPicker from '@/components/MediaLibraryPicker';
import type { SectionContentBlock } from '@/hooks/useCmsContent';

interface EditableWrapperProps {
  block: SectionContentBlock;
  children: React.ReactNode;
}

const EditableWrapper = ({ block, children }: EditableWrapperProps) => {
  const { isEditMode, cmsInvoke, triggerRefresh } = useEditMode();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  if (!isEditMode) return <>{children}</>;

  const c = (block.content || {}) as Record<string, any>;
  const blockType = block.block_type;

  const startEdit = () => {
    setEditContent({ ...c });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent({});
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await cmsInvoke({
        action: 'update',
        table: 'section_content_blocks',
        id: block.id,
        data: { content: editContent },
      });
      toast.success('Block saved');
      setIsEditing(false);
      triggerRefresh();
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    }
    setSaving(false);
  };

  const deleteBlock = async () => {
    if (!confirm('Delete this block?')) return;
    try {
      await cmsInvoke({
        action: 'delete',
        table: 'section_content_blocks',
        id: block.id,
      });
      toast.success('Block deleted');
      triggerRefresh();
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
    }
  };

  const renderEditor = () => {
    switch (blockType) {
      case 'heading':
      case 'text':
        return (
          <div className="space-y-2">
            <Input
              value={editContent.text || ''}
              onChange={e => setEditContent({ ...editContent, text: e.target.value })}
              className="text-sm"
              autoFocus
            />
          </div>
        );
      case 'richtext':
        return (
          <div className="space-y-2">
            <Textarea
              value={editContent.html || editContent.text || ''}
              onChange={e => setEditContent({ ...editContent, html: e.target.value })}
              className="text-sm min-h-[120px] font-mono"
              placeholder="HTML content..."
            />
          </div>
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              value={editContent.url || ''}
              onChange={e => setEditContent({ ...editContent, url: e.target.value })}
              placeholder="Image URL"
              className="text-sm"
            />
            <Input
              value={editContent.alt || ''}
              onChange={e => setEditContent({ ...editContent, alt: e.target.value })}
              placeholder="Alt text"
              className="text-sm"
            />
          </div>
        );
      case 'button':
        return (
          <div className="space-y-2">
            <Input
              value={editContent.text || ''}
              onChange={e => setEditContent({ ...editContent, text: e.target.value })}
              placeholder="Button text"
              className="text-sm"
            />
            <Input
              value={editContent.url || ''}
              onChange={e => setEditContent({ ...editContent, url: e.target.value })}
              placeholder="Button URL"
              className="text-sm"
            />
          </div>
        );
      case 'data_cards':
        return (
          <div className="text-sm text-muted-foreground">
            <p>Source: <strong>{editContent.source || 'inline'}</strong></p>
            <p className="text-xs mt-1">Edit data in the admin panel or change source below:</p>
            <Input
              value={editContent.source || ''}
              onChange={e => setEditContent({ ...editContent, source: e.target.value })}
              placeholder="Table source name"
              className="text-sm mt-2"
            />
          </div>
        );
      case 'video':
      case 'iframe':
        return (
          <div className="space-y-2">
            <Input
              value={editContent.url || ''}
              onChange={e => setEditContent({ ...editContent, url: e.target.value })}
              placeholder="URL"
              className="text-sm"
            />
          </div>
        );
      case 'spacer':
        return (
          <div className="space-y-2">
            <Input
              value={editContent.height || '2rem'}
              onChange={e => setEditContent({ ...editContent, height: e.target.value })}
              placeholder="Height (e.g. 2rem, 40px)"
              className="text-sm"
            />
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <Textarea
              value={JSON.stringify(editContent, null, 2)}
              onChange={e => {
                try { setEditContent(JSON.parse(e.target.value)); } catch {}
              }}
              className="text-xs font-mono min-h-[100px]"
            />
          </div>
        );
    }
  };

  const typeLabels: Record<string, string> = {
    heading: '📝 Heading',
    text: '📄 Text',
    richtext: '📰 Rich Text',
    image: '🖼 Image',
    video: '🎬 Video',
    button: '🔘 Button',
    data_cards: '📊 Data Cards',
    list: '📋 List',
    divider: '— Divider',
    spacer: '↕ Spacer',
    iframe: '🔲 Embed',
    gallery: '🖼 Gallery',
    reviews: '⭐ Reviews',
    countdown: '⏰ Countdown',
    carousel: '🎠 Carousel',
    tabs: '📑 Tabs',
    table: '📊 Table',
    map: '🗺 Map',
    icon_box: '✨ Icon Box',
    code: '💻 Code',
  };

  return (
    <div
      ref={wrapperRef}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover outline */}
      {(isHovered || isEditing) && (
        <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg pointer-events-none z-10" />
      )}

      {/* Type badge */}
      {isHovered && !isEditing && (
        <div className="absolute -top-3 right-2 z-20 flex items-center gap-1">
          <span className="bg-primary text-primary-foreground text-xs font-heading font-bold px-2 py-0.5 rounded-full shadow">
            {typeLabels[blockType] || blockType}
          </span>
          <Button
            size="sm"
            onClick={startEdit}
            className="h-6 w-6 p-0 rounded-full bg-primary text-primary-foreground shadow"
          >
            <Pencil className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Content */}
      {!isEditing && children}

      {/* Edit popover */}
      {isEditing && (
        <div className="bg-background border border-border rounded-xl p-4 shadow-2xl space-y-3 z-30 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-muted-foreground">
              Editing: {typeLabels[blockType] || blockType}
            </span>
          </div>
          {renderEditor()}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={saveEdit} disabled={saving} className="font-heading font-bold text-xs">
              <Save className="w-3 h-3 mr-1" />
              {saving ? '...' : 'Save'}
            </Button>
            <Button size="sm" variant="ghost" onClick={cancelEdit} className="text-xs">
              <X className="w-3 h-3 mr-1" />Cancel
            </Button>
            <Button size="sm" variant="ghost" onClick={deleteBlock} className="text-destructive text-xs ml-auto">
              <Trash2 className="w-3 h-3 mr-1" />Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableWrapper;
