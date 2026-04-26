import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Trash2, Copy, Plus, Eye, Code } from 'lucide-react';
import {
  EmailBlock,
  EmailTemplate,
  BLOCK_CONFIGS,
  BlockType,
} from '../../../shared/email-template-types';
import { templateToHtml } from '../../../shared/email-template-renderer';
import { nanoid } from 'nanoid';

interface EmailTemplateEditorProps {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
}

export function EmailTemplateEditor({ template, onSave, onCancel }: EmailTemplateEditorProps) {
  const [blocks, setBlocks] = useState<EmailBlock[]>(template.blocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setBlocks(arrayMove(blocks, oldIndex, newIndex));
      }
    }
  };

  const addBlock = (blockType: BlockType) => {
    const config = BLOCK_CONFIGS[blockType] as any;
    const newBlock: any = {
      id: nanoid(),
      ...config.defaultProps,
    };

    setBlocks([...blocks, newBlock] as EmailBlock[]);
    setSelectedBlockId(newBlock.id);
    toast.success(`${config.label} hinzugefügt`);
  };

  const deleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    toast.success('Block gelöscht');
  };

  const duplicateBlock = (blockId: string) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    if (blockIndex !== -1) {
      const blockToDuplicate = blocks[blockIndex];
      const newBlock = {
        ...blockToDuplicate,
        id: nanoid(),
      };
      const newBlocks = [...blocks];
      newBlocks.splice(blockIndex + 1, 0, newBlock);
      setBlocks(newBlocks);
      toast.success('Block dupliziert');
    }
  };

  const updateBlock = (blockId: string, updates: Partial<EmailBlock>) => {
    setBlocks(
      blocks.map(b => (b.id === blockId ? { ...b, ...updates } : b))
    );
  };

  const handleSave = () => {
    const updatedTemplate: EmailTemplate = {
      ...template,
      blocks,
      updatedAt: new Date(),
    };
    onSave(updatedTemplate);
    toast.success('Template gespeichert');
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const html = templateToHtml({ ...template, blocks });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-screen overflow-hidden">
      {/* Left: Block Library */}
      <div className="lg:col-span-1 border-r overflow-y-auto p-4">
        <h3 className="font-semibold mb-4">Blöcke</h3>
        <div className="space-y-2">
          {Object.entries(BLOCK_CONFIGS).map(([type, config]) => (
            <Button
              key={type}
              onClick={() => addBlock(type as BlockType)}
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              {config.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Middle: Canvas */}
      <div className="lg:col-span-1 border-r overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Vorschau</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {previewMode ? (
          <div className="bg-white border rounded p-4 space-y-2">
            {blocks.map(block => (
              <BlockPreview key={block.id} block={block} />
            ))}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {blocks.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Ziehen Sie Blöcke hier rein oder klicken Sie auf "Blöcke" um neue hinzuzufügen
                    </CardContent>
                  </Card>
                ) : (
                  blocks.map(block => (
                    <DraggableBlock
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => setSelectedBlockId(block.id)}
                      onDelete={() => deleteBlock(block.id)}
                      onDuplicate={() => duplicateBlock(block.id)}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Right: Settings */}
      <div className="lg:col-span-1 border-l overflow-y-auto p-4">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="actions">Aktionen</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4 mt-4">
            {selectedBlock ? (
              <BlockSettings
                block={selectedBlock}
                onUpdate={(updates) => updateBlock(selectedBlock.id, updates)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Wählen Sie einen Block aus, um ihn zu bearbeiten
              </p>
            )}
          </TabsContent>

          <TabsContent value="html" className="mt-4">
            <div className="space-y-2">
              <Label>HTML-Code</Label>
              <textarea
                value={html}
                readOnly
                className="w-full h-64 p-2 border rounded font-mono text-xs"
              />
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(html);
                  toast.success('HTML kopiert');
                }}
              >
                Kopieren
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-2 mt-4">
            <Button onClick={handleSave} className="w-full">
              Speichern
            </Button>
            <Button onClick={onCancel} variant="outline" className="w-full">
              Abbrechen
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DraggableBlock({
  block,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  block: EmailBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className={`p-3 border rounded cursor-move ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{getBlockLabel(block)}</span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function BlockPreview({ block }: { block: EmailBlock }) {
  const preview = getBlockPreview(block);
  return (
    <div
      className="p-3 border rounded bg-gray-50"
      dangerouslySetInnerHTML={{ __html: preview }}
    />
  );
}

function BlockSettings({
  block,
  onUpdate,
}: {
  block: EmailBlock;
  onUpdate: (updates: Partial<EmailBlock>) => void;
}) {
  switch (block.type) {
    case 'text':
      return <TextBlockSettings block={block as any} onUpdate={onUpdate} />;
    case 'heading':
      return <HeadingBlockSettings block={block as any} onUpdate={onUpdate} />;
    case 'button':
      return <ButtonBlockSettings block={block as any} onUpdate={onUpdate} />;
    case 'image':
      return <ImageBlockSettings block={block as any} onUpdate={onUpdate} />;
    default:
      return <p className="text-sm text-muted-foreground">Keine Einstellungen verfügbar</p>;
  }
}

function TextBlockSettings({ block, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Text</Label>
        <textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full p-2 border rounded text-sm"
          rows={3}
        />
      </div>
      <div>
        <Label>Schriftgröße</Label>
        <Input
          type="number"
          value={block.fontSize}
          onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <Label>Ausrichtung</Label>
        <Select value={block.alignment} onValueChange={(v) => onUpdate({ alignment: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Links</SelectItem>
            <SelectItem value="center">Mitte</SelectItem>
            <SelectItem value="right">Rechts</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function HeadingBlockSettings({ block, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Überschrift</Label>
        <Input
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
        />
      </div>
      <div>
        <Label>Ebene</Label>
        <Select value={String(block.level)} onValueChange={(v) => onUpdate({ level: parseInt(v) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ButtonBlockSettings({ block, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Button-Text</Label>
        <Input
          value={block.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
        />
      </div>
      <div>
        <Label>URL</Label>
        <Input
          value={block.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
        />
      </div>
    </div>
  );
}

function ImageBlockSettings({ block, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Bild-URL</Label>
        <Input
          value={block.src}
          onChange={(e) => onUpdate({ src: e.target.value })}
        />
      </div>
      <div>
        <Label>Alt-Text</Label>
        <Input
          value={block.alt}
          onChange={(e) => onUpdate({ alt: e.target.value })}
        />
      </div>
    </div>
  );
}

function getBlockLabel(block: EmailBlock): string {
  switch (block.type) {
    case 'text':
      return `Text: ${(block as any).content.substring(0, 30)}...`;
    case 'heading':
      return `Überschrift: ${(block as any).content}`;
    case 'button':
      return `Button: ${(block as any).text}`;
    case 'image':
      return `Bild: ${(block as any).alt}`;
    case 'divider':
      return 'Trennlinie';
    case 'spacer':
      return 'Abstand';
    case 'section':
      return `Sektion (${(block as any).blocks.length} Blöcke)`;
    default:
      return 'Unbekannter Block';
  }
}

function getBlockPreview(block: EmailBlock): string {
  switch (block.type) {
    case 'text':
      return `<p style="font-size: 14px; color: #666;">${(block as any).content}</p>`;
    case 'heading':
      return `<h${(block as any).level} style="color: #000; margin: 0;">${(block as any).content}</h${(block as any).level}>`;
    case 'button':
      return `<a href="#" style="background: ${(block as any).backgroundColor}; color: ${(block as any).textColor}; padding: 10px 20px; text-decoration: none; border-radius: 4px;">${(block as any).text}</a>`;
    case 'image':
      return `<img src="${(block as any).src}" alt="${(block as any).alt}" style="max-width: 100%; height: auto;">`;
    default:
      return '';
  }
}
