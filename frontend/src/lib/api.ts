
const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/v1";

let authToken: string | null = null;

export function apiSetToken(token: string | null) {
  authToken = token;
}


export interface Price {
  currency: string;
  value: number;
}

export type Roast = "light" | "medium" | "dark";

export interface Coffee {
  _id: string;
  name: string;
  roastery?: string;
  image_url?: string;
  roast?: Roast;
  type?: string;
  price?: Price;
  tasting_notes?: string[];
  rating_avg?: number;
  rating_count?: number;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
}

export interface User {
  id: string;
  name?: string;
  email: string;
}

export interface ReviewUser {
  id?: string;
  name?: string;
}

export interface Review {
  id: string;
  coffeeId: string;
  user: ReviewUser;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface RecsResponse {
  items: Coffee[];
  usedFallback?: boolean;
  context?: {
    city?: string | null;
    temp?: number;
    isRaining?: boolean;
  };
}


export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      (typeof data === "string" ? data : "Erro ao comunicar com o servidor");
    throw new Error(msg);
  }

  return data as T;
}


export async function apiLogin(params: {
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> {
  const data = await apiFetch<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data;
}

export async function apiSignup(params: {
  name: string;
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> {
  const data = await apiFetch<{ token: string; user: User }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data;
}

export async function apiGetMe(): Promise<User> {
  return apiFetch<User>("/auth/me");
}


export interface CoffeeListFilters {
  page?: number;
  limit?: number;
  roast?: Roast;
  search?: string;
}

export async function apiGetCoffees(
  filters: CoffeeListFilters = {},
): Promise<Paginated<Coffee>> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.roast) params.set("roast", filters.roast);
  if (filters.search) params.set("search", filters.search);

  const qs = params.toString();
  return apiFetch<Paginated<Coffee>>(`/coffees${qs ? `?${qs}` : ""}`);
}

export async function apiGetCoffee(id: string): Promise<Coffee> {
  return apiFetch<Coffee>(`/coffees/${id}`);
}


export async function apiGetReviews(coffeeId: string): Promise<Review[]> {
  return apiFetch<Review[]>(`/coffees/${coffeeId}/reviews`);
}

export async function apiCreateReview(
  coffeeId: string,
  rating: number,
  comment: string,
): Promise<Review> {
  return apiFetch<Review>(`/coffees/${coffeeId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });
}


export async function apiGetWeatherRecs(
  city?: string,
): Promise<RecsResponse> {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  const qs = params.toString();
  return apiFetch<RecsResponse>(
    `/recs/weather-live${qs ? `?${qs}` : ""}`,
  );
}

export async function apiGetAiRecs(): Promise<RecsResponse> {
  return apiFetch<RecsResponse>("/recs/ai");
}


const FAV_KEY = "coffeetopico:favorites";

export function loadFavoriteIds(): Set<string> {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function saveFavoriteIds(ids: Set<string>) {
  localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(ids)));
}
