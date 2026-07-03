export type HealthRecordType = 'lab_report' | 'prescription' | 'consultation' | 'vaccination' | 'allergy';

export interface Attachment {
  id: string;
  type: 'image' | 'pdf';
  url: string;
  thumbnailUrl: string;
  name: string;
}

export interface HealthRecord {
  id: string;
  type: HealthRecordType;
  title: string;
  date: string;
  doctorName: string;
  facility: string;
  tags: string[];
  notes: string;
  attachments?: Attachment[];
  allergen?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  vaccineName?: string;
  doseNumber?: number;
}

export interface HealthRecordFilters {
  types?: HealthRecordType[];
  tags?: string[];
  year?: number;
  month?: number;
}

export interface TimelineSection {
  title: string;
  data: HealthRecord[];
}
