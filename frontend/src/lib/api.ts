const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function setAuthUser(user: any) {
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function getAuthUser() {
  const raw = localStorage.getItem('auth_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCoffees() {
  const res = await fetch(`${API_BASE}/v1/coffees`);
  if (!res.ok) {
    throw new Error('Falha ao buscar cafés');
  }
  const data = await res.json();
  return data.items || [];
}

export async function getCoffeeById(id: string) {
  const res = await fetch(`${API_BASE}/v1/coffees/${id}`);
  if (!res.ok) {
    throw new Error('Café não encontrado');
  }
  return await res.json();
}

export async function createCoffee(payload: any) {
  const res = await fetch(`${API_BASE}/v1/coffees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Erro ao criar café');
  }
  return await res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Login inválido');
  }

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  return data;
}

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const res = await fetch(`${API_BASE}/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Erro ao criar usuário');
  }
  return await res.json();
}

export async function getMyProfile() {
  const res = await fetch(`${API_BASE}/v1/profiles/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error('Não foi possível carregar o perfil');
  }
  return await res.json();
}

export async function updateMyProfile(payload: any) {
  const res = await fetch(`${API_BASE}/v1/profiles/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Não foi possível atualizar o perfil');
  }
  return await res.json();
}

export async function getReviews(coffeeId: string) {
  const res = await fetch(`${API_BASE}/v1/coffees/${coffeeId}/reviews`);
  if (!res.ok) {
    throw new Error('Erro ao buscar reviews');
  }
  return await res.json();
}

export async function createReview(coffeeId: string, payload: any) {
  const res = await fetch(`${API_BASE}/v1/coffees/${coffeeId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Erro ao criar review');
  }
  return await res.json();
}
