declare module 'react-big-calendar' {
  import { ReactNode } from 'react';

  export interface Event {
    id?: string | number;
    title: string;
    start: Date;
    end: Date;
    resource?: any;
  }

  export interface SlotInfo {
    start: Date;
    end: Date;
    action: 'select' | 'click' | 'doubleClick';
  }

  export interface CalendarProps {
    localizer: any;
    events: Event[];
    startAccessor?: string | ((event: Event) => Date);
    endAccessor?: string | ((event: Event) => Date);
    style?: React.CSSProperties;
    onSelectEvent?: (event: Event) => void;
    onSelectSlot?: (slotInfo: SlotInfo) => void;
    selectable?: boolean;
    popup?: boolean;
    eventPropGetter?: (event: Event) => any;
    messages?: Record<string, string>;
    defaultView?: 'month' | 'week' | 'day' | 'agenda';
    views?: Array<'month' | 'week' | 'day' | 'agenda'>;
    toolbar?: boolean;
  }

  export const Calendar: React.FC<CalendarProps>;

  export function dateFnsLocalizer(options: {
    format: any;
    parse: any;
    startOfWeek: any;
    getDay: any;
    locales: Record<string, any>;
  }): any;
}
