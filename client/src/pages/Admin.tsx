import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminAnalytics } from "./AdminAnalytics";
import { AdminUsers } from "./AdminUsers";
import { TemplatePreview } from "@/components/TemplatePreview";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  LayoutDashboard, Briefcase, Users, Building2, Activity, MessageSquare, FileText,
  Plus, ArrowLeft, Heart, ExternalLink, Trash2, Eye, Loader2, Shield, Calendar, Mail, Copy, Bell,
  Send, RefreshCw, XCircle, CheckCircle2, Clock, AlertTriangle
} from "lucide-react";

// ─── Enum type aliases (must match drizzle schema) ───────────────────────────
type ApplicationStatus = "new" | "reviewing" | "interview" | "accepted" | "rejected";
type ReferralStatus = "new" | "inProgress" | "completed" | "declined";
type CapacityStatus = "new" | "responded" | "closed";
type ContactStatus = "new" | "read" | "replied" | "closed";
type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";
type EmploymentType = "fulltime" | "parttime" | "minijob" | "internship";
type DocumentCategory = "quality" | "supply" | "contract" | "other";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-amber-100 text-amber-700",
  interview: "bg-purple-100 text-purple-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  inProgress: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  read: "bg-gray-100 text-gray-700",
  replied: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
  responded: "bg-green-100 text-green-700",
};

const statusLabels: Record<string, string> = {
  new: "Neu", reviewing: "In Prüfung", interview: "Vorstellungsgespräch",
  accepted: "Angenommen", rejected: "Abgelehnt", inProgress: "In Bearbeitung",
  completed: "Abgeschlossen", declined: "Abgelehnt", read: "Gelesen",
  replied: "Beantwortet", closed: "Geschlossen", responded: "Beantwortet",
};

const employmentTypeLabels: Record<string, string> = {
  fulltime: "Vollzeit", parttime: "Teilzeit", minijob: "Minijob", internship: "Praktikum",
};

export default function Admin() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [adminToken, setAdminToken] = useState<string | null>(null);
  
  // Get admin token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setAdminToken(token);
  }, []);
  
  const adminMeQuery = trpc.adminAuth.me.useQuery(
    adminToken ? { token: adminToken } : undefined,
    { enabled: !!adminToken }
  );
  const adminLogoutMutation = trpc.adminAuth.logout.useMutation();
  const mausLogoutMutation = trpc.auth.logout.useMutation();
  
  // Check if user is logged in via admin auth or Manus OAuth
  const isAdminUser = adminMeQuery.data;
  const isMausUser = user && user.role === "admin";
  const isAuthenticated = isAdminUser || isMausUser;

  // Handle redirects in useEffect to avoid render-phase navigation
  useEffect(() => {
    if (loading || adminMeQuery.isLoading) return;
    
    if (!isAuthenticated) {
      if (isMausUser) {
        window.location.href = getLoginUrl();
      } else {
        navigate("/admin/login");
      }
    }
  }, [loading, adminMeQuery.isLoading, isAuthenticated, isMausUser, navigate]);

  if (loading || adminMeQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isMausUser && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <Shield className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Zugriff verweigert</h2>
          <p className="text-muted-foreground mb-6">Sie haben keine Berechtigung für den Admin-Bereich.</p>
          <Link href="/"><Button className="rounded-full">Zur Startseite</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin header */}
      <div className="bg-white border-b border-border/50 sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Zurück zur Website</span>
            </Link>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Admin-Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Angemeldet als <span className="font-medium text-foreground">{isAdminUser?.name || isAdminUser?.email || user?.name || user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (isAdminUser) {
                  await adminLogoutMutation.mutateAsync();
                  localStorage.removeItem("adminToken");
                  setAdminToken(null);
                  navigate("/admin/login");
                } else {
                  // Manus OAuth logout
                  await mausLogoutMutation.mutateAsync();
                  navigate("/");
                }
              }}
              disabled={adminLogoutMutation.isPending || mausLogoutMutation.isPending}
            >
              {adminLogoutMutation.isPending || mausLogoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Abmelden"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-border/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="overview" className="gap-1.5"><LayoutDashboard className="h-3.5 w-3.5" />Übersicht</TabsTrigger>
            <TabsTrigger value="appointments" className="gap-1.5"><Calendar className="h-3.5 w-3.5" />Termine</TabsTrigger>
            <TabsTrigger value="reminders" className="gap-1.5"><Bell className="h-3.5 w-3.5" />Reminder</TabsTrigger>
            <TabsTrigger value="applications" className="gap-1.5"><Users className="h-3.5 w-3.5" />Bewerbungen</TabsTrigger>
            <TabsTrigger value="referrals" className="gap-1.5"><Building2 className="h-3.5 w-3.5" />Zuweiser</TabsTrigger>
            <TabsTrigger value="capacity" className="gap-1.5"><Activity className="h-3.5 w-3.5" />Kapazität</TabsTrigger>
            <TabsTrigger value="contacts" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" />Kontakt</TabsTrigger>
            <TabsTrigger value="jobs" className="gap-1.5"><Briefcase className="h-3.5 w-3.5" />Stellen</TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5"><FileText className="h-3.5 w-3.5" />Dokumente</TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-1.5"><Mail className="h-3.5 w-3.5" />Kampagnen</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5"><Activity className="h-3.5 w-3.5" />Analytics</TabsTrigger>
            <TabsTrigger value="templates" className="gap-1.5"><FileText className="h-3.5 w-3.5" />Templates</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5"><Shield className="h-3.5 w-3.5" />Einstellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="appointments"><AppointmentsAdminTab /></TabsContent>
          <TabsContent value="reminders"><RemindersTab /></TabsContent>
          <TabsContent value="applications"><ApplicationsTab /></TabsContent>
          <TabsContent value="referrals"><ReferralsTab /></TabsContent>
          <TabsContent value="capacity"><CapacityTab /></TabsContent>
          <TabsContent value="contacts"><ContactsTab /></TabsContent>
          <TabsContent value="jobs"><JobsTab /></TabsContent>
          <TabsContent value="documents"><DocumentsTab /></TabsContent>
          <TabsContent value="campaigns"><CampaignsTab /></TabsContent>
          <TabsContent value="analytics"><AdminAnalytics /></TabsContent>
          <TabsContent value="templates"><TemplatesTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return <AdminAnalytics />;
}

