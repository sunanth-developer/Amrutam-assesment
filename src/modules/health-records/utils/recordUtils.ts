import type { HealthRecord, TimelineSection } from '../types';

export function groupRecordsByMonthYear(records: HealthRecord[]): TimelineSection[] {
  const groups = new Map<string, HealthRecord[]>();

  for (const record of records) {
    const date = new Date(record.date);
    const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(record);
  }

  return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
}

export function getRecordTypeLabel(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
