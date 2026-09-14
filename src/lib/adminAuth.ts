export const DEFAULT_ADMIN_USERNAME = 'admin';
export const DEFAULT_ADMIN_PASSWORD = 'Northvale@2026!';
export const DEFAULT_SECRET_SLUG = 'secret-admin';
export const ALTERNATE_ADMIN_EMAIL = 'digitalnorthvale@gmail.com';

const SESSION_STORAGE_KEY = 'apex_cms_admin_session_v1';
const LOCAL_STORAGE_KEY = 'apex_cms_admin_persist_v1';

/**
 * Generates a random cryptographic salt string
 */
export function generateSalt(): string {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Computes SHA-256 hash of (salt + password)
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(`${salt}:${password}`);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  // Lightweight fallback if crypto.subtle is unavailable
  let hash = 0;
  const str = `${salt}:${password}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Verifies if the attempted password matches the stored credentials
 */
export async function verifyPassword(
  attempt: string,
  storedHash?: string,
  salt?: string
): Promise<boolean> {
  // If admin has not set a custom password hash yet, match against default initial password
  if (!storedHash || !salt) {
    return attempt === DEFAULT_ADMIN_PASSWORD;
  }
  const attemptHash = await hashPassword(attempt, salt);
  return attemptHash === storedHash;
}

/**
 * Validates the username (case-insensitive)
 */
export function verifyUsername(
  attemptUser: string,
  configuredUser: string = DEFAULT_ADMIN_USERNAME,
  allowEmail: boolean = true
): boolean {
  const cleanAttempt = attemptUser.trim().toLowerCase();
  const cleanConfigured = configuredUser.trim().toLowerCase();
  if (cleanAttempt === cleanConfigured) return true;
  if (cleanAttempt === DEFAULT_ADMIN_USERNAME.toLowerCase()) return true;
  if (allowEmail && cleanAttempt === ALTERNATE_ADMIN_EMAIL.toLowerCase()) return true;
  return false;
}

/**
 * Checks if the user is currently authenticated on this browser
 */
export function checkStoredAuthSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const session = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (session === 'true') return true;

    const persisted = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (persisted) {
      const parsed = JSON.parse(persisted);
      if (parsed?.authenticated && parsed?.expiry && parsed.expiry > Date.now()) {
        return true;
      }
    }
  } catch (e) {
    console.warn('Session check error:', e);
  }
  return false;
}

/**
 * Saves authenticated session
 */
export function saveAuthSession(remember: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    if (remember) {
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          authenticated: true,
          expiry: Date.now() + thirtyDays,
          savedAt: new Date().toISOString(),
        })
      );
    }
  } catch (e) {
    console.warn('Session save error:', e);
  }
}

/**
 * Clears authentication session on logout
 */
export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    console.warn('Session clear error:', e);
  }
}

/**
 * Determines whether current URL matches the Secret Admin Portal route
 */
export function isSecretAdminUrl(secretSlug: string = DEFAULT_SECRET_SLUG): boolean {
  if (typeof window === 'undefined') return false;
  const normalizedSlug = secretSlug.replace(/^\/+|\/+$/g, '').toLowerCase();
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const search = window.location.search.toLowerCase();

  return (
    path === normalizedSlug ||
    path === 'secret-admin' ||
    path === 'admin-portal' ||
    hash === normalizedSlug ||
    hash === 'secret-admin' ||
    hash === 'admin-portal' ||
    hash === '#/secret-admin' ||
    search.includes('admin=secret') ||
    search.includes('secret_admin=')
  );
}
