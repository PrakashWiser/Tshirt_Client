"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setLogoutHandler } from "../api/FetchApi";
import { logout, refreshToken } from "../store/slice/authSlice";
import { store, type RootState } from "../store/store";
import {
  clearTokenRefresh,
  setupTokenRefresh,
} from "../utils/setupTokenRefresh";

export default function AuthBootstrap(): null {
  const { accessToken, refreshToken: currentRefreshToken } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    setLogoutHandler(() => {
      store.dispatch(logout());
    });

    return () => setLogoutHandler(null);
  }, []);

  useEffect(() => {
    if (!accessToken || !currentRefreshToken) {
      clearTokenRefresh();
      return;
    }

    setupTokenRefresh({
      store,
      logoutAction: logout,
      refreshTokenAction: refreshToken,
    });
  }, [accessToken, currentRefreshToken]);

  return null;
}