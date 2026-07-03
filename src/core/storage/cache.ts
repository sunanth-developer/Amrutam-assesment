import { ENV } from '../../config/env';
import { getItem, setItem, STORAGE_KEYS } from './storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

type CacheStore = Record<string, CacheEntry<unknown>>;

export async function getCached<T>(key: string): Promise<T | null> {
  const cache = (await getItem<CacheStore>(STORAGE_KEYS.API_CACHE)) ?? {};
  const entry = cache[key] as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ENV.CACHE_TTL_MS) return null;
  return entry.data;
}

export async function setCache<T>(key: string, data: T): Promise<void> {
  const cache = (await getItem<CacheStore>(STORAGE_KEYS.API_CACHE)) ?? {};
  cache[key] = { data, timestamp: Date.now() };
  await setItem(STORAGE_KEYS.API_CACHE, cache);
}

export function buildCacheKey(resource: string, params?: Record<string, unknown>): string {
  return `${resource}:${JSON.stringify(params ?? {})}`;
}
