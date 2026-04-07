export interface AgendaEventData {
  title: string;
  startDate: string;
  endDate?: string;
  parentId?: string;
  location?: string;
  summary?: string;
  badge?: string;
  allDay?: boolean;
  published?: boolean;
  recurrence?: {
    frequency: "weekly" | "monthlyNth";
    until: string;
    interval?: number;
    nth?: number;
    months?: number[];
    overrides?: {
      originalDate: string;
      startDate: string;
      endDate?: string;
    }[];
  };
}

export interface AgendaEventEntry {
  id: string;
  sourceId: string;
  parentSourceId?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  summary?: string;
  badge?: string;
  allDay: boolean;
  googleCalendarUrl: string;
  monthIndex: number;
  dayLabel: string;
  timeLabel: string;
  Content: any;
}

export interface AgendaEventGroup extends AgendaEventEntry {
  subEvents: AgendaEventEntry[];
  highlightBadge?: string;
}

export interface AgendaCalendarDay {
  key: string;
  dayNumber: number | null;
  isCurrentMonth: boolean;
  events: AgendaEventGroup[];
}

export interface AgendaCalendarMonth {
  label: string;
  monthIndex: number;
  year: number;
  events: AgendaEventGroup[];
  days: AgendaCalendarDay[];
}

export interface AgendaPageData {
  months: AgendaCalendarMonth[];
  currentMonthIndex: number;
  eventGroups: AgendaEventGroup[];
}
