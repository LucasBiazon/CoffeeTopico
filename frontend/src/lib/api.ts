const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function saveAuth(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearAuth() {
  localStorage.removeItem("auth_token");
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export type Coffee = {
  _id: string;
  type: "bean" | "drink";
  name: string;
  brand?: string;
  origin_country?: string;
  roast?: "light" | "medium" | "dark";
  tasting_notes?: string[];
  attributes?: {
    acidity?: number;
    sweetness?: number;
    bitterness?: number;
    body?: number;
    aroma?: number;
  };
  brew_methods?: string[];
  price?: { currency: string; value: number };
  bag_price?: number;
  bag_size_g?: number;
  contains?: string[];
  available?: boolean;
  rating_avg?: number;
  rating_count?: number;
  image_url?: string;
  temperature?: "hot" | "cold" | "either";
};

export type CoffeeListResponse = {
  items: Coffee[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CoffeeListFilters = {
  page?: number;
  limit?: number;
  type?: string;
  roast?: string;
  available?: boolean;
  search?: string;
  sort?: string;
};

export type Review = {
  _id: string;
  rating: number;
  comment?: string;
  user?: {
    _id: string;
    name?: string;
    email?: string;
  };
  createdAt?: string;
};

export type FavoritesResponse = {
  items: Coffee[];
  coffeeIds: string[];
};

function buildQuery(params: Record<string, any>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    qs.set(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export async function getCoffees(
  filters: CoffeeListFilters = {}
): Promise<CoffeeListResponse> {
  const query = buildQuery(filters);
  const res = await fetch(`${API_BASE}/v1/coffees${query}`);
  if (!res.ok) {
    throw new Error("Falha ao buscar cafés");
  }
  return res.json();
}

export async function getCoffeeById(id: string): Promise<Coffee> {
  const res = await fetch(`${API_BASE}/v1/coffees/${id}`);
  if (!res.ok) {
    throw new Error("Café não encontrado");
  }
  return res.json();
}

export async function createCoffee(payload: any) {
  const res = await fetch(`${API_BASE}/v1/coffees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar café");
  }
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login inválido");
  }

  const data = await res.json().catch(() => ({} as any));

  if (data && typeof data === "object" && data.token) {
    saveAuth(data.token);
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Erro ao criar usuário";
    if (res.status === 409) {
      msg = "E-mail já está em uso.";
    } else {
      try {
        const body = await res.json();
        if (body?.error) msg = body.error;
      } catch {
      }
    }
    throw new Error(msg);
  }

  return res.json();
}

export async function getMyProfile() {
  const res = await fetch(`${API_BASE}/v1/profiles/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error("Não foi possível carregar o perfil");
  }
  return res.json();
}

export async function updateMyProfile(payload: any) {
  const res = await fetch(`${API_BASE}/v1/profiles/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Não foi possível atualizar o perfil");
  }
  return res.json();
}

export async function getReviews(coffeeId: string): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/v1/coffees/${coffeeId}/reviews`);
  if (!res.ok) {
    throw new Error("Erro ao buscar reviews");
  }
  return res.json();
}

export async function createReview(
  coffeeId: string,
  payload: { rating: number; comment?: string }
): Promise<Review> {
  const res = await fetch(`${API_BASE}/v1/coffees/${coffeeId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Erro ao criar review";
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
    }
    throw new Error(msg);
  }

  return res.json();
}

export async function getMyFavorites(): Promise<FavoritesResponse> {
  const res = await fetch(`${API_BASE}/v1/favorites`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error("Erro ao buscar favoritos");
  }
  return res.json();
}

export async function toggleFavorite(
  coffeeId: string
): Promise<{ isFavorite: boolean }> {
  const res = await fetch(
    `${API_BASE}/v1/favorites/${coffeeId}/toggle`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    }
  );
  if (!res.ok) {
    throw new Error("Erro ao atualizar favorito");
  }
  return res.json();
}

export async function getWeatherRecs(city: string) {
  const query = buildQuery({ city });
  const res = await fetch(`${API_BASE}/v1/recs/weather-live${query}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar recomendações por clima");
  }
  return res.json();
}

export async function getAiRecs() {
  const res = await fetch(`${API_BASE}/v1/recs/ai`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    throw new Error("Erro ao buscar recomendações personalizadas");
  }
  return res.json();
}
