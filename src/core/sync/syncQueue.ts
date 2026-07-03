import { getItem, setItem, STORAGE_KEYS } from '../storage/storage';
import { logger } from '../logger/logger';

export type SyncActionType = 'CREATE_BOOKING' | 'CANCEL_BOOKING';

export interface SyncAction {
  id: string;
  type: SyncActionType;
  payload: Record<string, unknown>;
  createdAt: string;
  retries: number;
}

export async function enqueueSyncAction(action: Omit<SyncAction, 'id' | 'createdAt' | 'retries'>): Promise<void> {
  const queue = (await getItem<SyncAction[]>(STORAGE_KEYS.SYNC_QUEUE)) ?? [];
  queue.push({
    ...action,
    id: `sync-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    retries: 0,
  });
  await setItem(STORAGE_KEYS.SYNC_QUEUE, queue);
  logger.info('Action queued for sync', action.type);
}

export async function getSyncQueue(): Promise<SyncAction[]> {
  return (await getItem<SyncAction[]>(STORAGE_KEYS.SYNC_QUEUE)) ?? [];
}

export async function removeSyncAction(id: string): Promise<void> {
  const queue = await getSyncQueue();
  await setItem(STORAGE_KEYS.SYNC_QUEUE, queue.filter((a) => a.id !== id));
}

export async function incrementRetry(id: string): Promise<void> {
  const queue = await getSyncQueue();
  const updated = queue.map((a) => (a.id === id ? { ...a, retries: a.retries + 1 } : a));
  await setItem(STORAGE_KEYS.SYNC_QUEUE, updated);
}
