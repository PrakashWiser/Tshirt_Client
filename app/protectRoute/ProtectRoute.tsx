"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { RootState } from "../store/store";
import type { AppDispatch } from "../store/store";
import { openAuthModal } from "../store/slice/authModalSlice";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const { accessToken, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const protectedRoutes = [
    "/contact",
  ];

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const requiresCheckoutLogin = pathname === "/checkout";

  useEffect(() => {
    if (
      mounted &&
      requiresCheckoutLogin &&
      !isLoading &&
      (!accessToken || !isAuthenticated)
    ) {
      dispatch(openAuthModal("login"));
    }
  }, [
    mounted,
    requiresCheckoutLogin,
    isLoading,
    accessToken,
    isAuthenticated,
    dispatch,
  ]);

  useEffect(() => {
    if (
      mounted &&
      isProtectedRoute &&
      !isLoading &&
      (!accessToken || !isAuthenticated)
    ) {
      router.replace("/login");
    }
  }, [
    mounted,
    isProtectedRoute,
    accessToken,
    isAuthenticated,
    isLoading,
    router,
  ]);

  if (!mounted) return null;

  if (
    isProtectedRoute &&
    (isLoading || !accessToken || !isAuthenticated)
  ) {
    return null;
  }

  if (
    requiresCheckoutLogin &&
    (isLoading || !accessToken || !isAuthenticated)
  ) {
    return null;
  }

  return children;
}