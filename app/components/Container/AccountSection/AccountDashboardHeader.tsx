import Link from "next/link";
import { ClipboardList, UserRound } from "lucide-react";

type AccountTab = "profile" | "orders";

interface AccountDashboardHeaderProps {
  activeTab: AccountTab;
  userName?: string;
  description: string;
}

function AccountDashboardHeader({
  activeTab,
  userName,
  description,
}: AccountDashboardHeaderProps) {
  const firstName = userName?.trim().split(/\s+/)[0];

  const tabs: {
    id: AccountTab;
    label: string;
    href: string;
    icon: typeof UserRound;
  }[] = [
    { id: "profile", label: "My Profile", href: "/account", icon: UserRound },
    { id: "orders", label: "My Orders", href: "/orders", icon: ClipboardList },
  ];

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#003b1f] via-[#07542e] to-[#0c6b3d] p-5 text-white shadow-lg shadow-[#003b1f]/10 sm:p-8">
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-20 h-56 w-56 rounded-full border border-white/10"
      />
      <div
        aria-hidden="true"
        className="absolute -right-3 -top-11 h-40 w-40 rounded-full border border-white/10"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
            SND Shop · Account
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {firstName ? `Welcome back, ${firstName}` : "Your account"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
            {description}
          </p>
        </div>
        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-lg font-semibold backdrop-blur sm:flex">
          {firstName?.charAt(0).toUpperCase() ?? "S"}
        </div>
      </div>

      <nav
        aria-label="Account navigation"
        className="relative mt-6 flex w-fit max-w-full gap-2 overflow-x-auto rounded-xl border border-white/10 bg-black/10 p-1"
      >
        {tabs.map(({ id, label, href, icon: Icon }) => {
          const isActive = id === activeTab;
          return (
            <Link
              key={id}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                isActive
                  ? "bg-white text-[#003b1f] shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default AccountDashboardHeader;
