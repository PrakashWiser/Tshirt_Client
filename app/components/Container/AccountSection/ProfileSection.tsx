"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Save, ShieldCheck, UserRound } from "lucide-react";
import AccountDashboardHeader from "./AccountDashboardHeader";
import { openAuthModal } from "@/app/store/slice/authModalSlice";
import {
  fetchCurrentUser,
  updateCurrentUserProfile,
} from "@/app/store/slice/authSlice";
import type { RootState } from "@/app/store/rootReducer";
import type { AppDispatch } from "@/app/store/store";

interface ProfileFields {
  name: string;
  email: string;
  mobile: string;
}

function ProfileSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const [fields, setFields] = useState<ProfileFields>(() => ({
    name: user?.name ?? "",
    email: user?.email ?? "",
    mobile: user?.mobile ?? "",
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    let active = true;
    void dispatch(fetchCurrentUser())
      .unwrap()
      .then((profile) => {
        if (active) {
          setFields({
            name: profile.name ?? "",
            email: profile.email ?? "",
            mobile: profile.mobile ?? "",
          });
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Failed to load profile",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [dispatch, isAuthenticated]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      await dispatch(
        updateCurrentUserProfile({
          name: fields.name.trim(),
          email: fields.email.trim(),
          mobile: fields.mobile.trim(),
        }),
      ).unwrap();
      setSaved(true);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center px-4 py-12">
        <div className="w-full rounded-2xl bg-white p-8 text-center shadow-sm">
          <UserRound className="mx-auto text-[#003b1f]" size={32} />
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to view and update your profile.
          </p>
          <button
            type="button"
            onClick={() => dispatch(openAuthModal("login"))}
            className="mt-6 rounded-lg bg-[#003b1f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#002d18]"
          >
            Sign in
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[65vh] bg-[#f7f8f6] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <AccountDashboardHeader
          activeTab="profile"
          userName={user?.name}
          description="Keep your personal details current for a smoother checkout."
        />

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4 lg:flex-col lg:items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#003b1f] to-[#26804d] text-xl font-bold text-white shadow-md shadow-[#003b1f]/15">
                {user?.name?.trim().charAt(0).toUpperCase() || "S"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Account owner
                </p>
                <p className="mt-1 truncate font-semibold text-gray-900">
                  {user?.name || "Your profile"}
                </p>
                <p className="mt-1 break-all text-sm text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#f4f7f5] p-4">
              <ShieldCheck size={19} className="text-[#08703a]" />
              <p className="mt-3 text-sm font-semibold text-gray-800">
                Your details, kept secure
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Your contact information helps us deliver orders and keep you
                updated.
              </p>
            </div>
          </aside>

          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
          >
            <div className="mb-6 border-b border-gray-100 pb-5">
             
              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Profile details
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update the information associated with your account.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
                Full name
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={fields.name}
                  onChange={(event) =>
                    setFields((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#08703a] focus:bg-white focus:ring-4 focus:ring-[#08703a]/10"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={fields.email}
                  onChange={(event) =>
                    setFields((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#08703a] focus:bg-white focus:ring-4 focus:ring-[#08703a]/10"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Mobile number
                <input
                  type="tel"
                  autoComplete="tel"
                  required
                  value={fields.mobile}
                  onChange={(event) =>
                    setFields((current) => ({
                      ...current,
                      mobile: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#08703a] focus:bg-white focus:ring-4 focus:ring-[#08703a]/10"
                />
              </label>
            </div>

            {(loadError || saveError) && (
              <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError || `Could not refresh profile: ${loadError}`}
              </p>
            )}
            {saved && (
              <p
                role="status"
                className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
              >
                Profile updated successfully.
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-400">
                Changes are saved securely to your account.
              </p>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003b1f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002d18] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ProfileSection;
