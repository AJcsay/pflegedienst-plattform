import { useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { de } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar.css";

const locales = {
  "de": de,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
} as any);

interface AppointmentEvent {
  id?: string | number;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    appointmentType: string;
    status: string;
    careNeeds?: string;
  };
}

interface AppointmentCalendarProps {
  appointments: any[];
  onSelectEvent?: (event: AppointmentEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
}

export function AppointmentCalendar({
  appointments,
  onSelectEvent,
  onSelectSlot,
}: AppointmentCalendarProps) {
  const events: AppointmentEvent[] = useMemo(() => {
    return appointments.map((apt) => {
      const startDate = new Date(apt.preferredDate);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);

      return {
        id: apt.id,
        title: `${apt.firstName} ${apt.lastName} - ${getAppointmentTypeLabel(apt.appointmentType)}`,
        start: startDate,
        end: endDate,
        resource: {
          firstName: apt.firstName,
          lastName: apt.lastName,
          email: apt.email,
          phone: apt.phone,
          appointmentType: apt.appointmentType,
          status: apt.status,
          careNeeds: apt.careNeeds,
        },
      };
    });
  }, [appointments]);

  const eventStyleGetter = (event: AppointmentEvent) => {
    let backgroundColor = "#3b82f6"; // blue for pending
    
    if (event.resource?.status === "confirmed") {
      backgroundColor = "#10b981"; // green for confirmed
    } else if (event.resource?.status === "completed") {
      backgroundColor = "#8b5cf6"; // purple for completed
    } else if (event.resource?.status === "cancelled") {
      backgroundColor = "#ef4444"; // red for cancelled
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <div className="bg-white rounded-lg border border-border/50 overflow-hidden">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        popup
        eventPropGetter={eventStyleGetter}
        messages={{
          today: "Heute",
          previous: "Zurück",
          next: "Weiter",
          month: "Monat",
          week: "Woche",
          day: "Tag",
          agenda: "Agenda",
          date: "Datum",
          time: "Zeit",
          event: "Termin",
          allDay: "Ganztägig",
          noEventsInRange: "Keine Termine in diesem Zeitraum",
        }}
      />
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
