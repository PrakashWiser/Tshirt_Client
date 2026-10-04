"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { RootState } from "../store/store";

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

  return children;
}