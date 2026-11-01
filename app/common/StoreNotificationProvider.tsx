"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, X, XCircle } from "lucide-react";

type NotificationKind = "success" | "error" | "info";

interface NotificationPayload {
  title: string;
  message: string;
  kind?: NotificationKind;
}

interface Notification extends NotificationPayload {
  id: number;
  kind: NotificationKind;
}

interface NotificationContextValue {
  notify: (payload: NotificationPayload) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);
let nextNotificationId = 0;

export function useStoreNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useStoreNotification must be used inside StoreNotificationProvider.");
  }
  return context.notify;
}

export default function StoreNotificationProvider({ children }: PropsWithChildren) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const notify = useCallback((payload: NotificationPayload) => {
    setNotification({
      ...payload,
      kind: payload.kind ?? "success",
      id: ++nextNotificationId,
    });
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => setNotification(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const StatusIcon =
    notification?.kind === "error" ? XCircle : notification?.kind === "info" ? Info : Check;

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div
        className="pointer-events-none fixed z-[200] w-[min(24rem,calc(100vw-2rem))]"
        style={{
          top: "calc(env(safe-area-inset-top, 0px) + 1rem)",
          right: "calc(env(safe-area-inset-right, 0px) + 1rem)",
        }}
      >
        <AnimatePresence mode="wait">
          {notification ? (
            <motion.div
              key={notification.id}
              role={notification.kind === "error" ? "alert" : "status"}
              aria-live={notification.kind === "error" ? "assertive" : "polite"}
              initial={{ opacity: 0, x: 28, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto overflow-hidden rounded-2xl border border-[#e8ece9] bg-white shadow-[0_16px_48px_rgba(0,35,18,0.18)]"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e8ece9] bg-[#fffdf9]">
                  <Image src="/images/logo.png" alt="SND Shop" fill sizes="48px" className="object-contain p-1" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <StatusIcon
                      size={15}
                      className={
                        notification.kind === "error"
                          ? "text-red-600"
                          : notification.kind === "info"
                            ? "text-gray-500"
                            : "text-[#247648]"
                      }
                    />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                      SND Shop
                    </p>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[#171a18]">{notification.title}</p>
                  <p className="mt-0.5 text-sm leading-5 text-[#747a76]">{notification.message}</p>
                </div>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => setNotification(null)}
                  className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
              <motion.div
                key={`progress-${notification.id}`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4.2, ease: "linear" }}
                className={`h-1 origin-left ${
                  notification.kind === "error"
                    ? "bg-red-500"
                    : notification.kind === "info"
                      ? "bg-gray-400"
                      : "bg-[#003b1f]"
                }`}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}
