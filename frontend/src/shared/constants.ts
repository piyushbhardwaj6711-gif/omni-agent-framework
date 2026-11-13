/**
 * Centralised identity + workspace constants.
 *
 * NOTE: There is no authentication/session layer in the current build, so the
 * signed-in identity shown in the UI is defined here — the same demo identity
 * the app already displayed ("Kohinoor Realtors", Tenant #001).
 *
 * When a real auth/session backend exists, this file should be replaced by a
 * session-aware hook (e.g. useSession()) — the UI must consume real user data,
 * never hardcoded values.
 */

export interface CurrentUser {
  name: string;
  role: string;
  initials: string;
}

export interface Tenant {
  name: string;
  id: string;
  status: string;
}

export const CURRENT_USER: CurrentUser = {
  name: 'Piyush Sharma',
  role: 'Admin',
  initials: 'PS',
};

export const TENANT: Tenant = {
  name: 'Kohinoor Realtors',
  id: '001',
  status: 'Online',
};

/** First name used in the home greeting, e.g. "Hi Piyush," */
export function getGreetingName(): string {
  return CURRENT_USER.name.split(' ')[0] ?? CURRENT_USER.name;
}
