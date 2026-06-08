import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import { LEADS } from "@/lib/demo-data";
import { useMemo, useState } from "react";
import { Filter, Plus, Phone, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "CRM — LeadFlow" }, { name: "description", content: "إدارة علاقات العملاء بذكاء WhatsApp." }] }),
  component: CRMPage,
});

function CRMPage() {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<string>("all");
  const filtered = useMemo(
    () => LEADS.filter(l => (stage === "all" || l.stage === stage) && (q === "" || l.name.includes(q) || l.phone.includes(q))),
    [q, stage]
  );
  const total = LEADS.length;
  const won = LEADS.filter(l => l.stage === "Won").length;
  const pipeline = LEADS.filter(l => !["Won", "Lost"].includes(l.stage)).reduce((s, l) => s + l.value, 0);

  return (
    <AppShell title="CRM" subtitle="إدارة العملاء والصفقات" actions={
      <button className="hidden md:inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-3 py-2 text-sm font-medium text-black hover:brightness-110">
        <Plus className="h-4 w-4" /> عميل جديد
      </button>
    }>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="إجمالي العملاء" value={total.toString()} delta="+12 هذا الأسبوع" />
        <Stat label="صفقات مكسوبة" value={won.toString()} delta="معدل 24%" accent="#34d399" />
        <Stat label="قيمة الـ Pipeline" value={`${(pipeline / 1000).toFixed(0)}k SAR`} delta="+18% MoM" accent="#60a5fa" />
        <Stat label="متوسط زمن الإغلاق" value="6.4 يوم" delta="-1.2 يوم" accent="#f59e0b" />
      </div>

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="ابحث بالاسم أو الجوال..."
            className="flex-1 min-w-[200px] rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none placeholder:text-slate-500"
          />
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            {["all", "New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won"].map(s => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={`rounded-lg px-3 py-1.5 text-xs ${stage === s ? "bg-[#25D366] text-black" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
              >
                {s === "all" ? "الكل" : s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-400 text-xs">
              <tr>
                {["العميل", "المصدر", "المرحلة", "Score", "القيمة", "المسؤول", "آخر نشاط", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-right font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 25).map(l => (
                <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-slate-500">{l.phone} · {l.city}</div>
                  </td>
                  <td className="px-4 py-3"><Badge tone="blue">{l.source}</Badge></td>
                  <td className="px-4 py-3">
                    <Badge tone={l.stage === "Won" ? "green" : l.stage === "Lost" ? "red" : "yellow"}>{l.stage}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#25D366]" style={{ width: `${l.score}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{l.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{l.value.toLocaleString()} ر.س</td>
                  <td className="px-4 py-3 text-slate-400">{l.owner}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{l.lastActivity}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button className="rounded-lg bg-[#25D366]/10 p-1.5 text-[#25D366] hover:bg-[#25D366]/20"><MessageCircle className="h-3.5 w-3.5" /></button>
                      <button className="rounded-lg bg-white/5 p-1.5 text-slate-300 hover:bg-white/10"><Phone className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
