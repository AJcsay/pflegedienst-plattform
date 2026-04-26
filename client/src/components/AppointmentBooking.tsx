import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AppointmentBookingProps {
  appointmentType?: "initial_consultation" | "home_visit" | "care_planning" | "follow_up";
  onSuccess?: () => void;
}

export function AppointmentBooking({ appointmentType = "initial_consultation", onSuccess }: AppointmentBookingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    appointmentType,
    preferredDate: "",
    preferredTime: "",
    careGrade: "",
    careNeeds: "",
    notes: "",
  });

  const bookAppointment = trpc.appointments.book.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.preferredDate) {
        toast.error("Bitte füllen Sie alle erforderlichen Felder aus");
        setIsSubmitting(false);
        return;
      }

      // Convert date string to Date object
      const preferredDate = new Date(formData.preferredDate);
      if (isNaN(preferredDate.getTime())) {
        toast.error("Ungültiges Datum");
        setIsSubmitting(false);
        return;
      }

      await bookAppointment.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        appointmentType: formData.appointmentType as any,
        preferredDate,
        preferredTime: formData.preferredTime || undefined,
        careGrade: formData.careGrade || undefined,
        careNeeds: formData.careNeeds || undefined,
        notes: formData.notes || undefined,
      });

      // Track event for Google Analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "appointment_booking", {
          appointment_type: formData.appointmentType,
          user_email: formData.email,
        });
      }

      setIsSuccess(true);
      toast.success("Termin erfolgreich gebucht! Wir werden Sie in Kürze kontaktieren.");
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          appointmentType,
          preferredDate: "",
          preferredTime: "",
          careGrade: "",
          careNeeds: "",
          notes: "",
        });
        setIsSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error("Appointment booking error:", error);
      toast.error("Fehler bei der Terminbuchung. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 rounded-xl bg-green-50 border border-green-200 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-900 mb-2">Termin erfolgreich gebucht!</h3>
        <p className="text-green-700">Wir werden Sie in Kürze unter der angegebenen Telefonnummer kontaktieren.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium">
            Vorname *
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Max"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-sm font-medium">
            Nachname *
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Mustermann"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            E-Mail *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="max@example.com"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-medium">
            Telefon *
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+49 69 123 456"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Appointment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="appointmentType" className="text-sm font-medium">
            Termintyp
          </Label>
          <Select value={formData.appointmentType} onValueChange={(value) => handleSelectChange("appointmentType", value)}>
            <SelectTrigger id="appointmentType" disabled={isSubmitting}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="initial_consultation">Erstberatung</SelectItem>
              <SelectItem value="home_visit">Hausbesuch</SelectItem>
              <SelectItem value="care_planning">Pflegeplanung</SelectItem>
              <SelectItem value="follow_up">Nachfolgetermin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="preferredDate" className="text-sm font-medium">
            Bevorzugtes Datum *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="preferredDate"
              name="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={handleInputChange}
              className="pl-10"
              required
              disabled={isSubmitting}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="preferredTime" className="text-sm font-medium">
            Bevorzugte Uhrzeit
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="preferredTime"
              name="preferredTime"
              type="time"
              value={formData.preferredTime}
              onChange={handleInputChange}
              className="pl-10"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="careGrade" className="text-sm font-medium">
            Pflegegrad (falls bekannt)
          </Label>
          <Select value={formData.careGrade} onValueChange={(value) => handleSelectChange("careGrade", value)}>
            <SelectTrigger id="careGrade" disabled={isSubmitting}>
              <SelectValue placeholder="Wählen Sie einen Pflegegrad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Pflegegrad 1</SelectItem>
              <SelectItem value="2">Pflegegrad 2</SelectItem>
              <SelectItem value="3">Pflegegrad 3</SelectItem>
              <SelectItem value="4">Pflegegrad 4</SelectItem>
              <SelectItem value="5">Pflegegrad 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Care Needs */}
      <div>
        <Label htmlFor="careNeeds" className="text-sm font-medium">
          Pflegebedarf (kurze Beschreibung)
        </Label>
        <Textarea
          id="careNeeds"
          name="careNeeds"
          value={formData.careNeeds}
          onChange={handleInputChange}
          placeholder="Beschreiben Sie kurz Ihren Pflegebedarf..."
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {/* Additional Notes */}
      <div>
        <Label htmlFor="notes" className="text-sm font-medium">
          Zusätzliche Anmerkungen
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Haben Sie spezielle Wünsche oder Anforderungen?"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Nach Ihrer Anmeldung werden wir Sie kontaktieren, um den Termin zu bestätigen und offene Fragen zu klären.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full py-6 text-base font-semibold"
      >
        {isSubmitting ? "Wird gebucht..." : "Termin buchen"}
      </Button>
    </form>
  );
}
