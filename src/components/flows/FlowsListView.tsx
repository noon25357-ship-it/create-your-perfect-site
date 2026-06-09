import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AppShell, { Card } from "@/components/app/AppShell";
import {
  ArrowLeftRight, Copy, MessageCircle, MoreVertical, Plus, RefreshCw, Search, Bot,
} from "lucide-react";
import { createFlow, useFlows, type Flow, type FlowStatus } from "@/lib/flows-store";

export const STATUS_STYLE: Record<FlowStatus, string> = {
  Published: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  Draft: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
  Deprecated: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  Blocked: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
};

export default function FlowsListView({
  title = "WhatsApp Flows",
  subtitle = "إدارة شجرة البوت والـ Flows من داخل لوحة LeadFlow",
  basePath = "/bot-tree",
}: { title?: string; subtitle?: string; basePath?: string }) {
  const flows = useFlows();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FlowStatus | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => flows.filter((f) =>
      (filter === "All" || f.status === filter) &&
      (query === "" || f.name.toLowerCase().includes(query.toLowerCase()) || f.category.toLowerCase().includes(query.toLowerCase()))
    ),
    [flows, filter, query],
  );

  const counts: Record<string, number> = {
    All: flows.length,
    Draft: flows.filter((f) => f.status === "Draft").length,
    Published: flows.filter((f) => f.status === "Published").length,
    Deprecated: flows.filter((f) => f.status === "Deprecated").length,
    Blocked: flows.filter((f) => f.status === "Blocked").length,
  };

  function handleCreate() {
    const f = createFlow("شجرة جديدة");
    toast.success("تم إنشاء الشجرة");
    navigate({ to: "/flow-builder/$id", params: { id: f.id } });
  }

  if (flows.length === 0) {
    return (
      <AppShell title={title} subtitle={subtitle}>
        <Card className="grid place-items-center py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
            <Bot className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold">ما عندك أي شجرة بوت حتى الآن</h2>
          <p className="mt-1 text-sm text-slate-400">ابدأ ببناء أول شجرة WhatsApp Flow وربطها بـ CRM.</p>
          <button onClick={handleCreate} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-black hover:brightness-110">
            <Plus className="h-4 w-4" /> إنشاء أول شجرة
          </button>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title={title} subtitle={subtitle}>
      <Card className="!p-0 overflow-hidden border-white/10 bg-gradient-to-br from-[#5b46f5]/10 via-[#0f141b] to-[#0f141b]">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-slate-400">شجرة البوت + WhatsApp Flows داخل لوحة LeadFlow الرئيسية.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={handleCreate}
              className="flex items-center gap-2 rounded-xl bg-[#5b46f5] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">
              <Plus className="h-4 w-4" /> Create flow
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10">
              <RefreshCw className="h-4 w-4" /> Sync with Business
            </button>
          </div>
        </div>
      </Card>

      <Card className="mt-4 !p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الفئة..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 pr-9 text-sm outline-none placeholder:text-slate-500 focus:border-[#25D366]/40" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["All", "Draft", "Published", "Deprecated", "Blocked"] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                  filter === s
                    ? "bg-[#25D366]/15 text-[#25D366] ring-1 ring-[#25D366]/30"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}>
                {s} <span className="opacity-60">({counts[s]})</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="mt-4 !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-white/[0.03] text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">الإسم</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Runs</th>
                <th className="px-4 py-3 font-medium">آخر تعديل</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f: Flow) => (
                <tr key={f.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <Link to={`${basePath}/$id` as any} params={{ id: f.id } as any} className="font-medium text-slate-100 hover:text-[#25D366]">
                      {f.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] ring-1 ${STATUS_STYLE[f.status]}`}>{f.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-emerald-300">
                      <ArrowLeftRight className="h-3.5 w-3.5" /> {f.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{f.category}</td>
                  <td className="px-4 py-3 text-slate-300">{f.runs.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-400">{f.modifiedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`${basePath}/$id` as any} params={{ id: f.id }}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20" title="فتح">
                        <MessageCircle className="h-4 w-4" />
                      </Link>
                      <button onClick={() => toast.success("تم النسخ")} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-slate-300 hover:bg-white/10">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">لا توجد فلوهات مطابقة.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
