import { ENV } from '../../config/env';
import { logger } from '../logger/logger';
import { getSyncQueue, removeSyncAction, incrementRetry } from './syncQueue';
import { checkNetworkStatus } from '../network/networkMonitor';

const MAX_RETRIES = 3;

export async function processSyncQueue(): Promise<number> {
  const isOnline = await checkNetworkStatus();
  if (!isOnline) return 0;

  const queue = await getSyncQueue();
  let processed = 0;

  for (const action of queue) {
    if (action.retries >= MAX_RETRIES) continue;

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await removeSyncAction(action.id);
      processed++;
    } catch (error) {
      await incrementRetry(action.id);
      logger.error('Sync failed', error);
    }
  }

  return processed;
}

export function startBackgroundSync(): () => void {
  const interval = setInterval(() => {
    processSyncQueue();
  }, ENV.SYNC_INTERVAL_MS);

  return () => clearInterval(interval);
}
