export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  consultationFee: number;
  city: string;
  languages: string[];
  about: string;
  imageUrl: string;
  availableToday: boolean;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isExpired: boolean;
}

export interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'pending_sync';
  createdAt: string;
}

export interface DoctorFilters {
  specialization?: string;
  city?: string;
  minRating?: number;
  availableToday?: boolean;
}
