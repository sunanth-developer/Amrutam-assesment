import { ENV } from '@/config/env';
import { apiRequest, buildCacheKey } from '@/core/api/apiClient';
import { AppError } from '@/core/errors/AppError';
import { doctorsChunks, doctorsManifest } from '@/core/api/registries/doctorsRegistry';
import { slotsByDoctor, slotsDoctorIds } from '@/core/api/registries/slotsRegistry';
import type { PaginatedResult } from '@/shared/types/api';
import type { Booking, Doctor, DoctorFilters, TimeSlot } from '../types';
import { filterAvailableSlots } from '../utils/bookings';

export type { PaginatedResult };

function loadAllDoctors(): Doctor[] {
  const all: Doctor[] = [];
  for (let i = 0; i < doctorsManifest.chunks; i++) {
    all.push(...doctorsChunks[i]);
  }
  return all;
}

let doctorsCache: Doctor[] | null = null;

function getDoctorsData(): Doctor[] {
  if (!doctorsCache) doctorsCache = loadAllDoctors();
  return doctorsCache;
}

export async function fetchDoctors(
  page = 1,
  search = '',
  filters: DoctorFilters = {},
): Promise<PaginatedResult<Doctor>> {
  const cacheKey = buildCacheKey('doctors-list', { page, search, filters });
  return apiRequest(() => {
    let doctors = getDoctorsData();

    if (search) {
      const q = search.toLowerCase();
      doctors = doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q),
      );
    }

    if (filters.specialization) {
      doctors = doctors.filter((d) => d.specialization === filters.specialization);
    }
    if (filters.city) {
      doctors = doctors.filter((d) => d.city === filters.city);
    }
    if (filters.minRating) {
      doctors = doctors.filter((d) => d.rating >= filters.minRating!);
    }
    if (filters.availableToday) {
      doctors = doctors.filter((d) => d.availableToday);
    }

    const start = (page - 1) * ENV.PAGE_SIZE;
    const items = doctors.slice(start, start + ENV.PAGE_SIZE);

    return {
      items,
      total: doctors.length,
      page,
      pageSize: ENV.PAGE_SIZE,
      hasMore: start + ENV.PAGE_SIZE < doctors.length,
    };
  }, { cacheKey });
}

export async function fetchDoctorById(id: string): Promise<Doctor> {
  return apiRequest(() => {
    const doctor = getDoctorsData().find((d) => d.id === id);
    if (!doctor) throw new AppError('NOT_FOUND', 'Doctor not found');
    return doctor;
  }, { cacheKey: buildCacheKey('doctor', { id }) });
}

export async function fetchDoctorSlots(
  doctorId: string,
  existingBookings: Booking[] = [],
): Promise<TimeSlot[]> {
  return apiRequest(() => {
    if (!slotsDoctorIds.includes(doctorId)) {
      throw new AppError('NOT_FOUND', 'Slots not available for this doctor');
    }
    const slots: TimeSlot[] = slotsByDoctor[doctorId];
    return filterAvailableSlots(slots, existingBookings);
  }, { skipCache: true });
}

export async function createBooking(
  doctor: Doctor,
  slot: TimeSlot,
  existingBookings: Booking[],
): Promise<Booking> {
  return apiRequest(async () => {
    if (slot.isExpired) {
      throw new AppError('SLOT_EXPIRED', 'This slot has expired. Please select another.');
    }
    const alreadyBooked = existingBookings.some(
      (b) => b.slotId === slot.id && b.status !== 'cancelled',
    );
    if (!slot.isAvailable || alreadyBooked) {
      throw new AppError('SLOT_CONFLICT', 'This slot is no longer available.');
    }

    return {
      id: `booking-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      slotId: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
  }, { skipCache: true });
}

export function getSpecializations(): string[] {
  return [...new Set(getDoctorsData().map((d) => d.specialization))];
}

export function getCities(): string[] {
  return [...new Set(getDoctorsData().map((d) => d.city))];
}
