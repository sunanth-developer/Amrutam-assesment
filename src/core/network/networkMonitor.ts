import * as Network from 'expo-network';
import { useEffect, useState } from 'react';
import { logger } from '../logger/logger';

let globalOnline = true;
const listeners = new Set<(online: boolean) => void>();

export async function checkNetworkStatus(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return state.isConnected === true && state.isInternetReachable !== false;
  } catch {
    return false;
  }
}

export function subscribeNetwork(listener: (online: boolean) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getNetworkStatus(): boolean {
  return globalOnline;
}

export function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState(globalOnline);

  useEffect(() => {
    const poll = async () => {
      const online = await checkNetworkStatus();
      if (online !== globalOnline) {
        globalOnline = online;
        listeners.forEach((l) => l(online));
        logger.info(`Network status: ${online ? 'online' : 'offline'}`);
      }
      setIsOnline(online);
    };

    poll();
    const interval = setInterval(poll, 5000);
    const unsub = subscribeNetwork(setIsOnline);
    return () => {
      clearInterval(interval);
      unsub();
    };
  }, []);

  return isOnline;
}
