import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import { LEADS, CONTACTS } from "@/lib/demo-data";
import { useInboxStore } from "@/lib/inbox-store";
import { useMemo, useState } from "react";
import { Filter, Plus, Phone, MessageCircle, Sparkles, Target, Zap } from "lucide-react";

export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "CRM — LeadFlow" }, { name: "description", content: "إدارة علاقات العملاء بذكاء WhatsApp." }] }),
  component: CRMPage,
});

function CRMPage() {
  const store = useInboxStore();
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

      <Card className="mb-6 border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/[0.04] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#25D366]/15 p-1.5">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">جهات اتصال من Inbox</h3>
              <p className="text-[11px] text-slate-500">تُنشأ تلقائياً عند بدء أي محادثة WhatsApp</p>
            </div>
          </div>
          <Link to="/inbox" className="text-xs text-[#25D366] hover:underline">فتح Inbox ←</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {CONTACTS.map(c => (
            <div key={c.id} className="rounded-xl border border-white/5 bg-[#0a0d12] p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#25D366] to-emerald-700 flex items-center justify-center text-xs font-bold text-black shrink-0">
                    {c.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.phone} · {c.city}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge tone="blue">{c.source}</Badge>
                  <span className="text-[10px] text-slate-500">{c.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500"><Zap className="h-3 w-3" /> Lead Score</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#25D366]" style={{ width: `${c.score}%` }} />
                    </div>
                    <span className="text-xs font-bold text-[#25D366]">{c.score}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500"><Target className="h-3 w-3" /> Intent</div>
                  <div className="mt-1.5">
                    <Badge tone={c.intent === "High" ? "green" : c.intent === "Medium" ? "yellow" : "red"}>
                      {c.intent === "High" ? "عالي" : c.intent === "Medium" ? "متوسط" : "منخفض"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-violet-500/[0.05] border border-violet-500/15 p-2.5 mb-2">
                <div className="flex items-center gap-1 text-[10px] text-violet-300 mb-1">
                  <Sparkles className="h-3 w-3" /> AI Summary
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{c.summary}</p>
              </div>

              <div className="rounded-lg bg-[#25D366]/[0.06] border border-[#25D366]/20 p-2.5 mb-3">
                <div className="text-[10px] text-[#25D366] mb-1">Next Action</div>
                <p className="text-xs text-slate-100">{c.nextAction}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">قيمة الصفقة: <b className="text-slate-300">{c.value.toLocaleString()} ر.س</b></span>
                <div className="flex gap-1.5">
                  <Link
                    to="/inbox"
                    className="rounded-lg bg-[#25D366]/15 px-2.5 py-1 text-[11px] text-[#25D366] hover:bg-[#25D366]/25 flex items-center gap-1"
                  >
                    <MessageCircle className="h-3 w-3" /> فتح المحادثة
                  </Link>
                  <button className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-white/10 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> اتصال
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>


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
