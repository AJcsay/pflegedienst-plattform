import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AdminAnalytics() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Fetch all campaigns for selection
  const { data: campaigns } = trpc.campaigns.list.useQuery();

  // Fetch overall performance metrics
  const { data: performanceMetrics, isLoading: performanceLoading } = trpc.analytics.performanceMetrics.useQuery();

  // Fetch all campaigns analytics
  const { data: allCampaignsAnalytics, isLoading: allCampaignsLoading } = trpc.analytics.allCampaignsMetrics.useQuery();

  // Fetch selected campaign analytics
  const { data: campaignMetrics, isLoading: campaignLoading } = trpc.analytics.campaignMetrics.useQuery(
    { campaignId: selectedCampaignId || '' },
    { enabled: !!selectedCampaignId }
  );

  useEffect(() => {
    if (campaigns && campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0].id);
    }
  }, [campaigns, selectedCampaignId]);

  // Prepare chart data for all campaigns
  const allCampaignsChartData = allCampaignsAnalytics?.map((campaign) => ({
    name: campaign.campaignId.substring(0, 8),
    openRate: campaign.openRate,
    clickRate: campaign.clickRate,
    bounceRate: campaign.bounceRate,
  })) || [];

  // Prepare pie chart data for campaign metrics
  const campaignStatusData = campaignMetrics
    ? [
        { name: 'Opened', value: campaignMetrics.openedCount, color: '#3b82f6' },
        { name: 'Clicked', value: campaignMetrics.clickedCount, color: '#10b981' },
        { name: 'Bounced', value: campaignMetrics.bouncedCount, color: '#ef4444' },
        { name: 'Pending', value: campaignMetrics.totalRecipients - campaignMetrics.sentCount, color: '#9ca3af' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Analytics</h1>
        <p className="text-muted-foreground mt-2">Überwachen Sie die Leistung Ihrer Email-Kampagnen</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="campaigns">Alle Kampagnen</TabsTrigger>
          <TabsTrigger value="details">Kampagnen-Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {performanceLoading ? (
            <div className="text-center py-8">Lädt...</div>
          ) : performanceMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Gesamt Emails</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceMetrics.totalEmails}</div>
                  <p className="text-xs text-muted-foreground">Alle versendeten Emails</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Öffnungsrate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceMetrics.avgOpenRate}%</div>
                  <p className="text-xs text-muted-foreground">{performanceMetrics.openedEmails} Emails geöffnet</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Klickrate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceMetrics.avgClickRate}%</div>
                  <p className="text-xs text-muted-foreground">{performanceMetrics.clickedEmails} Klicks</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Bounce-Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceMetrics.avgBounceRate}%</div>
                  <p className="text-xs text-muted-foreground">{performanceMetrics.bouncedEmails} Bounces</p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>

        {/* All Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          {allCampaignsLoading ? (
            <div className="text-center py-8">Lädt...</div>
          ) : allCampaignsChartData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Kampagnen-Vergleich</CardTitle>
                <CardDescription>Öffnungs-, Klick- und Bounce-Raten aller Kampagnen</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={allCampaignsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="openRate" fill="#3b82f6" name="Öffnungsrate %" />
                    <Bar dataKey="clickRate" fill="#10b981" name="Klickrate %" />
                    <Bar dataKey="bounceRate" fill="#ef4444" name="Bounce-Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Keine Kampagnen-Daten verfügbar</p>
              </CardContent>
            </Card>
          )}

          {/* Campaigns Table */}
          {allCampaignsAnalytics && allCampaignsAnalytics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Kampagnen-Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Kampagnen-ID</th>
                        <th className="text-right py-2 px-4">Empfänger</th>
                        <th className="text-right py-2 px-4">Versendet</th>
                        <th className="text-right py-2 px-4">Geöffnet</th>
                        <th className="text-right py-2 px-4">Klicks</th>
                        <th className="text-right py-2 px-4">Bounces</th>
                        <th className="text-right py-2 px-4">Öffnungsrate</th>
                        <th className="text-right py-2 px-4">Klickrate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allCampaignsAnalytics.map((campaign) => (
                        <tr key={campaign.campaignId} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4 font-mono text-xs">{campaign.campaignId.substring(0, 12)}...</td>
                          <td className="text-right py-2 px-4">{campaign.totalRecipients}</td>
                          <td className="text-right py-2 px-4">{campaign.sentCount}</td>
                          <td className="text-right py-2 px-4">{campaign.openedCount}</td>
                          <td className="text-right py-2 px-4">{campaign.clickedCount}</td>
                          <td className="text-right py-2 px-4">{campaign.bouncedCount}</td>
                          <td className="text-right py-2 px-4 font-semibold">{campaign.openRate}%</td>
                          <td className="text-right py-2 px-4 font-semibold">{campaign.clickRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Campaign Details Tab */}
        <TabsContent value="details" className="space-y-4">
          {campaigns && campaigns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Kampagne auswählen</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedCampaignId || ''}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">-- Kampagne auswählen --</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name} ({campaign.id.substring(0, 8)})
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          )}

          {campaignLoading ? (
            <div className="text-center py-8">Lädt...</div>
          ) : campaignMetrics ? (
            <>
              {/* Campaign Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Gesamt Empfänger</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{campaignMetrics.totalRecipients}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Versendet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{campaignMetrics.sentCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Geöffnet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{campaignMetrics.openedCount}</div>
                    <p className="text-xs text-muted-foreground">{campaignMetrics.openRate}% Öffnungsrate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Klicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{campaignMetrics.clickedCount}</div>
                    <p className="text-xs text-muted-foreground">{campaignMetrics.clickRate}% Klickrate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Status Distribution */}
              {campaignStatusData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Status-Verteilung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={campaignStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {campaignStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Recipients Table */}
              {campaignMetrics.recipients && campaignMetrics.recipients.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Empfänger-Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Email</th>
                            <th className="text-left py-2 px-4">Status</th>
                            <th className="text-left py-2 px-4">Geöffnet</th>
                            <th className="text-left py-2 px-4">Geklickt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaignMetrics.recipients.slice(0, 20).map((recipient) => (
                            <tr key={recipient.id} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-4 text-xs">{recipient.email}</td>
                              <td className="py-2 px-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  recipient.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                  recipient.status === 'opened' ? 'bg-green-100 text-green-800' :
                                  recipient.status === 'clicked' ? 'bg-emerald-100 text-emerald-800' :
                                  recipient.status === 'bounced' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {recipient.status}
                                </span>
                              </td>
                              <td className="py-2 px-4 text-xs">{recipient.openedAt ? new Date(recipient.openedAt).toLocaleDateString('de-DE') : '-'}</td>
                              <td className="py-2 px-4 text-xs">{recipient.clickedAt ? new Date(recipient.clickedAt).toLocaleDateString('de-DE') : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {campaignMetrics.recipients.length > 20 && (
                      <p className="text-xs text-muted-foreground mt-4">Zeige 20 von {campaignMetrics.recipients.length} Empfängern</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : selectedCampaignId ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Keine Daten für diese Kampagne verfügbar</p>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
