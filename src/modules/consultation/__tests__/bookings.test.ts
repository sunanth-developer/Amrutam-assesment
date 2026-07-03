import { filterAvailableSlots, getActiveBookedSlotIds } from '../utils/bookings';
import type { Booking, TimeSlot } from '../types';

describe('booking slot filters', () => {
  const slot = (id: string, available = true): TimeSlot => ({
    id,
    doctorId: 'doc-1',
    date: '2026-07-10',
    startTime: '10:00',
    endTime: '11:00',
    isAvailable: available,
    isExpired: false,
  });

  it('excludes booked slots from the list', () => {
    const bookings: Booking[] = [
      {
        id: 'b1',
        doctorId: 'doc-1',
        doctorName: 'Dr. A',
        slotId: 'slot-a',
        date: '2026-07-10',
        startTime: '10:00',
        endTime: '11:00',
        status: 'confirmed',
        createdAt: '2026-07-01T00:00:00.000Z',
      },
    ];

    const result = filterAvailableSlots([slot('slot-a'), slot('slot-b')], bookings);
    expect(result.map((s) => s.id)).toEqual(['slot-b']);
  });

  it('includes slots again after cancellation', () => {
    const bookings: Booking[] = [
      {
        id: 'b1',
        doctorId: 'doc-1',
        doctorName: 'Dr. A',
        slotId: 'slot-a',
        date: '2026-07-10',
        startTime: '10:00',
        endTime: '11:00',
        status: 'cancelled',
        createdAt: '2026-07-01T00:00:00.000Z',
      },
    ];

    const result = filterAvailableSlots([slot('slot-a')], bookings);
    expect(result).toHaveLength(1);
    expect(getActiveBookedSlotIds(bookings).size).toBe(0);
  });
});
