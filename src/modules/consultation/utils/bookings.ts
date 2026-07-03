import type { Booking } from '../types';
import type { TimeSlot } from '../types';

export function getUpcomingBookings(bookings: Booking[]): Booking[] {
  const now = new Date();
  return bookings.filter(
    (b) => b.status !== 'cancelled' && new Date(`${b.date}T${b.startTime}`) >= now,
  );
}

export function getActiveBookedSlotIds(bookings: Booking[]): Set<string> {
  return new Set(
    bookings.filter((b) => b.status !== 'cancelled').map((b) => b.slotId),
  );
}

export function filterAvailableSlots(slots: TimeSlot[], bookings: Booking[]): TimeSlot[] {
  const bookedIds = getActiveBookedSlotIds(bookings);
  return slots.filter(
    (s) => !s.isExpired && s.isAvailable && !bookedIds.has(s.id),
  );
}