function OverviewTab() {
  const { data: apps } = trpc.applications.list.useQuery();
  const { data: refs } = trpc.referrals.list.useQuery();
  const { data: caps } = trpc.capacity.list.useQuery();
  const { data: contacts } = trpc.contact.list.useQuery();
  const { data: campaigns } = trpc.campaigns.list.useQuery();
  const { data: metrics } = trpc.analytics.performanceMetrics.useQuery();

  const newApps = apps?.filter(a => a.status === "new").length || 0;
  const newRefs = refs?.filter(r => r.status === "new").length || 0;
  const newCaps = caps?.filter(c => c.status === "new").length || 0;
  const newContacts = contacts?.filter(c => c.status === "new").length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === "sending" || c.status === "sent").length || 0;

  const stats = [
    { label: "Neue Bewerbungen", value: newApps, total: apps?.length || 0, icon: Users, color: "text-blue-600" },
    { label: "Zuweiser-Anfragen", value: newRefs, total: refs?.length || 0, icon: Building2, color: "text-purple-600" },
    { label: "Kapazitätsabfragen", value: newCaps, total: caps?.length || 0, icon: Activity, color: "text-amber-600" },
    { label: "Kontaktanfragen", value: newContacts, total: contacts?.length || 0, icon: MessageSquare, color: "text-green-600" },
    { label: "Email-Kampagnen", value: activeCampaigns, total: campaigns?.length || 0, icon: Mail, color: "text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Übersicht</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                {s.value > 0 && <Badge className="bg-red-100 text-red-700 text-xs">{s.value} neu</Badge>}
              </div>
              <div className="text-2xl font-bold text-foreground">{s.total}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ApplicationsTab() {
  const utils = trpc.useUtils();
  const { data: apps, isLoading } = trpc.applications.list.useQuery();
  const updateStatus = trpc.applications.updateStatus.useMutation({
    onSuccess: () => { utils.applications.list.invalidate(); toast.success("Status aktualisiert"); },
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Bewerbungen ({apps?.length || 0})</h2>
      {apps?.map((app) => (
        <Card key={app.id} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{app.firstName} {app.lastName}</span>
                  <Badge className={`text-xs ${statusColors[app.status] || ""}`}>{statusLabels[app.status] || app.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{app.email} {app.phone && `· ${app.phone}`}</div>
                {app.message && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{app.message}</p>}
                <div className="text-xs text-muted-foreground mt-1">{new Date(app.createdAt).toLocaleDateString("de-DE")}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {app.resumeUrl && (
                  <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="bg-white"><ExternalLink className="h-3.5 w-3.5 mr-1" />Lebenslauf</Button>
                  </a>
                )}
                <Select value={app.status} onValueChange={(v) => updateStatus.mutate({ id: app.id, status: v as ApplicationStatus })}>
                  <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["new", "reviewing", "interview", "accepted", "rejected"].map(s => (
                      <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {(!apps || apps.length === 0) && <p className="text-muted-foreground text-center py-8">Noch keine Bewerbungen eingegangen.</p>}
    </div>
  );
}

function ReferralsTab() {
  const utils = trpc.useUtils();
  const { data: refs, isLoading } = trpc.referrals.list.useQuery();
  const updateStatus = trpc.referrals.updateStatus.useMutation({
    onSuccess: () => { utils.referrals.list.invalidate(); toast.success("Status aktualisiert"); },
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mt-8" />;

  const urgencyLabels: Record<string, string> = { normal: "Normal", urgent: "Dringend", emergency: "Notfall" };
  const urgencyColors: Record<string, string> = { normal: "bg-gray-100 text-gray-700", urgent: "bg-amber-100 text-amber-700", emergency: "bg-red-100 text-red-700" };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Zuweiser-Anfragen ({refs?.length || 0})</h2>
      {refs?.map((ref) => (
        <Card key={ref.id} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-foreground">{ref.institutionName}</span>
                  <Badge className={`text-xs ${statusColors[ref.status] || ""}`}>{statusLabels[ref.status] || ref.status}</Badge>
                  <Badge className={`text-xs ${urgencyColors[ref.urgency] || ""}`}>{urgencyLabels[ref.urgency] || ref.urgency}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{ref.contactPerson} · {ref.email}</div>
                {ref.patientName && <div className="text-sm text-muted-foreground mt-1">Patient: {ref.patientName} {ref.careLevel && `· Pflegegrad ${ref.careLevel}`}</div>}
                {ref.careNeeds && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ref.careNeeds}</p>}
                <div className="text-xs text-muted-foreground mt-1">{new Date(ref.createdAt).toLocaleDateString("de-DE")}</div>
              </div>
              <Select value={ref.status} onValueChange={(v) => updateStatus.mutate({ id: ref.id, status: v as ReferralStatus })}>
                <SelectTrigger className="w-[140px] h-8 text-xs shrink-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["new", "inProgress", "completed", "declined"].map(s => (
                    <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
      {(!refs || refs.length === 0) && <p className="text-muted-foreground text-center py-8">Noch keine Zuweiser-Anfragen eingegangen.</p>}
    </div>
  );
}

function CapacityTab() {
  const utils = trpc.useUtils();
  const { data: caps, isLoading } = trpc.capacity.list.useQuery();
  const updateStatus = trpc.capacity.updateStatus.useMutation({
    onSuccess: () => { utils.capacity.list.invalidate(); toast.success("Status aktualisiert"); },
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Kapazitätsabfragen ({caps?.length || 0})</h2>
      {caps?.map((cap) => (
        <Card key={cap.id} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{cap.institutionName}</span>
                  <Badge className={`text-xs ${statusColors[cap.status] || ""}`}>{statusLabels[cap.status] || cap.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{cap.contactPerson} · {cap.email}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {cap.careType && `Pflegeart: ${cap.careType}`}
                  {cap.region && ` · Region: ${cap.region}`}
                  {cap.numberOfPatients && ` · ${cap.numberOfPatients} Patienten`}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(cap.createdAt).toLocaleDateString("de-DE")}</div>
              </div>
              <Select value={cap.status} onValueChange={(v) => updateStatus.mutate({ id: cap.id, status: v as CapacityStatus })}>
                <SelectTrigger className="w-[140px] h-8 text-xs shrink-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["new", "responded", "closed"].map(s => (
                    <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
      {(!caps || caps.length === 0) && <p className="text-muted-foreground text-center py-8">Noch keine Kapazitätsabfragen eingegangen.</p>}
    </div>
  );
}

function ContactsTab() {
  const utils = trpc.useUtils();
  const { data: contacts, isLoading } = trpc.contact.list.useQuery();
  const updateStatus = trpc.contact.updateStatus.useMutation({
    onSuccess: () => { utils.contact.list.invalidate(); toast.success("Status aktualisiert"); },
  });

  const categoryLabels: Record<string, string> = { patient: "Patient", insurance: "Krankenkasse", general: "Allgemein" };

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Kontaktanfragen ({contacts?.length || 0})</h2>
      {contacts?.map((c) => (
        <Card key={c.id} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{c.firstName} {c.lastName}</span>
                  <Badge className={`text-xs ${statusColors[c.status] || ""}`}>{statusLabels[c.status] || c.status}</Badge>
                  <Badge variant="outline" className="text-xs">{categoryLabels[c.category] || c.category}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{c.email} {c.organization && `· ${c.organization}`}</div>
                {c.subject && <div className="text-sm font-medium text-foreground/80 mt-1">{c.subject}</div>}
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.message}</p>
                <div className="text-xs text-muted-foreground mt-1">{new Date(c.createdAt).toLocaleDateString("de-DE")}</div>
              </div>
              <Select value={c.status} onValueChange={(v) => updateStatus.mutate({ id: c.id, status: v as ContactStatus })}>
                <SelectTrigger className="w-[140px] h-8 text-xs shrink-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["new", "read", "replied", "closed"].map(s => (
                    <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
      {(!contacts || contacts.length === 0) && <p className="text-muted-foreground text-center py-8">Noch keine Kontaktanfragen eingegangen.</p>}
    </div>
  );
}

function JobsTab() {
  const utils = trpc.useUtils();
  const { data: jobs, isLoading } = trpc.jobs.listAll.useQuery();
  const deleteJob = trpc.jobs.delete.useMutation({
    onSuccess: () => { utils.jobs.listAll.invalidate(); toast.success("Stelle gelöscht"); },
  });
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newJob, setNewJob] = useState<{
    title: string;
    department: string;
    location: string;
    employmentType: EmploymentType;
    description: string;
    requirements: string;
    benefits: string;
  }>({
    title: "", department: "", location: "", employmentType: "fulltime",
    description: "", requirements: "", benefits: "",
  });
  const createJob = trpc.jobs.create.useMutation({
    onSuccess: () => { utils.jobs.listAll.invalidate(); utils.jobs.list.invalidate(); setShowCreate(false); setNewJob({ title: "", department: "", location: "", employmentType: "fulltime", description: "", requirements: "", benefits: "" }); toast.success("Stelle erstellt"); },
  });
  const updateJob = trpc.jobs.update.useMutation({
    onSuccess: () => { utils.jobs.listAll.invalidate(); utils.jobs.list.invalidate(); setEditingId(null); toast.success("Stelle aktualisiert"); },
  });
  const toggleActive = trpc.jobs.update.useMutation({
    onSuccess: () => { utils.jobs.listAll.invalidate(); utils.jobs.list.invalidate(); toast.success("Status aktualisiert"); },
  });

  const handleEditClick = (job: NonNullable<typeof jobs>[0]) => {
    setNewJob({ title: job.title, department: job.department || "", location: job.location || "", employmentType: job.employmentType, description: job.description, requirements: job.requirements || "", benefits: job.benefits || "" });
    setEditingId(job.id);
  };

  const handleSaveEdit = () => {
    if (editingId) updateJob.mutate({ id: editingId, ...newJob });
  };

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Stellenanzeigen ({jobs?.length || 0})</h2>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full"><Plus className="h-4 w-4 mr-1" />Neue Stelle</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Neue Stellenanzeige</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createJob.mutate(newJob); }} className="space-y-4">
              <div className="space-y-2"><Label>Titel *</Label><Input required value={newJob.title} onChange={e => setNewJob(j => ({ ...j, title: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Abteilung</Label><Input value={newJob.department} onChange={e => setNewJob(j => ({ ...j, department: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Standort</Label><Input value={newJob.location} onChange={e => setNewJob(j => ({ ...j, location: e.target.value }))} /></div>
              </div>
              <div className="space-y-2">
                <Label>Beschäftigungsart</Label>
                <Select value={newJob.employmentType} onValueChange={(v) => setNewJob(j => ({ ...j, employmentType: v as EmploymentType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(employmentTypeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Beschreibung *</Label><Textarea required rows={4} value={newJob.description} onChange={e => setNewJob(j => ({ ...j, description: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Anforderungen</Label><Textarea rows={3} value={newJob.requirements} onChange={e => setNewJob(j => ({ ...j, requirements: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Benefits</Label><Textarea rows={3} value={newJob.benefits} onChange={e => setNewJob(j => ({ ...j, benefits: e.target.value }))} /></div>
              <Button type="submit" className="w-full rounded-full" disabled={createJob.isPending}>
                {createJob.isPending ? "Wird erstellt..." : "Stelle erstellen"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {jobs?.map((job) => (
        <Card key={job.id} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{job.title}</span>
                  <Badge className={job.isActive ? "bg-green-100 text-green-700 text-xs" : "bg-gray-100 text-gray-700 text-xs"}>
                    {job.isActive ? "Aktiv" : "Inaktiv"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{employmentTypeLabels[job.employmentType]}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{job.department} {job.location && `· ${job.location}`}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Dialog open={editingId === job.id} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white" onClick={() => handleEditClick(job)}>Bearbeiten</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Stelle bearbeiten</DialogTitle></DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                      <div className="space-y-2"><Label>Titel *</Label><Input required value={newJob.title} onChange={e => setNewJob(j => ({ ...j, title: e.target.value }))} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2"><Label>Abteilung</Label><Input value={newJob.department} onChange={e => setNewJob(j => ({ ...j, department: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Standort</Label><Input value={newJob.location} onChange={e => setNewJob(j => ({ ...j, location: e.target.value }))} /></div>
                      </div>
                      <div className="space-y-2">
                        <Label>Beschäftigungsart</Label>
                        <Select value={newJob.employmentType} onValueChange={(v) => setNewJob(j => ({ ...j, employmentType: v as EmploymentType }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(employmentTypeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Beschreibung *</Label><Textarea required rows={4} value={newJob.description} onChange={e => setNewJob(j => ({ ...j, description: e.target.value }))} /></div>
                      <div className="space-y-2"><Label>Anforderungen</Label><Textarea rows={3} value={newJob.requirements} onChange={e => setNewJob(j => ({ ...j, requirements: e.target.value }))} /></div>
                      <div className="space-y-2"><Label>Benefits</Label><Textarea rows={3} value={newJob.benefits} onChange={e => setNewJob(j => ({ ...j, benefits: e.target.value }))} /></div>
                      <Button type="submit" className="w-full rounded-full" disabled={updateJob.isPending}>
                        {updateJob.isPending ? "Wird gespeichert..." : "Speichern"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => toggleActive.mutate({ id: job.id, isActive: !job.isActive })}>
                  {job.isActive ? "Deaktivieren" : "Aktivieren"}
                </Button>
                <Button variant="outline" size="sm" className="bg-white text-destructive hover:text-destructive" onClick={() => { if (confirm("Stelle wirklich löschen?")) deleteJob.mutate({ id: job.id }); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {(!jobs || jobs.length === 0) && <p className="text-muted-foreground text-center py-8">Noch keine Stellenanzeigen erstellt.</p>}
    </div>
  );
}

function DocumentsTab() {
  const utils = trpc.useUtils();
  const { data: docs, isLoading } = trpc.documents.listAll.useQuery();
  const deleteMutation = trpc.documents.delete.useMutation({
    onSuccess: () => { utils.documents.listAll.invalidate(); utils.documents.list.invalidate(); toast.success("Dokument gelöscht"); },
  });
  const [showUpload, setShowUpload] = useState(false);
  const [newDoc, setNewDoc] = useState<{
    title: string;
    description: string;
    category: DocumentCategory;
  }>({ title: "", description: "", category: "other" });
  const [file, setFile] = useState<File | null>(null);
  const uploadMutation = trpc.documents.upload.useMutation({
    onSuccess: () => { utils.documents.listAll.invalidate(); utils.documents.list.invalidate(); setShowUpload(false); setNewDoc({ title: "", description: "", category: "other" }); setFile(null); toast.success("Dokument hochgeladen"); },
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Bitte wählen Sie eine Datei aus."); return; }
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) { binary += String.fromCharCode(bytes[i]); }
    uploadMutation.mutate({
      ...newDoc,
      fileBase64: btoa(binary),
      fileName: file.name,
      fileSize: file.size,
    });
  };

  const categoryLabels: Record<string, string> = { quality: "Qualität", supply: "Versorgung", contract: "Vertrag", other: "Sonstiges" };

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Partner-Dokumente ({docs?.length || 0})</h2>
        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full"><Plus className="h-4 w-4 mr-1" />Hochladen</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Dokument hochladen</DialogTitle></DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2"><Label>Titel *</Label><Input required value={newDoc.title} onChange={e => setNewDoc(d => ({ ...d, title: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Beschreibung</Label><Textarea rows={2} value={newDoc.description} onChange={e => setNewDoc(d => ({ ...d, description: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Kategorie</Label>
                <Select value={newDoc.category} onValueChange={(v) => setNewDoc(d => ({ ...d, category: v as DocumentCategory }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Datei *</Label>
                <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? "Wird hochgeladen..." : "Hochladen"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {docs?.map((doc) => (
        <Card key={doc.id} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">{doc.title}</div>
                  <div className="text-sm text-muted-foreground">{doc.fileName} · {categoryLabels[doc.category]}{doc.fileSize && ` · ${(doc.fileSize / 1024 / 1024).toFixed(1)} MB`}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="bg-white"><ExternalLink className="h-3.5 w-3.5" /></Button>
                </a>
                <Button variant="outline" size="sm" className="bg-white text-destructive hover:text-destructive" onClick={() => { if (confirm("Dokument wirklich löschen?")) deleteMutation.mutate({ id: doc.id }); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {(!docs || docs.length === 0) && <p className="text-muted-foreground text-center py-8">Noch keine Dokumente hochgeladen.</p>}
    </div>
  );
}


function AppointmentsAdminTab() {
  const utils = trpc.useUtils();
  const { data: appointments = [], isLoading } = trpc.appointments.listAll.useQuery();
  const updateStatus = trpc.appointments.updateStatus.useMutation({
    onSuccess: () => { utils.appointments.listAll.invalidate(); toast.success("Status aktualisiert"); },
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mt-8" />;

  const appointmentTypeLabels: Record<string, string> = {
    initial_consultation: "Erstberatung",
    home_visit: "Hausbesuch",
    care_planning: "Pflegeplanung",
    follow_up: "Nachfolgetermin",
  };

  const upcomingAppointments = appointments.filter(apt => new Date(apt.preferredDate) >= new Date() && apt.status !== "cancelled");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Termine ({appointments.length})</h2>
      <Link href="/admin/appointments">
        <Button className="rounded-full">
          <Calendar className="h-4 w-4 mr-2" />
          Zur Kalenderansicht
        </Button>
      </Link>
      {upcomingAppointments.map((apt) => (
        <Card key={apt.id} className="border-border/50">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{apt.firstName} {apt.lastName}</span>
                  <Badge className={`text-xs ${statusColors[apt.status] || ""}`}>{statusLabels[apt.status] || apt.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{apt.email} {apt.phone && `· ${apt.phone}`}</div>
                <div className="text-sm text-muted-foreground mt-1">{appointmentTypeLabels[apt.appointmentType]} · {new Date(apt.preferredDate).toLocaleDateString("de-DE")}</div>
              </div>
              <Select value={apt.status} onValueChange={(v) => updateStatus.mutate({ id: apt.id, status: v as AppointmentStatus })}>
                <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["pending", "confirmed", "completed", "cancelled", "rescheduled"].map(s => (
                    <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
      {upcomingAppointments.length === 0 && <p className="text-muted-foreground text-center py-8">Keine bevorstehenden Termine.</p>}
    </div>
  );
}

function CampaignsTab() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const [templateHtml, setTemplateHtml] = useState<string>();
  const { data: campaigns = [], isLoading, refetch } = trpc.campaigns.list.useQuery();

  const sendMutation = trpc.campaigns.send.useMutation({
    onSuccess: () => {
      toast.success("Kampagne versendet");
      refetch();
    },
  });

  const deleteMutation = trpc.campaigns.delete.useMutation({
    onSuccess: () => {
      toast.success("Kampagne gelöscht");
      refetch();
    },
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Email-Kampagnen ({campaigns.length})</h2>
        <Link href="/admin/campaigns">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Zur Kampagnen-Verwaltung
          </Button>
        </Link>
      </div>

      <TemplatePreview
        selectedTemplateId={selectedTemplateId}
        onTemplateSelect={(templateId, htmlContent) => {
          setSelectedTemplateId(templateId);
          setTemplateHtml(htmlContent);
        }}
      />

      {campaigns.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Keine Kampagnen vorhanden.</p>
          </CardContent>
        </Card>
      ) : (
        campaigns.map((campaign) => (
          <Card key={campaign.id} className="border-border/50">
            <CardContent className="p-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{campaign.name}</span>
                      <Badge variant="outline" className="text-xs">{campaign.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Empfänger:</span>
                    <p className="font-semibold">{campaign.recipientCount || 0}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Versendet:</span>
                    <p className="font-semibold">{campaign.sentCount || 0}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bounces:</span>
                    <p className="font-semibold text-red-600">{campaign.bounceCount || 0}</p>
                  </div>
                </div>

                {campaign.status === "draft" && (campaign.recipientCount ?? 0) > 0 && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => sendMutation.mutate({ campaignId: campaign.id })}
                      disabled={sendMutation.isPending}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Sofort versenden
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Zeitgesteuert
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Kampagne zeitgesteuert versenden</DialogTitle>
                        </DialogHeader>
                        <ScheduleCampaignDialog campaignId={campaign.id} onSuccess={() => refetch()} />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                {campaign.status === "scheduled" && campaign.scheduledAt && (
                  <div className="text-sm text-muted-foreground">
                    <p>Geplant für: <span className="font-medium">{new Date(campaign.scheduledAt).toLocaleString('de-DE')}</span></p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}


function SettingsTab() {
  const adminToken = localStorage.getItem("adminToken");
  const adminMeQuery = trpc.adminAuth.me.useQuery(
    adminToken ? { token: adminToken } : undefined,
    { enabled: !!adminToken }
  );
  const adminUser = adminMeQuery.data;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-foreground">Admin-Einstellungen</h2>

      {/* Account Information */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Kontoinformationen</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-sm">Name</Label>
              <p className="font-medium text-foreground">{adminUser?.name || 'Nicht angegeben'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Email</Label>
              <p className="font-medium text-foreground">{adminUser?.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Rolle</Label>
              <Badge className="bg-blue-100 text-blue-700">{adminUser?.role === 'admin' ? 'Administrator' : 'Owner'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Email-Konfiguration</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Email-Versand aktiv</p>
                <p className="text-muted-foreground text-xs">Willkommens-Emails und Kampagnen werden automatisch versendet</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Tracking aktiv</p>
                <p className="text-muted-foreground text-xs">Öffnungsraten und Klicks werden automatisch gemessen</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Automationen aktiv</p>
                <p className="text-muted-foreground text-xs">Newsletter-Signup-Trigger und andere Automationen sind aktiviert</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Verfügbare Funktionen</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-foreground">Email-Kampagnenverwaltung</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-foreground">Automatische Willkommens-Emails</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-foreground">Email-Tracking & Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-foreground">Newsletter-Verwaltung</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-foreground">Bewerbungsverwaltung</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-foreground">Terminverwaltung</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-foreground">Partner-Dokumentenverwaltung</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin User Management */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Admin-Benutzer verwalten</h3>
          <AdminUsers />
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="border-border/50 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Hilfe & Support</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Für Fragen oder Probleme kontaktieren Sie bitte den Support oder lesen Sie die Dokumentation.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Dokumentation
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Support kontaktieren
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function ScheduleCampaignDialog({ campaignId, onSuccess }: { campaignId: string; onSuccess: () => void }) {
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('09:00');
  const scheduleMutation = trpc.campaigns.schedule.useMutation({
    onSuccess: () => {
      toast.success('Kampagne zeitgesteuert geplant');
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Fehler: ${error?.message || 'Unbekannter Fehler'}`);
    },
  });

  const handleSchedule = () => {
    if (!scheduledAt || !scheduledTime) {
      toast.error('Bitte wählen Sie Datum und Uhrzeit');
      return;
    }

    const [year, month, day] = scheduledAt.split('-');
    const [hours, minutes] = scheduledTime.split(':');
    const scheduledDateTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    if (scheduledDateTime <= new Date()) {
      toast.error('Bitte wählen Sie einen zukünftigen Zeitpunkt');
      return;
    }

    scheduleMutation.mutate({
      campaignId,
      scheduledAt: scheduledDateTime,
    });
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate());
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="schedule-date" className="text-sm">Datum</Label>
        <Input
          id="schedule-date"
          type="date"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          min={minDateStr}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="schedule-time" className="text-sm">Uhrzeit</Label>
        <Input
          id="schedule-time"
          type="time"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-900">
        <p className="font-medium mb-1">Hinweis:</p>
        <p>Die Kampagne wird zum geplanten Zeitpunkt automatisch versendet. Der Server muss laufen und die Scheduler-Jobs müssen aktiv sein.</p>
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setScheduledAt('');
            setScheduledTime('09:00');
          }}
          disabled={scheduleMutation.isPending}
        >
          Zurücksetzen
        </Button>
        <Button
          onClick={handleSchedule}
          disabled={scheduleMutation.isPending || !scheduledAt || !scheduledTime}
        >
          {scheduleMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Wird geplant...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              Zeitgesteuert planen
            </>
          )}
        </Button>
      </div>
    </div>
  );
}


// ─── Templates Tab ─────────────────────────────────────────────────────────

function TemplatesTab() {
  const { data: templates, isLoading } = trpc.templates.list.useQuery();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);

  const createMutation = trpc.templates.create.useMutation({
    onSuccess: () => {
      toast.success('Template erstellt');
      setShowEditor(false);
    },
  });

  const deleteMutation = trpc.templates.delete.useMutation({
    onSuccess: () => {
      toast.success('Template gelöscht');
    },
  });

  const duplicateMutation = trpc.templates.duplicate.useMutation({
    onSuccess: () => {
      toast.success('Template dupliziert');
    },
  });

  const handleCreateTemplate = () => {
    createMutation.mutate({
      name: 'Neue Vorlage',
      subject: 'Betreff',
      preheader: 'Vorschau',
      blocks: [],
      backgroundColor: '#ffffff',
      fontFamily: 'Arial',
    });
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Wirklich löschen?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleDuplicateTemplate = (id: string) => {
    duplicateMutation.mutate({ id });
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Email-Vorlagen</h3>
        <Button onClick={handleCreateTemplate} className="gap-2">
          <Plus className="h-4 w-4" />
          Neue Vorlage
        </Button>
      </div>

      {!templates || templates.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Keine Vorlagen vorhanden. Erstellen Sie eine neue Vorlage, um zu beginnen.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">{template.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{template.blocks?.length || 0} Blöcke</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowEditor(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateTemplate(template.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Reminders Tab ────────────────────────────────────────────────────────────

const reminderStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "Ausstehend",  color: "bg-blue-100 text-blue-700",   icon: <Clock className="h-3 w-3" /> },
  sent:      { label: "Gesendet",    color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="h-3 w-3" /> },
  failed:    { label: "Fehlgeschl.", color: "bg-red-100 text-red-700",     icon: <AlertTriangle className="h-3 w-3" /> },
  cancelled: { label: "Storniert",  color: "bg-gray-100 text-gray-600",   icon: <XCircle className="h-3 w-3" /> },
};

const reminderTypeLabels: Record<string, string> = {
  "24h_before": "24h vorher",
  "1h_before":  "1h vorher",
  "day_after":  "Tag danach (Feedback)",
};

const reminderApptTypeLabels: Record<string, string> = {
  initial_consultation: "Erstberatung",
  home_visit:           "Hausbesuch",
  care_planning:        "Pflegeplanung",
  follow_up:            "Folgetermin",
};

function RemindersTab() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: reminders = [], isLoading, refetch } = trpc.reminders.listAll.useQuery();
  const { data: stats, refetch: refetchStats } = trpc.reminders.stats.useQuery();

  const generateMutation = trpc.reminders.generate.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.generated} Reminder(s) generiert`);
      refetch(); refetchStats();
    },
    onError: () => toast.error("Fehler beim Generieren"),
  });

  const sendPendingMutation = trpc.reminders.sendPending.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.sent} gesendet, ${data.failed} fehlgeschlagen`);
      refetch(); refetchStats();
    },
    onError: () => toast.error("Fehler beim Senden"),
  });

  const cancelMutation = trpc.reminders.cancel.useMutation({
    onSuccess: () => { toast.success("Reminder storniert"); refetch(); refetchStats(); },
    onError: () => toast.error("Fehler beim Stornieren"),
  });

  const filtered = reminders.filter((r) => {
    const statusOk = statusFilter === "all" || r.status === statusFilter;
    const typeOk   = typeFilter   === "all" || r.reminderType === typeFilter;
    return statusOk && typeOk;
  });

  const fmtDate = (d: Date | string | null) =>
    d ? format(new Date(d), "dd.MM.yyyy HH:mm", { locale: de }) : "–";

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reminder Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
            {generateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Generieren
          </Button>
          <Button size="sm" onClick={() => sendPendingMutation.mutate()} disabled={sendPendingMutation.isPending} className="bg-primary text-white">
            {sendPendingMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
            Ausstehende senden
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Gesamt",      value: stats?.total   ?? 0, color: "text-foreground" },
          { label: "Ausstehend",  value: stats?.pending ?? 0, color: "text-blue-600"  },
          { label: "Gesendet",    value: stats?.sent    ?? 0, color: "text-green-600" },
          { label: "Fehlgeschl.", value: stats?.failed  ?? 0, color: "text-red-600"   },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-5">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="pending">Ausstehend</SelectItem>
            <SelectItem value="sent">Gesendet</SelectItem>
            <SelectItem value="failed">Fehlgeschlagen</SelectItem>
            <SelectItem value="cancelled">Storniert</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Typ" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Typen</SelectItem>
            <SelectItem value="24h_before">24h vorher</SelectItem>
            <SelectItem value="1h_before">1h vorher</SelectItem>
            <SelectItem value="day_after">Tag danach (Feedback)</SelectItem>
          </SelectContent>
        </Select>
        {(statusFilter !== "all" || typeFilter !== "all") && (
          <Button variant="ghost" size="sm" onClick={() => { setStatusFilter("all"); setTypeFilter("all"); }}>
            Filter zurücksetzen
          </Button>
        )}
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => { refetch(); refetchStats(); }}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>Keine Reminder gefunden</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Patient</TableHead>
                    <TableHead>Terminart</TableHead>
                    <TableHead>Reminder-Typ</TableHead>
                    <TableHead>Geplant für</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gesendet am</TableHead>
                    <TableHead className="text-right">Aktion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const sc = reminderStatusConfig[r.status] ?? reminderStatusConfig.pending;
                    return (
                      <TableRow key={r.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="font-medium text-sm">{r.patientFirstName} {r.patientLastName}</div>
                          <div className="text-xs text-muted-foreground">{r.patientEmail}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {reminderApptTypeLabels[r.appointmentType ?? ""] ?? r.appointmentType ?? "–"}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {reminderTypeLabels[r.reminderType] ?? r.reminderType}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{fmtDate(r.scheduledAt)}</TableCell>
                        <TableCell>
                          <Badge className={`${sc.color} gap-1 text-xs`}>
                            {sc.icon}{sc.label}
                          </Badge>
                          {r.failureReason && (
                            <div className="text-xs text-red-500 mt-1">{r.failureReason}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{fmtDate(r.sentAt)}</TableCell>
                        <TableCell className="text-right">
                          {r.status === "pending" && (
                            <Button
                              variant="outline" size="sm"
                              onClick={() => cancelMutation.mutate({ reminderId: r.id })}
                              disabled={cancelMutation.isPending}
                              className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                            >
                              Stornieren
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
