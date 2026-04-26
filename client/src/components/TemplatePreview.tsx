/**
 * Template Preview Component
 * Displays live preview of email template
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';
import { templateToHtml } from '../../../shared/email-template-renderer';

interface TemplatePreviewProps {
  selectedTemplateId?: string;
  onTemplateSelect: (templateId: string, htmlContent: string) => void;
}

export function TemplatePreview({ selectedTemplateId, onTemplateSelect }: TemplatePreviewProps) {
  const { data: templates, isLoading } = trpc.templates.list.useQuery();
  const { data: selectedTemplate, isLoading: isLoadingTemplate } = trpc.templates.get.useQuery(
    { id: selectedTemplateId || '' },
    { enabled: !!selectedTemplateId }
  );

  const handleTemplateChange = (templateId: string) => {
    if (selectedTemplate) {
      const htmlContent = templateToHtml(selectedTemplate);
      onTemplateSelect(templateId, htmlContent);
    }
  };

  const previewHtml = selectedTemplate ? templateToHtml(selectedTemplate) : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email-Template auswählen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedTemplateId || ''} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Template auswählen..." />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="p-2 text-sm text-muted-foreground">Laden...</div>
              ) : templates && templates.length > 0 ? (
                templates.map((template: any) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">Keine Templates vorhanden</div>
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vorschau</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTemplate ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : previewHtml ? (
              <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-96 border border-border rounded bg-white"
                  title="Email Template Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Keine Vorschau verfügbar
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
