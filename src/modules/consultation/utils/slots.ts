import type { TimeSlot } from '../types';

export function groupSlotsByDate(slots: TimeSlot[]): Record<string, TimeSlot[]> {
  const grouped: Record<string, TimeSlot[]> = {};
  for (const slot of slots) {
    if (!grouped[slot.date]) grouped[slot.date] = [];
    grouped[slot.date].push(slot);
  }
  for (const date of Object.keys(grouped)) {
    grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
  return grouped;
}

export function getAvailableDates(slots: TimeSlot[]): string[] {
  return [...new Set(slots.map((s) => s.date))].sort();
}

export function getSlotsForDate(slots: TimeSlot[], date: string): TimeSlot[] {
  return slots.filter((s) => s.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function formatSlotDayLabel(dateStr: string): { weekday: string; day: string; label: string } {
  const date = new Date(`${dateStr}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const slotDay = new Date(date);
  slotDay.setHours(12, 0, 0, 0);

  const weekday = date.toLocaleDateString('en-IN', { weekday: 'short' });
  const day = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  let label = weekday;
  if (slotDay.getTime() === today.getTime()) label = 'Today';
  else if (slotDay.getTime() === tomorrow.getTime()) label = 'Tomorrow';

  return { weekday, day, label };
}
