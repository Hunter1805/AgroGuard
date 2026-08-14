import { supabase } from '../lib/supabase/supabase-client';

async function getCurrentUserId(): Promise<string> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || 'demo';
  } catch {
    return 'demo';
  }
}

async function getCurrentUserEmail(): Promise<string> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.email || 'demo';
  } catch {
    return 'demo';
  }
}

export const mockStorage = {
  async get<T>(entityKey: string, defaultData: T[]): Promise<T[]> {
    const userId = await getCurrentUserId();
    const email = await getCurrentUserEmail();
    const storageKey = `agroguard_${userId}_${entityKey}`;

    const raw = localStorage.getItem(storageKey);
    if (raw !== null) {
      try {
        return JSON.parse(raw);
      } catch {
        // ignore
      }
    }

    // Se é uma nova conta criada (logado, e e-mail diferente do admin padrão)
    if (userId !== 'demo' && email !== 'admin@agroguard.com') {
      localStorage.setItem(storageKey, JSON.stringify([]));
      return [];
    }

    // Caso contrário (deslogado ou admin de demonstração)
    localStorage.setItem(storageKey, JSON.stringify(defaultData));
    return defaultData;
  },

  async set<T>(entityKey: string, data: T[]): Promise<void> {
    const userId = await getCurrentUserId();
    const storageKey = `agroguard_${userId}_${entityKey}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
};
