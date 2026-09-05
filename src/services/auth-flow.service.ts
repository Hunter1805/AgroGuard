export const AUTH_FLOW_TOTAL_TIMEOUT_MS = 75_000;
export const AUTH_SESSION_TIMEOUT_MS = 15_000;
// Cold start do Render free tier chega a ~25s; os limites por etapa precisam
// cobrir isso sem estourar antes do servidor acordar.
export const AUTH_PROFILE_TIMEOUT_MS = 40_000;
export const AUTH_PROVISION_TIMEOUT_MS = 40_000;
export const AUTH_REFRESH_TIMEOUT_MS = 40_000;

const FLOW_STARTED_KEY = 'agroguard_auth_flow_started_at';

export function startAuthFlow(): number {
  const startedAt = Date.now();
  sessionStorage.setItem(FLOW_STARTED_KEY, String(startedAt));
  return startedAt;
}

export function getAuthFlowRemainingMs(): number {
  const startedAt = Number(sessionStorage.getItem(FLOW_STARTED_KEY));
  if (!Number.isFinite(startedAt) || startedAt <= 0) return AUTH_FLOW_TOTAL_TIMEOUT_MS;
  return Math.max(0, AUTH_FLOW_TOTAL_TIMEOUT_MS - (Date.now() - startedAt));
}

export function clearAuthFlow(): void {
  sessionStorage.removeItem(FLOW_STARTED_KEY);
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then((value) => { clearTimeout(timer); resolve(value); }, (error) => { clearTimeout(timer); reject(error); });
  });
}
