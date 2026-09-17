import { createClient } from '@supabase/supabase-js';

// Fase 17S — sem valores hardcoded no bundle. A URL e a chave (anon, pública por
// design) devem vir SEMPRE do ambiente de build (VITE_SUPABASE_URL /
// VITE_SUPABASE_ANON_KEY). Chaves administrativas (service_role) NUNCA devem
// residir aqui: pertencem exclusivamente ao ambiente do servidor backend.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Não imprimir valores — apenas os nomes das variáveis ausentes.
  const missing = [
    !supabaseUrl ? 'VITE_SUPABASE_URL' : null,
    !supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : null,
  ].filter(Boolean);
  throw new Error(
    `Configuração ausente no frontend: ${missing.join(', ')}. Defina-as no ambiente de build do Vite.`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
