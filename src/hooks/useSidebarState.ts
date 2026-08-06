import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ag_sidebar_collapsed';

/**
 * Estado de recolhimento da sidebar corporativa.
 * Lê o valor inicial direto do localStorage no initializer do useState
 * para evitar flash de expansão/recolhimento após o mount.
 */
export function useSidebarState() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* noop — ambiente sem localStorage */
      }
      return next;
    });
  }, []);

  const collapse = useCallback(() => {
    setCollapsed(true);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch { /* noop */ }
  }, []);

  const expand = useCallback(() => {
    setCollapsed(false);
    try { localStorage.setItem(STORAGE_KEY, 'false'); } catch { /* noop */ }
  }, []);

  return { collapsed, toggle, collapse, expand };
}
