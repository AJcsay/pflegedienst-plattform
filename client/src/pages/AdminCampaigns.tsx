import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, Plus, Send, Trash2, Edit2, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CampaignFormState {
  name: string;
  subject: string;
  preheader: string;
  htmlContent: string;
  textContent: string;
}

const initialFormState: CampaignFormState = {
  name: '',
  subject: '',
  preheader: '',
  htmlContent: '',
  textContent: '',
};

export function AdminCampaigns() {
  const [formState, setFormState] = useState<CampaignFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  // Queries
  const { data: campaigns = [], isLoading, refetch } = trpc.campaigns.list.useQuery();

  // Mutations
  const createMutation = trpc.campaigns.create.useMutation({
    onSuccess: () => {
      setFormState(initialFormState);
      setIsCreateDialogOpen(false);
      refetch();
    },
  });

  const updateMutation = trpc.campaigns.update.useMutation({
    onSuccess: () => {
      setFormState(initialFormState);
      setEditingId(null);
      refetch();
    },
  });

  const addSubscribersMutation = trpc.campaigns.addSubscribers.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const sendMutation = trpc.campaigns.send.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteMutation = trpc.campaigns.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        ...formState,
      });
    } else {
      await createMutation.mutateAsync(formState);
    }
  };

  const handleEdit = (campaign: any) => {
    setFormState({
      name: campaign.name,
      subject: campaign.subject,
      preheader: campaign.preheader || '',
      htmlContent: campaign.htmlContent,
      textContent: campaign.textContent || '',
    });
    setEditingId(campaign.id);
    setIsCreateDialogOpen(true);
  };

  const handlePreview = (content: string) => {
    setPreviewContent(content);
    setIsPreviewOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'secondary',
      sending: 'default',
      sent: 'default',
      scheduled: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email-Kampagnen</h1>
          <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Email-Marketing-Kampagnen</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setFormState(initialFormState);
              setEditingId(null);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Neue Kampagne
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Kampagne bearbeiten' : 'Neue Kampagne erstellen'}</DialogTitle>
              <DialogDescription>
                Erstellen Sie eine neue Email-Kampagne oder bearbeiten Sie eine bestehende
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kampagnenname</label>
                <Input
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="z.B. Newsletter März 2026"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Betreffzeile</label>
                <Input
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  placeholder="z.B. Neue Pflegeleistungen verfügbar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preheader (Vorschau)</label>
                <Input
                  value={formState.preheader}
                  onChange={(e) => setFormState({ ...formState, preheader: e.target.value })}
                  placeholder="Kurze Vorschau in der Email-Liste"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">HTML-Inhalt</label>
                <Textarea
                  value={formState.htmlContent}
                  onChange={(e) => setFormState({ ...formState, htmlContent: e.target.value })}
                  placeholder="HTML-Email-Inhalt"
                  rows={8}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Text-Inhalt (optional)</label>
                <Textarea
                  value={formState.textContent}
                  onChange={(e) => setFormState({ ...formState, textContent: e.target.value })}
                  placeholder="Fallback-Text für Email-Clients ohne HTML-Unterstützung"
                  rows={6}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingId(null);
                  }}
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? 'Speichern' : 'Erstellen'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Kampagnen werden geladen...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Keine Kampagnen vorhanden. Erstellen Sie eine neue Kampagne, um zu beginnen.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign: any) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription className="mt-1">{campaign.subject}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(campaign.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Empfänger</p>
                    <p className="text-lg font-semibold">{campaign.recipientCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Versendet</p>
                    <p className="text-lg font-semibold">{campaign.sentCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bounces</p>
                    <p className="text-lg font-semibold text-red-600">{campaign.bounceCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Erstellt</p>
                    <p className="text-sm">{new Date(campaign.createdAt).toLocaleDateString('de-DE')}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(campaign.htmlContent)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Vorschau
                  </Button>

                  {campaign.status === 'draft' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(campaign)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Bearbeiten
                      </Button>

                      {campaign.recipientCount === 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addSubscribersMutation.mutate({ campaignId: campaign.id })}
                          disabled={addSubscribersMutation.isPending}
                        >
                          Abonnenten hinzufügen
                        </Button>
                      )}

                      {campaign.recipientCount > 0 && (
                        <Button
                          size="sm"
                          onClick={() => sendMutation.mutate({ campaignId: campaign.id })}
                          disabled={sendMutation.isPending}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Versenden
                        </Button>
                      )}
                    </>
                  )}

                  {campaign.status === 'draft' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Möchten Sie diese Kampagne wirklich löschen?')) {
                          deleteMutation.mutate({ campaignId: campaign.id });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Löschen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email-Vorschau</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg p-4 bg-white">
            <div
              dangerouslySetInnerHTML={{ __html: previewContent }}
              className="prose prose-sm max-w-none"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
