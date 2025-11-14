const TOKEN_KEY = 'coffee_token';
const USER_KEY = 'coffee_user';

export type AuthUser = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
};

export function saveAuth(token: string, user?: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getAuthToken();
}
