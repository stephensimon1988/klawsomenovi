import type { StoreHour } from '@/hooks/useCmsContent';

// Sunday=0..Saturday=6
const DAY_ORDER = [0, 1, 2, 3, 4, 5, 6];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface HoursSummary {
  dayRange: string; // e.g. "Tuesday–Sunday" or "Tuesday, Thursday–Sunday"
  timeRange: string; // e.g. "11:00 AM to 9:00 PM"
  closedDays: string; // e.g. "Closed Mondays" or ""
  full: string; // e.g. "Open Tuesday–Sunday, 11:00 AM to 9:00 PM. Closed Mondays."
  hasData: boolean;
}

function pluralClosed(labels: string[]): string {
  if (labels.length === 0) return '';
  if (labels.length === 1) return `Closed ${labels[0]}s`;
  if (labels.length === 2) return `Closed ${labels[0]}s and ${labels[1]}s`;
  return `Closed ${labels.slice(0, -1).map((d) => `${d}s`).join(', ')}, and ${labels[labels.length - 1]}s`;
}

function formatDayRanges(sortedOpen: StoreHour[]): string {
  if (sortedOpen.length === 0) return '';
  // Group consecutive days into ranges (by day_of_week)
  const days = sortedOpen.map((h) => h.day_of_week).sort((a, b) => a - b);
  const groups: number[][] = [];
  let curr: number[] = [days[0]];
  for (let i = 1; i < days.length; i++) {
    if (days[i] === curr[curr.length - 1] + 1) curr.push(days[i]);
    else { groups.push(curr); curr = [days[i]]; }
  }
  groups.push(curr);
  const labelFor = (d: number) => sortedOpen.find((h) => h.day_of_week === d)?.day_label || DAY_SHORT[d];
  return groups
    .map((g) => (g.length === 1 ? labelFor(g[0]) : `${labelFor(g[0])}–${labelFor(g[g.length - 1])}`))
    .join(', ');
}

export function formatHoursSummary(hours: StoreHour[] | undefined | null): HoursSummary {
  const rows = (hours || []).slice();
  if (rows.length === 0) {
    return { dayRange: '', timeRange: '', closedDays: '', full: '', hasData: false };
  }
  const open = rows
    .filter((h) => !h.is_closed)
    .sort((a, b) => a.day_of_week - b.day_of_week);
  const closed = rows
    .filter((h) => h.is_closed)
    .sort((a, b) => a.day_of_week - b.day_of_week);

  const dayRange = open.length === 7 ? 'Everyday' : formatDayRanges(open);
  const firstOpen = open[0];
  const timeRange = firstOpen ? `${firstOpen.open_time} to ${firstOpen.close_time}` : '';
  const closedDays = pluralClosed(closed.map((h) => h.day_label));

  const parts: string[] = [];
  if (dayRange && timeRange) parts.push(`Open ${dayRange}, ${timeRange}.`);
  else if (timeRange) parts.push(`Open ${timeRange}.`);
  if (closedDays) parts.push(`${closedDays}.`);
  const full = parts.join(' ');

  return { dayRange, timeRange, closedDays, full, hasData: true };
}

// Suppress unused-import warning for DAY_ORDER (kept for reference).
void DAY_ORDER;