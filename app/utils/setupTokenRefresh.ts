import type { logout, refreshToken } from "../store/slice/authSlice";
import type { AppDispatch } from "../store/store";

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

interface SetupTokenRefreshProps {
  store: {
    dispatch: AppDispatch;
  };
  logoutAction: typeof logout;
  refreshTokenAction: typeof refreshToken;
}

export const isLoginExpired = (): boolean => {
  const loginTimestamp = localStorage.getItem("loginTimestamp");
  if (!loginTimestamp) {
    return true;
  }
  const timestamp = Number(loginTimestamp);
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return true;
  }
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - timestamp >= sevenDays;
};

export const setupTokenRefresh = ({
  store,
  logoutAction,
  refreshTokenAction,
}: SetupTokenRefreshProps): void => {
  clearTokenRefresh();

  if (isLoginExpired()) {
    store.dispatch(logoutAction());
    return;
  }

  const tokenExpiryValue = localStorage.getItem("tokenExpiry");
  if (!tokenExpiryValue || !Number.isFinite(Number(tokenExpiryValue))) {
    store.dispatch(refreshTokenAction());
    return;
  }

  const currentTime = Date.now();
  const expiresIn = Number(tokenExpiryValue) - currentTime;
  const refreshIn = expiresIn - 2 * 60 * 1000;

  if (refreshIn <= 0) {
    store.dispatch(refreshTokenAction());
  } else {
    refreshTimeout = setTimeout(() => {
      store.dispatch(refreshTokenAction());
    }, refreshIn);
  }
};

export const clearTokenRefresh = (): void => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
};
