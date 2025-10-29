import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { API_URL } from "@env";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "HIKEUP_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "HIKEUP_REFRESH_TOKEN";

// --- Inicjalizacja instancji ---
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// --- Ustawianie tokena ---
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// --- SecureStore: zapis / odczyt / czyszczenie ---
export const saveTokens = async (token: string, refreshToken?: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  if (refreshToken) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  setAuthToken(token);
};

export const loadTokens = async () => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (token) setAuthToken(token);
  return token;
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  setAuthToken(null);
};

// --- Logowanie ---
export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/login", { email, password });
  const { token, refreshToken } = res.data;

  if (token) await saveTokens(token, refreshToken);
  return res.data;
};

// --- Uwierzytelnienie ---
export const getAuthenticatedUser = async () => {
  const res = await api.get("/authenticate");
  return res.data;
};

// --- Wylogowanie ---
export const logoutUser = async () => {
  try {
    await api.post("/logout");
  } finally {
    await clearTokens();
  }
};

// --- Odświeżanie tokena ---
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  try {
    const res = await api.post("/refresh", { refreshToken });
    const { token, refreshToken: newRefresh } = res.data;
    if (token) await saveTokens(token, newRefresh);
    return token;
  } catch (err) {
    console.warn("❌ Nie udało się odświeżyć tokena");
    await clearTokens();
    return null;
  }
};

// --- Interceptor dla 401 ---
interface RetryableAxiosRequest extends AxiosRequestConfig {
  _retry?: boolean;
  headers?: Record<string, any>;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableAxiosRequest | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken && originalRequest) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
