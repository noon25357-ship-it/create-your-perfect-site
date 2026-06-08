import { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Users, GitBranch, Brain, Sparkles, Inbox, Megaphone, Home, Search, Bell, Zap, LayoutDashboard, Shield,
} from "lucide-react";

const NAV = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/executive-dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
  { to: "/crm", label: "CRM", icon: Users },
  { to: "/pipeline", label: "Sales Pipeline", icon: GitBranch },
  { to: "/ai-intelligence", label: "AI Lead Intelligence", icon: Brain },
  { to: "/ai-summary", label: "AI Summary", icon: Sparkles },
  { to: "/inbox", label: "Team Inbox", icon: Inbox },
  { to: "/automations", label: "AI Automations", icon: Zap },
  { to: "/campaigns", label: "AI Campaign Builder", icon: Megaphone },
  { to: "/team", label: "Team & Settings", icon: Shield },
];

export default function AppShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div dir="rtl" className="min-h-screen bg-[#0b0f14] text-slate-100">
      <div className="flex">
        <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-2 border-l border-white/5 bg-[#0a0d12] p-4 min-h-screen sticky top-0">
          <div className="px-2 py-3">
            <div className="text-lg font-bold tracking-tight">
              Lead<span className="text-[#25D366]">Flow</span>
            </div>
            <div className="text-[11px] text-slate-400">WhatsApp AI Sales Hub</div>
          </div>
          <nav className="mt-2 flex flex-col gap-1">
            {NAV.map((n) => {
              const active = pathname === n.to;
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    active
                      ? "bg-[#25D366]/10 text-[#25D366] ring-1 ring-[#25D366]/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-slate-400">
            <div className="font-medium text-slate-200 mb-1">Demo Workspace</div>
            بيانات تجريبية واقعية لعرض المنتج.
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 backdrop-blur bg-[#0b0f14]/80 border-b border-white/5">
            <div className="flex items-center gap-3 px-4 lg:px-8 py-4">
              <div className="flex-1">
                <h1 className="text-xl font-bold">{title}</h1>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
              </div>
              <div className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 w-72">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  placeholder="ابحث..."
                  className="bg-transparent outline-none flex-1 placeholder:text-slate-500"
                />
              </div>
              <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#25D366]" />
              </button>
              {actions}
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#25D366] to-emerald-600 flex items-center justify-center text-xs font-bold">
                MA
              </div>
            </div>
          </header>
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function Card({
  children, className = "", ...rest
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={`rounded-2xl border border-white/5 bg-[#0f141b] p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function Stat({ label, value, delta, accent = "#25D366" }: { label: string; value: string; delta?: string; accent?: string }) {
  return (
    <Card>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold" style={{ color: accent }}>{value}</div>
      {delta && <div className="mt-1 text-xs text-slate-500">{delta}</div>}
    </Card>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "green" | "yellow" | "red" | "blue" | "purple" }) {
  const tones: Record<string, string> = {
    default: "bg-white/5 text-slate-300 ring-white/10",
    green: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    yellow: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
    red: "bg-rose-500/10 text-rose-300 ring-rose-500/20",
    blue: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
    purple: "bg-violet-500/10 text-violet-300 ring-violet-500/20",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ring-1 ${tones[tone]}`}>{children}</span>;
}
