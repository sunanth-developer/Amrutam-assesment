import { create } from 'zustand';
import { AppError } from '@/core/errors/AppError';
import { getItem, removeItem, setItem, STORAGE_KEYS } from '@/core/storage/storage';
import { DEMO_ACCOUNT, validateCredentials } from '../config/demoAccount';
import type { AuthSession, AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithDemo: () => Promise<void>;
  logout: () => Promise<void>;
}

function buildSession(user: AuthUser): AuthSession {
  return {
    user,
    token: `demo-token-${user.id}`,
    loggedInAt: new Date().toISOString(),
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,

  hydrate: async () => {
    const session = await getItem<AuthSession>(STORAGE_KEYS.SESSION);
    set({ user: session?.user ?? null, isHydrated: true });
  },

  login: async (email, password) => {
    if (!validateCredentials(email, password)) {
      throw new AppError('SESSION_EXPIRED', 'Invalid email or password.');
    }
    const session = buildSession(DEMO_ACCOUNT.user);
    await setItem(STORAGE_KEYS.SESSION, session);
    set({ user: session.user });
  },

  loginWithDemo: async () => {
    const session = buildSession(DEMO_ACCOUNT.user);
    await setItem(STORAGE_KEYS.SESSION, session);
    set({ user: session.user });
  },

  logout: async () => {
    await removeItem(STORAGE_KEYS.SESSION);
    set({ user: null });
  },
}));
