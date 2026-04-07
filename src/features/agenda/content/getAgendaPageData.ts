import { getCollection, render } from "astro:content";
import type {
  AgendaCalendarMonth,
  AgendaEventData,
  AgendaEventEntry,
  AgendaEventGroup,
  AgendaPageData
} from "../types";

const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long" });
const dayFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" });
const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo"
});
const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  timeZone: "America/Sao_Paulo"
});

function toGoogleDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function toAllDayGoogleDate(date: Date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function toDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function buildGoogleCalendarUrl(event: {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  summary?: string;
  allDay: boolean;
}) {
  const details = event.summary ?? "Evento da 5IEQ Vila Arlindo";
  const dates = event.allDay
    ? `${toAllDayGoogleDate(event.startDate)}/${toAllDayGoogleDate(event.endDate)}`
    : `${toGoogleDate(event.startDate)}/${toGoogleDate(event.endDate)}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details
  });

  if (event.location) {
    params.set("location", event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function cloneDate(date: Date) {
  return new Date(date.getTime());
}

function addDays(date: Date, days: number) {
  const value = cloneDate(date);
  value.setDate(value.getDate() + days);
  return value;
}

function addMonths(date: Date, months: number) {
  const value = cloneDate(date);
  value.setMonth(value.getMonth() + months);
  return value;
}

function getNthWeekdayDate(year: number, month: number, weekday: number, nth: number) {
  const firstDay = new Date(year, month, 1);
  const offset = (weekday - firstDay.getDay() + 7) % 7;
  const dayOfMonth = 1 + offset + (nth - 1) * 7;
  const candidate = new Date(year, month, dayOfMonth);

  return candidate.getMonth() === month ? candidate : null;
}

function mergeDateAndTime(date: Date, timeSource: Date) {
  const value = cloneDate(date);
  value.setHours(
    timeSource.getHours(),
    timeSource.getMinutes(),
    timeSource.getSeconds(),
    timeSource.getMilliseconds()
  );
  return value;
}

function buildOccurrence(startDate: Date, durationMs: number, allDay: boolean, endDate?: Date) {
  return {
    startDate,
    endDate: endDate ?? new Date(startDate.getTime() + durationMs),
    allDay
  };
}

function expandOccurrences(data: AgendaEventData) {
  const startDate = new Date(data.startDate);
  const allDay = data.allDay ?? false;
  const fallbackEndDate = allDay
    ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
    : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  const baseEndDate = data.endDate ? new Date(data.endDate) : fallbackEndDate;
  const durationMs = baseEndDate.getTime() - startDate.getTime();

  if (!data.recurrence) {
    return [buildOccurrence(startDate, durationMs, allDay)];
  }

  const until = new Date(data.recurrence.until);
  const interval = data.recurrence.interval ?? 1;
  const allowedMonths = data.recurrence.months ? new Set(data.recurrence.months) : null;
  const overrides = data.recurrence.overrides ?? [];
  const overridesByOriginalDate = new Map(
    overrides.map((override) => [new Date(override.originalDate).getTime(), override])
  );

  if (data.recurrence.frequency === "weekly") {
    const occurrences = [];
    let current = cloneDate(startDate);

    while (current <= until) {
      const currentStart = cloneDate(current);
      const override = overridesByOriginalDate.get(currentStart.getTime());

      if (override) {
        const overrideStart = new Date(override.startDate);
        const overrideEnd = override.endDate
          ? new Date(override.endDate)
          : new Date(overrideStart.getTime() + durationMs);
        occurrences.push(buildOccurrence(overrideStart, durationMs, allDay, overrideEnd));
      } else if (!allowedMonths || allowedMonths.has(currentStart.getMonth() + 1)) {
        occurrences.push(buildOccurrence(currentStart, durationMs, allDay));
      }

      current = addDays(current, interval * 7);
    }

    return occurrences;
  }

  const nth = data.recurrence.nth ?? 1;
  const weekday = startDate.getDay();
  const occurrences = [];
  let monthCursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  while (monthCursor <= until) {
    const occurrenceDate = getNthWeekdayDate(
      monthCursor.getFullYear(),
      monthCursor.getMonth(),
      weekday,
      nth
    );

    if (occurrenceDate) {
      const occurrenceStart = mergeDateAndTime(occurrenceDate, startDate);
      const override = overridesByOriginalDate.get(occurrenceStart.getTime());

      if (override) {
        const overrideStart = new Date(override.startDate);
        const overrideEnd = override.endDate
          ? new Date(override.endDate)
          : new Date(overrideStart.getTime() + durationMs);
        occurrences.push(buildOccurrence(overrideStart, durationMs, allDay, overrideEnd));
      } else if (
        occurrenceStart >= startDate &&
        occurrenceStart <= until &&
        (!allowedMonths || allowedMonths.has(occurrenceStart.getMonth() + 1))
      ) {
        occurrences.push(buildOccurrence(occurrenceStart, durationMs, allDay));
      }
    }

    monthCursor = addMonths(monthCursor, interval);
  }

  return occurrences;
}

function buildCalendarDays(year: number, monthIndex: number, monthEvents: AgendaEventGroup[]) {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const gridStart = new Date(year, monthIndex, 1 - firstDayOfMonth.getDay());
  const eventsByDay = new Map<string, AgendaEventGroup[]>();

  monthEvents.forEach((event) => {
    const key = toDateKey(event.startDate);
    const current = eventsByDay.get(key) ?? [];
    current.push(event);
    eventsByDay.set(key, current);
  });

  return Array.from({ length: 42 }, (_, offset) => {
    const currentDate = addDays(gridStart, offset);
    const key = toDateKey(currentDate);

    return {
      key,
      dayNumber: currentDate.getDate(),
      isCurrentMonth: currentDate.getMonth() === monthIndex,
      events: eventsByDay.get(key) ?? []
    };
  });
}

export async function getAgendaPageData(): Promise<AgendaPageData> {
  const calendarYear = new Date().getFullYear();
  const monthLabels = Array.from({ length: 12 }, (_, index) =>
    monthFormatter
      .format(new Date(calendarYear, index, 1))
      .replace(/^\w/, (letter) => letter.toUpperCase())
  );

  const collectionEntries = await getCollection("cronograma");
  const rawEntries = await Promise.all(
    collectionEntries.map(async (entry) => {
      const { Content } = await render(entry);

      return {
        id: entry.id,
        data: entry.data as AgendaEventData,
        Content
      };
    })
  );

  const events: AgendaEventEntry[] = rawEntries
    .filter((entry) => entry.data.published !== false)
    .flatMap((entry) =>
      expandOccurrences(entry.data).map((occurrence, index) => {
        const startDate = occurrence.startDate;
        const endDate = occurrence.endDate;
        const allDay = occurrence.allDay;

        return {
          id: `${entry.id}-${index + 1}`,
          sourceId: entry.id,
          parentSourceId: entry.data.parentId,
          title: entry.data.title,
          startDate,
          endDate,
          location: entry.data.location,
          summary: entry.data.summary,
          badge: entry.data.badge,
          allDay,
          googleCalendarUrl: buildGoogleCalendarUrl({
            title: entry.data.title,
            startDate,
            endDate,
            location: entry.data.location,
            summary: entry.data.summary,
            allDay
          }),
          monthIndex: startDate.getMonth(),
          dayLabel: `${dayFormatter.format(startDate)} · ${weekdayFormatter.format(startDate)}`,
          timeLabel: allDay
            ? "Dia todo"
            : `${timeFormatter.format(startDate)} às ${timeFormatter.format(endDate)}`,
          Content: entry.Content
        };
      })
    )
    .sort((left, right) => left.startDate.getTime() - right.startDate.getTime());

  const eventGroupsMap = new Map<string, AgendaEventGroup>();

  for (const event of events) {
    if (event.parentSourceId) continue;
    eventGroupsMap.set(event.id, { ...event, subEvents: [] });
  }

  for (const event of events) {
    if (!event.parentSourceId) continue;

    const parentGroup = Array.from(eventGroupsMap.values()).find(
      (candidate) =>
        candidate.sourceId === event.parentSourceId &&
        toDateKey(candidate.startDate) === toDateKey(event.startDate)
    );

    if (parentGroup) {
      parentGroup.subEvents.push(event);
      continue;
    }

    eventGroupsMap.set(event.id, { ...event, subEvents: [] });
  }

  for (const group of eventGroupsMap.values()) {
    const badgedSub = group.subEvents.find((sub) => sub.badge);
    if (badgedSub) group.highlightBadge = badgedSub.badge;

    if (group.title === "Culto da Família" && group.highlightBadge === "Santa Ceia") {
      group.googleCalendarUrl = buildGoogleCalendarUrl({
        title: "Culto de Santa Ceia",
        startDate: group.startDate,
        endDate: group.endDate,
        location: group.location,
        summary: group.summary,
        allDay: group.allDay
      });
    }
  }

  const eventGroups = Array.from(eventGroupsMap.values()).sort(
    (left, right) => left.startDate.getTime() - right.startDate.getTime()
  );

  const months: AgendaCalendarMonth[] = monthLabels.map((label, monthIndex) => {
    const monthEvents = eventGroups.filter(
      (event) =>
        event.startDate.getFullYear() === calendarYear && event.monthIndex === monthIndex
    );

    return {
      label,
      monthIndex,
      year: calendarYear,
      events: monthEvents,
      days: buildCalendarDays(calendarYear, monthIndex, monthEvents)
    };
  });

  return {
    months,
    currentMonthIndex: new Date().getMonth(),
    eventGroups
  };
}
