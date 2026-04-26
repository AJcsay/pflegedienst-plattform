import { useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCalendar } from "@/components/AppointmentCalendar";
import { Calendar, Clock, User, Mail, Phone, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function AdminAppointments() {
  const { data: user } = trpc.auth.me.useQuery();
  const [, setLocation] = useLocation();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const { data: appointments = [], isLoading, refetch } = trpc.appointments.listAll.useQuery();
  const updateStatus = trpc.appointments.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
      setSelectedAppointment(null);
    },
  });

  const handleSelectEvent = (event: any) => {
    setSelectedAppointment(event.resource);
    setNewStatus(event.resource.status);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = () => {
    if (selectedAppointment && newStatus) {
      updateStatus.mutate({
        id: selectedAppointment.id,
        status: newStatus as any,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { label: "Ausstehend", color: "bg-blue-100 text-blue-800" },
      confirmed: { label: "Bestätigt", color: "bg-green-100 text-green-800" },
      completed: { label: "Abgeschlossen", color: "bg-purple-100 text-purple-800" },
      cancelled: { label: "Storniert", color: "bg-red-100 text-red-800" },
      rescheduled: { label: "Verschoben", color: "bg-yellow-100 text-yellow-800" },
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.preferredDate) >= new Date() && apt.status !== "cancelled"
  );

  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.preferredDate) < new Date()
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terminverwaltung</h1>
          <p className="text-muted-foreground">Verwalten Sie alle gebuchten Termine mit Kalenderansicht</p>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Kalender</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Bevorstehend</span>
              <Badge variant="secondary" className="ml-1">{upcomingAppointments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Abgeschlossen</span>
              <Badge variant="secondary" className="ml-1">{pastAppointments.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            {isLoading ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">Laden...</CardContent></Card>
            ) : (
              <AppointmentCalendar appointments={appointments} onSelectEvent={handleSelectEvent} />
            )}
          </TabsContent>

          {/* Upcoming Appointments */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">Keine bevorstehenden Termine</CardContent></Card>
            ) : (
              upcomingAppointments.map((apt) => (
                <Card key={apt.id} className="border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => handleSelectEvent({ resource: apt })}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {apt.firstName} {apt.lastName}
                          </h3>
                          {getStatusBadge(apt.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(apt.preferredDate), "dd. MMMM yyyy", { locale: de })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {apt.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {apt.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {getAppointmentTypeLabel(apt.appointmentType)}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleSelectEvent({ resource: apt })}>
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Past Appointments */}
          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">Keine abgeschlossenen Termine</CardContent></Card>
            ) : (
              pastAppointments.map((apt) => (
                <Card key={apt.id} className="border-border/50 opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {apt.firstName} {apt.lastName}
                          </h3>
                          {getStatusBadge(apt.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(apt.preferredDate), "dd. MMMM yyyy", { locale: de })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {apt.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Appointment Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Termindetails</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Name</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAppointment.firstName} {selectedAppointment.lastName}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Kontakt</h3>
                <p className="text-sm text-muted-foreground">{selectedAppointment.email}</p>
                <p className="text-sm text-muted-foreground">{selectedAppointment.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Termintyp</h3>
                <p className="text-sm text-muted-foreground">
                  {getAppointmentTypeLabel(selectedAppointment.appointmentType)}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Status</h3>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="confirmed">Bestätigt</SelectItem>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                    <SelectItem value="cancelled">Storniert</SelectItem>
                    <SelectItem value="rescheduled">Verschoben</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleStatusUpdate} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? "Wird aktualisiert..." : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getAppointmentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    initial_consultation: "Erstberatung",
    home_visit: "Hausbesuch",
    care_planning: "Pflegeplanung",
    follow_up: "Nachfolgetermin",
  };
  return labels[type] || type;
}
