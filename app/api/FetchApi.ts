const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FETCH_TIMEOUT = 15000;

let isSessionExpiredShown = false;
let onLogout: (() => void) | null = null;

export const setLogoutHandler = (handler: (() => void) | null): void => {
  onLogout = handler;
};

interface FetchApiProps {
  endpoint: string;
  method?: RequestInit["method"];
  body?: unknown;
  token?: string | null;
  skipAuthHandler?: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getApiErrorMessage = (rawText: string, fallback: string): string => {
  try {
    const payload: unknown = JSON.parse(rawText);
    if (!isRecord(payload)) {
      return fallback;
    }

    const data = isRecord(payload.data) ? payload.data : {};
    const candidates = [
      data.message,
      data.errors,
      payload.errors,
      payload.message,
    ];
    const message = candidates.find(
      (candidate): candidate is string => typeof candidate === "string",
    );

    return message || fallback;
  } catch {
    return fallback;
  }
};

export const FetchApi = async <T = unknown>({
  endpoint,
  method = "GET",
  body = null,
  token = null,
  skipAuthHandler = false,
}: FetchApiProps): Promise<T> => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  try {
    const headers: Record<string, string> = {};

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    const response = await fetch(
      `${API_URL.replace(/\/+$/, "")}${normalizedEndpoint}`,
      {
        method,
        headers,
        body:
          body instanceof FormData ? body : body ? JSON.stringify(body) : null,
        credentials: "include",
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type");
    const rawText = await response.text();

    if (response.status === 401 && skipAuthHandler) {
      const message = getApiErrorMessage(rawText, "Authentication failed");
      throw new Error(message);
    }

    if (response.status === 401) {
      if (!isSessionExpiredShown) {
        isSessionExpiredShown = true;

        if (onLogout) {
          onLogout();
        }

        window.dispatchEvent(new CustomEvent("session-expired"));

        setTimeout(() => {
          isSessionExpiredShown = false;
        }, 3000);
      }

      throw new Error("SESSION_EXPIRED");
    }

    if (!response.ok) {
      throw new Error(getApiErrorMessage(rawText, "Something went wrong"));
    }

    return contentType?.includes("application/json")
      ? (JSON.parse(rawText) as T)
      : (rawText as T);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
