import { supabase } from '../lib/supabase/supabase-client';
import { isExplicitMockMode } from '../config/data-source.config';

async function getCurrentUserId(): Promise<string> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || 'demo';
  } catch {
    return 'demo';
  }
}

/* demo email lookup removed */
/* async function getCurrentUserEmail(): Promise<string> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.email || 'demo';
  } catch {
    return 'demo';
  }
} */

export const mockStorage = {
  async get<T>(entityKey: string, defaultData: T[]): Promise<T[]> {
    // Fora do modo demo, ausência de dados é sempre estado vazio/API.
    if (!isExplicitMockMode) return [];

    const userId = await getCurrentUserId();
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
    localStorage.setItem(storageKey, JSON.stringify(defaultData));
    return defaultData;
  },

  async set<T>(entityKey: string, data: T[]): Promise<void> {
    if (!isExplicitMockMode) return;
    const userId = await getCurrentUserId();
    const storageKey = `agroguard_${userId}_${entityKey}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
};
