import { create } from 'zustand';
import { AppError } from '../../../core/errors/AppError';
import { getItem, setItem, STORAGE_KEYS } from '../../../core/storage/storage';
import { enqueueSyncAction } from '../../../core/sync/syncQueue';
import { createBooking as apiCreateBooking } from '../services/consultationService';
import type { Booking, Doctor, TimeSlot } from '../types';
import { logger } from '../../../core/logger/logger';
import { checkNetworkStatus } from '../../../core/network/networkMonitor';

interface ConsultationState {
  bookings: Booking[];
  loaded: boolean;
  loadBookings: () => Promise<void>;
  bookConsultation: (doctor: Doctor, slot: TimeSlot) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
}

export const useConsultationStore = create<ConsultationState>((set, get) => ({
  bookings: [],
  loaded: false,

  loadBookings: async () => {
    const saved = await getItem<Booking[]>(STORAGE_KEYS.BOOKINGS);
    set({ bookings: saved ?? [], loaded: true });
  },

  bookConsultation: async (doctor, slot) => {
    const { bookings } = get();

    const slotTaken = bookings.some(
      (b) => b.slotId === slot.id && b.status !== 'cancelled',
    );
    if (slotTaken) {
      throw new AppError('SLOT_CONFLICT', 'This slot is no longer available.');
    }

    const isOnline = await checkNetworkStatus();

    if (!isOnline) {
      const pendingBooking: Booking = {
        id: `booking-offline-${Date.now()}`,
        doctorId: doctor.id,
        doctorName: doctor.name,
        slotId: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'pending_sync',
        createdAt: new Date().toISOString(),
      };
      const updated = [...bookings, pendingBooking];
      await setItem(STORAGE_KEYS.BOOKINGS, updated);
      await enqueueSyncAction({ type: 'CREATE_BOOKING', payload: { doctorId: doctor.id, slotId: slot.id } });
      set({ bookings: updated });
      return pendingBooking;
    }

    const booking = await apiCreateBooking(doctor, slot, bookings);
    const updated = [...bookings, booking];
    await setItem(STORAGE_KEYS.BOOKINGS, updated);
    set({ bookings: updated });
    return booking;
  },

  cancelBooking: async (bookingId) => {
    const { bookings } = get();
    const isOnline = await checkNetworkStatus();
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b,
    );
    await setItem(STORAGE_KEYS.BOOKINGS, updated);
    set({ bookings: updated });

    if (!isOnline) {
      await enqueueSyncAction({ type: 'CANCEL_BOOKING', payload: { bookingId } });
    }
    logger.info('Booking cancelled', bookingId);
  },
}));
