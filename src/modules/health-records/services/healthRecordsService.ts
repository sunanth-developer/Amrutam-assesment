import { ENV } from '@/config/env';
import { apiRequest, buildCacheKey } from '@/core/api/apiClient';
import { AppError } from '@/core/errors/AppError';
import { healthRecordsChunks, healthRecordsManifest } from '@/core/api/registries/healthRecordsRegistry';
import type { PaginatedResult } from '@/shared/types/api';
import type { HealthRecord, HealthRecordFilters } from '../types';
import { groupRecordsByMonthYear, getRecordTypeLabel } from '../utils/recordUtils';

export { groupRecordsByMonthYear, getRecordTypeLabel };

function loadAllRecords(): HealthRecord[] {
  const all: HealthRecord[] = [];
  for (let i = 0; i < healthRecordsManifest.chunks; i++) {
    all.push(...healthRecordsChunks[i]);
  }
  return all;
}

let recordsCache: HealthRecord[] | null = null;

function getRecordsData(): HealthRecord[] {
  if (!recordsCache) recordsCache = loadAllRecords();
  return recordsCache;
}

export async function fetchHealthRecords(
  page = 1,
  search = '',
  filters: HealthRecordFilters = {},
): Promise<PaginatedResult<HealthRecord>> {
  const cacheKey = buildCacheKey('health-records', { page, search, filters });
  return apiRequest(() => {
    let records = getRecordsData();

    if (search) {
      const q = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.doctorName.toLowerCase().includes(q) ||
          r.facility.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (filters.types?.length) {
      records = records.filter((r) => filters.types!.includes(r.type));
    }
    if (filters.tags?.length) {
      records = records.filter((r) => filters.tags!.some((t) => r.tags.includes(t)));
    }
    if (filters.year) {
      records = records.filter((r) => new Date(r.date).getFullYear() === filters.year);
    }
    if (filters.month) {
      records = records.filter((r) => new Date(r.date).getMonth() + 1 === filters.month);
    }

    const start = (page - 1) * ENV.PAGE_SIZE;
    const items = records.slice(start, start + ENV.PAGE_SIZE);

    return {
      items,
      total: records.length,
      page,
      pageSize: ENV.PAGE_SIZE,
      hasMore: start + ENV.PAGE_SIZE < records.length,
    };
  }, { cacheKey });
}

export async function fetchHealthRecordById(id: string): Promise<HealthRecord> {
  return apiRequest(() => {
    const record = getRecordsData().find((r) => r.id === id);
    if (!record) throw new AppError('NOT_FOUND', 'Health record not found');
    return record;
  }, { cacheKey: buildCacheKey('health-record', { id }) });
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getRecordsData().forEach((r) => r.tags.forEach((t) => tags.add(t)));
  return [...tags];
}
