import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Bell, Send, RefreshCw, XCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { toast } from "sonner";
import { useLocation } from "wouter";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "Ausstehend",  color: "bg-blue-100 text-blue-700",   icon: <Clock className="h-3 w-3" /> },
  sent:      { label: "Gesendet",    color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="h-3 w-3" /> },
  failed:    { label: "Fehlgeschl.", color: "bg-red-100 text-red-700",     icon: <AlertTriangle className="h-3 w-3" /> },
  cancelled: { label: "Storniert",  color: "bg-gray-100 text-gray-600",   icon: <XCircle className="h-3 w-3" /> },
};

const typeLabels: Record<string, string> = {
  "24h_before": "24h vorher",
  "1h_before":  "1h vorher",
  "day_after":  "Tag danach (Feedback)",
};

const appointmentTypeLabels: Record<string, string> = {
  initial_consultation: "Erstberatung",
  home_visit:           "Hausbesuch",
  care_planning:        "Pflegeplanung",
  follow_up:            "Folgetermin",
};

export default function AdminReminders() {
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Auth check
  const { data: user } = trpc.auth.me.useQuery();
  const adminToken = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  const adminMeQuery = trpc.adminAuth.me.useQuery(
    adminToken ? { token: adminToken } : undefined,
    { enabled: !!adminToken }
  );
  const isAuthenticated = adminMeQuery.data || (user && user.role === "admin");

  // Data
  const { data: reminders = [], isLoading, refetch } = trpc.reminders.listAll.useQuery();
  const { data: stats, refetch: refetchStats } = trpc.reminders.stats.useQuery();

  const generateMutation = trpc.reminders.generate.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.generated} Reminder(s) generiert`);
      refetch();
      refetchStats();
    },
    onError: () => toast.error("Fehler beim Generieren"),
  });

  const sendPendingMutation = trpc.reminders.sendPending.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.sent} gesendet, ${data.failed} fehlgeschlagen`);
      refetch();
      refetchStats();
    },
    onError: () => toast.error("Fehler beim Senden"),
  });

  const cancelMutation = trpc.reminders.cancel.useMutation({
    onSuccess: () => {
      toast.success("Reminder storniert");
      refetch();
      refetchStats();
    },
    onError: () => toast.error("Fehler beim Stornieren"),
  });

  if (!isAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  // Filter
  const filtered = reminders.filter((r) => {
    const statusOk = statusFilter === "all" || r.status === statusFilter;
    const typeOk   = typeFilter === "all"   || r.reminderType === typeFilter;
    return statusOk && typeOk;
  });

  const formatDate = (d: Date | string | null) => {
    if (!d) return "–";
    return format(new Date(d), "dd.MM.yyyy HH:mm", { locale: de });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b border-border/50 sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              ← Zurück zum Dashboard
            </button>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Reminder Management</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
              Generieren
            </Button>
            <Button
              size="sm"
              onClick={() => sendPendingMutation.mutate()}
              disabled={sendPendingMutation.isPending}
              className="bg-primary text-white"
            >
              {sendPendingMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
              Ausstehende senden
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-6">
        <h1 className="text-2xl font-bold">Reminder Management</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Gesamt",       value: stats?.total     ?? 0, color: "text-foreground" },
            { label: "Ausstehend",   value: stats?.pending   ?? 0, color: "text-blue-600"  },
            { label: "Gesendet",     value: stats?.sent      ?? 0, color: "text-green-600" },
            { label: "Fehlgeschl.",  value: stats?.failed    ?? 0, color: "text-red-600"   },
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
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filter</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="sent">Gesendet</SelectItem>
                <SelectItem value="failed">Fehlgeschlagen</SelectItem>
                <SelectItem value="cancelled">Storniert</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Typ" />
              </SelectTrigger>
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
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Reminder ({filtered.length}{filtered.length !== reminders.length ? ` von ${reminders.length}` : ""})
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => { refetch(); refetchStats(); }}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
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
                      const sc = statusConfig[r.status] ?? statusConfig.pending;
                      return (
                        <TableRow key={r.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div className="font-medium text-sm">
                              {r.patientFirstName} {r.patientLastName}
                            </div>
                            <div className="text-xs text-muted-foreground">{r.patientEmail}</div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {appointmentTypeLabels[r.appointmentType ?? ""] ?? r.appointmentType ?? "–"}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">
                              {typeLabels[r.reminderType] ?? r.reminderType}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(r.scheduledAt)}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${sc.color} gap-1 text-xs`}>
                              {sc.icon}
                              {sc.label}
                            </Badge>
                            {r.failureReason && (
                              <div className="text-xs text-red-500 mt-1">{r.failureReason}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(r.sentAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            {r.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
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
    </div>
  );
}
