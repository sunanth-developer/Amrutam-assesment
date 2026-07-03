import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../logger/logger';

const PREFIX = '@amrutam:';

// Fallback when native module isn't available (e.g. during certain Expo Go setups)
const memoryStore = new Map<string, string>();

function storageAvailable(): boolean {
  try {
    return AsyncStorage != null;
  } catch {
    return false;
  }
}

export async function getItem<T>(key: string): Promise<T | null> {
  const fullKey = PREFIX + key;
  try {
    const raw = storageAvailable()
      ? await AsyncStorage.getItem(fullKey)
      : memoryStore.get(fullKey) ?? null;
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    const fallback = memoryStore.get(fullKey);
    if (fallback) return JSON.parse(fallback) as T;
    logger.warn('Storage read failed, using memory fallback', { key });
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  const fullKey = PREFIX + key;
  const raw = JSON.stringify(value);
  memoryStore.set(fullKey, raw);
  try {
    if (storageAvailable()) {
      await AsyncStorage.setItem(fullKey, raw);
    }
  } catch (error) {
    logger.warn('Storage write failed, kept in memory', { key });
  }
}

export async function removeItem(key: string): Promise<void> {
  const fullKey = PREFIX + key;
  memoryStore.delete(fullKey);
  try {
    if (storageAvailable()) {
      await AsyncStorage.removeItem(fullKey);
    }
  } catch {
    // memory already cleared
  }
}

export const STORAGE_KEYS = {
  CART: 'cart',
  WISHLIST: 'wishlist',
  BOOKINGS: 'bookings',
  SYNC_QUEUE: 'sync_queue',
  API_CACHE: 'api_cache',
  THEME: 'theme',
  LOCALE: 'locale',
  SESSION: 'session',
} as const;
