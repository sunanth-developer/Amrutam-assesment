import {
  formatSlotDayLabel,
  getAvailableDates,
  getSlotsForDate,
  groupSlotsByDate,
} from '../utils/slots';
import type { TimeSlot } from '../types';

const slots: TimeSlot[] = [
  { id: '1', doctorId: 'd1', date: '2026-07-05', startTime: '14:00', endTime: '15:00', isAvailable: true, isExpired: false },
  { id: '2', doctorId: 'd1', date: '2026-07-04', startTime: '09:00', endTime: '10:00', isAvailable: true, isExpired: false },
  { id: '3', doctorId: 'd1', date: '2026-07-04', startTime: '11:00', endTime: '12:00', isAvailable: true, isExpired: false },
];

describe('slot utils', () => {
  it('groups slots by date', () => {
    const grouped = groupSlotsByDate(slots);
    expect(Object.keys(grouped).sort()).toEqual(['2026-07-04', '2026-07-05']);
    expect(grouped['2026-07-04']).toHaveLength(2);
  });

  it('returns sorted available dates', () => {
    expect(getAvailableDates(slots)).toEqual(['2026-07-04', '2026-07-05']);
  });

  it('filters slots for a specific date', () => {
    const result = getSlotsForDate(slots, '2026-07-04');
    expect(result).toHaveLength(2);
    expect(result[0].startTime).toBe('09:00');
  });

  it('formats day labels', () => {
    const result = formatSlotDayLabel('2026-07-04');
    expect(result.weekday).toBeTruthy();
    expect(result.day).toBeTruthy();
  });
});
