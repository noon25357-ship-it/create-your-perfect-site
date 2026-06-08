import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import { LEADS, PIPELINE_STAGES } from "@/lib/demo-data";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/pipeline")({
  head: () => ({ meta: [{ title: "Sales Pipeline — LeadFlow" }, { name: "description", content: "خط مبيعات كانبان مرئي." }] }),
  component: PipelinePage,
});

const STAGE_COLORS: Record<string, string> = {
  New: "#60a5fa", Contacted: "#a78bfa", Qualified: "#f59e0b",
  Proposal: "#fb923c", Negotiation: "#f472b6", Won: "#34d399",
};

function PipelinePage() {
  const total = LEADS.reduce((s, l) => s + l.value, 0);

  return (
    <AppShell title="Sales Pipeline" subtitle="خط المبيعات الذكي — Kanban">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="إجمالي الـ Pipeline" value={`${(total / 1000).toFixed(0)}k`} delta="ر.س" />
        <Stat label="معدل التحويل" value="24.6%" delta="+3.1% MoM" accent="#34d399" />
        <Stat label="متوسط قيمة الصفقة" value="38.4k" delta="ر.س" accent="#60a5fa" />
        <Stat label="صفقات تحتاج متابعة" value="9" delta="عاجلة" accent="#f59e0b" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {PIPELINE_STAGES.map(stage => {
          const items = LEADS.filter(l => l.stage === stage);
          const sum = items.reduce((s, l) => s + l.value, 0);
          return (
            <div key={stage} className="rounded-2xl bg-[#0f141b] border border-white/5 p-3 flex flex-col gap-2 min-h-[420px]">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: STAGE_COLORS[stage] }} />
                  <span className="text-sm font-medium">{stage}</span>
                </div>
                <span className="text-xs text-slate-500">{items.length}</span>
              </div>
              <div className="text-xs text-slate-500 px-1 -mt-1 mb-1">{(sum / 1000).toFixed(0)}k ر.س</div>
              <div className="flex flex-col gap-2 overflow-y-auto">
                {items.slice(0, 6).map(l => (
                  <div key={l.id} className="rounded-xl bg-white/[0.03] border border-white/5 p-3 hover:border-white/15 transition cursor-pointer">
                    <div className="text-sm font-medium">{l.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{l.city} · {l.owner}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-300">{l.value.toLocaleString()} ر.س</span>
                      <Badge tone={l.intent === "High" ? "green" : l.intent === "Medium" ? "yellow" : "red"}>
                        {l.score}
                      </Badge>
                    </div>
                    {l.intent === "High" && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400">
                        <TrendingUp className="h-3 w-3" /> فرصة عالية
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
