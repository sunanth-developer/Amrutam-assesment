import type { HealthRecord } from '../../../modules/health-records/types';

export const healthRecordsChunks: Record<number, HealthRecord[]> = {
  0: require('../../../data/health-records/chunk-0.json') as HealthRecord[],
  1: require('../../../data/health-records/chunk-1.json') as HealthRecord[],
  2: require('../../../data/health-records/chunk-2.json') as HealthRecord[],
  3: require('../../../data/health-records/chunk-3.json') as HealthRecord[],
  4: require('../../../data/health-records/chunk-4.json') as HealthRecord[],
  5: require('../../../data/health-records/chunk-5.json') as HealthRecord[],
  6: require('../../../data/health-records/chunk-6.json') as HealthRecord[],
  7: require('../../../data/health-records/chunk-7.json') as HealthRecord[],
  8: require('../../../data/health-records/chunk-8.json') as HealthRecord[],
  9: require('../../../data/health-records/chunk-9.json') as HealthRecord[],
  10: require('../../../data/health-records/chunk-10.json') as HealthRecord[],
  11: require('../../../data/health-records/chunk-11.json') as HealthRecord[],
  12: require('../../../data/health-records/chunk-12.json') as HealthRecord[],
  13: require('../../../data/health-records/chunk-13.json') as HealthRecord[],
  14: require('../../../data/health-records/chunk-14.json') as HealthRecord[],
  15: require('../../../data/health-records/chunk-15.json') as HealthRecord[],
  16: require('../../../data/health-records/chunk-16.json') as HealthRecord[],
  17: require('../../../data/health-records/chunk-17.json') as HealthRecord[],
  18: require('../../../data/health-records/chunk-18.json') as HealthRecord[],
  19: require('../../../data/health-records/chunk-19.json') as HealthRecord[],
};

export const healthRecordsManifest = require('../../../data/health-records/manifest.json') as { total: number; chunkSize: number; chunks: number };
