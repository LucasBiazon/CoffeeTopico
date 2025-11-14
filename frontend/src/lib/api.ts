
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Coffee {
  _id: string;
  name: string;

  roastery?: string;
  type?: "drink" | "bean";
  roast?: "light" | "medium" | "dark";
  tasting_notes?: string[];

  price?: {
    currency: string;
    value: number;
  };

  rating_avg?: number;
  rating_count?: number;
  image_url?: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
}

export interface Profile {
  _id?: string;
  user?: string;
  favoriteRoast: "light" | "medium" | "dark";
  prefersMilk: boolean;
  prefersSugar: boolean;
  budgetMin: number;
  budgetMax: number;
  brewMethods: string[];
}

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3000/v1";

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function saveAuth(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearAuth() {
  localStorage.removeItem("auth_token");
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Erro HTTP ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export async function apiLogin(
  email: string,
  password: string
): Promise<User> {
  const data = await apiFetch<{ token: string; user: User }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );

  saveAuth(data.token);
  return data.user;
}

export async function apiSignup(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const data = await apiFetch<{ token: string; user: User }>(
    "/auth/signup",
    {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }
  );

  saveAuth(data.token);
  return data.user;
}

export async function apiMe(): Promise<User> {
  return apiFetch<User>("/auth/me");
}
export interface CoffeeFilters {
  page?: number;
  limit?: number;
  type?: string;
  roast?: string;
  search?: string;
}

export async function apiGetCoffees(
  filters: CoffeeFilters = {}
): Promise<Paginated<Coffee>> {
  const params = new URLSearchParams();

  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.type && filters.type !== "all") {
    params.set("type", filters.type);
  }
  if (filters.roast && filters.roast !== "all") {
    params.set("roast", filters.roast);
  }
  if (filters.search) params.set("search", filters.search);

  const qs = params.toString();
  return apiFetch<Paginated<Coffee>>(
    `/coffees${qs ? "?" + qs : ""}`
  );
}

export const getCoffees = apiGetCoffees;

export async function apiGetCoffee(id: string): Promise<Coffee> {
  return apiFetch<Coffee>(`/coffees/${id}`);
}

export async function apiGetMyProfile(): Promise<Profile> {
  return apiFetch<Profile>("/profiles/me");
}

export async function apiUpdateMyProfile(
  profile: Profile
): Promise<Profile> {
  return apiFetch<Profile>("/profiles/me", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}

export interface ReviewUser {
  id?: string;
  name: string;
  email?: string;
}

export interface Review {
  id: string;
  coffeeId: string;
  user: ReviewUser;
  rating: number;
  comment?: string;
  createdAt: string;
}

export async function apiGetReviews(
  coffeeId: string
): Promise<Review[]> {
  return apiFetch<Review[]>(`/coffees/${coffeeId}/reviews`);
}

export async function apiCreateReview(
  coffeeId: string,
  rating: number,
  comment: string
): Promise<Review> {
  return apiFetch<Review>(`/coffees/${coffeeId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });
}

export interface FavoritesResponse {
  items: Coffee[];
  coffeeIds: string[];
}

export async function apiGetMyFavorites(): Promise<FavoritesResponse> {
  return apiFetch<FavoritesResponse>("/favorites");
}

export async function apiToggleFavorite(
  coffeeId: string
): Promise<{ isFavorite: boolean }> {
  return apiFetch<{ isFavorite: boolean }>(
    `/favorites/${coffeeId}/toggle`,
    {
      method: "POST",
    }
  );
}

export interface RecsContext {
  city?: string;
  temp?: number;
  isRaining?: boolean;
}

export interface RecsResponse {
  items: Coffee[];
  usedFallback?: boolean;
  context?: RecsContext;
}

export async function apiGetWeatherRecs(
  city?: string
): Promise<RecsResponse> {
  const params = new URLSearchParams();
  if (city) params.set("city", city);

  const qs = params.toString();
  const suffix = qs ? `?${qs}` : "";

  return apiFetch<RecsResponse>(`/recs/weather-live${suffix}`);
}


export async function apiGetAiRecs(): Promise<RecsResponse> {
  return apiFetch<RecsResponse>("/recs/ai");
}
