import type { Doctor } from '../../../modules/consultation/types';

export const doctorsChunks: Record<number, Doctor[]> = {
  0: require('../../../data/doctors/chunk-0.json') as Doctor[],
  1: require('../../../data/doctors/chunk-1.json') as Doctor[],
  2: require('../../../data/doctors/chunk-2.json') as Doctor[],
  3: require('../../../data/doctors/chunk-3.json') as Doctor[],
  4: require('../../../data/doctors/chunk-4.json') as Doctor[],
  5: require('../../../data/doctors/chunk-5.json') as Doctor[],
  6: require('../../../data/doctors/chunk-6.json') as Doctor[],
  7: require('../../../data/doctors/chunk-7.json') as Doctor[],
  8: require('../../../data/doctors/chunk-8.json') as Doctor[],
  9: require('../../../data/doctors/chunk-9.json') as Doctor[],
};

export const doctorsManifest = require('../../../data/doctors/manifest.json') as { total: number; chunkSize: number; chunks: number };
