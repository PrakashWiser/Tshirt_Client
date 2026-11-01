"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "@/app/store/store";
import type { RootState } from "@/app/store/rootReducer";

import {
  loginUser,
  registerUser,
  clearAuthError,
} from "@/app/store/slice/authSlice";

import { closeAuthModal } from "@/app/store/slice/authModalSlice";
import { useStoreNotification } from "@/app/common/StoreNotificationProvider";

type AuthView = "login" | "register";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),

  center: {
    x: 0,
    opacity: 1,
  },

  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

function AuthModal() {
  const dispatch = useDispatch<AppDispatch>();
  const notify = useStoreNotification();

  const { isOpen, initialView } = useSelector(
    (state: RootState) => state.authModal,
  );

  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const wasAuthenticatedRef = useRef(isAuthenticated);

  const [modalView, setModalView] = useState({
    isOpen,
    initialView,
    view: initialView,
    direction: initialView === "register" ? 1 : -1,
  });
  if (modalView.isOpen !== isOpen || modalView.initialView !== initialView) {
    setModalView({
      isOpen,
      initialView,
      view: initialView,
      direction: initialView === "register" ? 1 : -1,
    });
  }
  const { view, direction } = modalView;
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");

  useEffect(() => {
    if (isOpen) dispatch(clearAuthError());
  }, [isOpen, dispatch]);

  const switchView = (next: AuthView) => {
    setModalView((current) => ({
      ...current,
      view: next,
      direction: next === "register" ? 1 : -1,
    }));
    dispatch(clearAuthError());
  };

  const resetForms = useCallback(() => {
    setLoginEmail("");
    setLoginPassword("");

    setFirstName("");
    setRegEmail("");
    setRegMobile("");
    setRegPassword("");

    dispatch(clearAuthError());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    resetForms();
    dispatch(closeAuthModal());
  }, [dispatch, resetForms]);

  useEffect(() => {
    const wasAuth = wasAuthenticatedRef.current;

    wasAuthenticatedRef.current = isAuthenticated;

    if (!wasAuth && isAuthenticated && isOpen) {
      notify({
        title: "Welcome to SND Shop",
        message: `Welcome${user?.name ? `, ${user.name}` : " back"}.`,
      });
      handleClose();
    }
  }, [handleClose, isAuthenticated, isOpen, notify, user?.name]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearAuthError());

    void dispatch(
      loginUser({
        email: loginEmail,
        password: loginPassword,
      }),
    );
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(clearAuthError());

    void dispatch(
      registerUser({
        name: firstName,
        email: regEmail,
        mobile: regMobile,
        password: regPassword,
      }),
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/50"
          />

          <motion.div
            key="auth-modal"
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-[101] flex items-start justify-center overflow-y-auto p-4 sm:items-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h2
                    key={view}
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                    className="text-base font-bold tracking-wider text-gray-900"
                  >
                    {view === "login" ? "LOGIN" : "REGISTER"}
                  </motion.h2>
                </AnimatePresence>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={handleClose}
                  className="rounded-full p-1.5 text-gray-800 transition hover:bg-gray-100"
                >
                  <X size={22} strokeWidth={2.2} />
                </button>
              </div>
              <div className="relative overflow-hidden px-6 py-6">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  {view === "login" ? (
                    <motion.form
                      key="login"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                    >
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium tracking-wider text-gray-500">
                          EMAIL ADDRESS
                        </label>

                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="Email address"
                          className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium tracking-wider text-gray-500">
                          PASSWORD
                        </label>

                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                        />
                      </div>
                      {error && <p className="text-xs text-red-500">{error}</p>}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded bg-[#1a1a1a] px-4 py-3 text-sm font-semibold tracking-wider text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLoading && (
                          <Loader2 size={16} className="animate-spin" />
                        )}
                        SIGN IN
                      </button>
                      <p className="text-center text-sm text-gray-600">
                        Lost password?{" "}
                        <button
                          type="button"
                          className="font-semibold text-gray-900 underline"
                        >
                          Forgot Password
                        </button>
                      </p>
                      <button
                        type="button"
                        onClick={() => switchView("register")}
                        className="mt-4 w-full rounded bg-gray-100 px-4 py-3 text-sm font-semibold tracking-wider text-gray-900 transition hover:bg-gray-200"
                      >
                        CREATE AN ACCOUNT
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onSubmit={handleRegister}
                      className="space-y-4"
                    >
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium tracking-wider text-gray-500">
                          NAME
                        </label>

                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Full name"
                          className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium tracking-wider text-gray-500">
                          EMAIL <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="Email"
                          className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium tracking-wider text-gray-500">
                          MOBILE <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="tel"
                          required
                          value={regMobile}
                          onChange={(e) => setRegMobile(e.target.value)}
                          placeholder="Mobile"
                          className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-medium tracking-wider text-gray-500">
                          PASSWORD <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="password"
                          required
                          minLength={6}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                        />
                      </div>
                      {error && <p className="text-xs text-red-500">{error}</p>}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded bg-[#1a1a1a] px-4 py-3 text-sm font-semibold tracking-wider text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLoading && (
                          <Loader2 size={16} className="animate-spin" />
                        )}
                        REGISTER
                      </button>
                      <p className="pt-2 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => switchView("login")}
                          className="font-semibold text-gray-900 underline"
                        >
                          Login here
                        </button>
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
