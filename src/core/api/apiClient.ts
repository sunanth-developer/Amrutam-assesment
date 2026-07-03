import { ENV } from '../../config/env';
import { AppError } from '../errors/AppError';
import { logger } from '../logger/logger';
import { buildCacheKey, getCached, setCache } from '../storage/cache';
import { checkNetworkStatus } from '../network/networkMonitor';

export interface ApiRequestOptions {
  cacheKey?: string;
  skipCache?: boolean;
  timeoutMs?: number;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(): number {
  return 100 + Math.random() * 400;
}

async function simulateNetworkIssues(): Promise<void> {
  if (!ENV.MOCK_FAILURES) return;

  await delay(randomDelay());

  if (Math.random() < ENV.MOCK_FAILURE_RATE) {
    throw new AppError('NETWORK_ERROR', 'Network error. Please try again.');
  }

  if (Math.random() < 0.02) {
    await delay(ENV.MOCK_SLOW_NETWORK_MS);
  }
}

export async function apiRequest<T>(
  fetcher: () => T | Promise<T>,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { cacheKey, skipCache = false, timeoutMs = ENV.API_TIMEOUT_MS } = options;

  if (cacheKey && !skipCache) {
    const cached = await getCached<T>(cacheKey);
    if (cached) return cached;
  }

  const isOnline = await checkNetworkStatus();

  if (!isOnline && cacheKey) {
    const stale = await getCached<T>(cacheKey);
    if (stale) return stale;
    throw new AppError('NETWORK_ERROR', 'You are offline. No cached data available.');
  }

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new AppError('TIMEOUT', 'Request timed out.')), timeoutMs);
  });

  try {
    const result = await Promise.race([simulateNetworkIssues().then(() => fetcher()), timeoutPromise]);

    if (cacheKey) {
      await setCache(cacheKey, result);
    }

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;

    if (cacheKey) {
      const stale = await getCached<T>(cacheKey);
      if (stale) return stale;
    }

    throw new AppError('UNKNOWN', error instanceof Error ? error.message : 'Request failed');
  }
}

export { buildCacheKey };
