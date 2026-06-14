import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import { LEADS } from "@/lib/demo-data";
import { Brain, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { ResponsiveContainer, RadialBarChart, RadialBar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/ai-intelligence")({
  head: () => ({ meta: [{ title: "AI Lead Intelligence — مسار" }, { name: "description", content: "تقييم وتوقع نوايا العملاء بالذكاء الاصطناعي." }] }),
  component: AIPage,
});

function AIPage() {
  const sorted = [...LEADS].sort((a, b) => b.score - a.score);
  const hot = sorted.slice(0, 6);
  const atRisk = sorted.filter(l => l.intent === "Low" && !["Won", "Lost"].includes(l.stage)).slice(0, 5);

  const scoreBuckets = [
    { range: "0-30", count: LEADS.filter(l => l.score < 30).length },
    { range: "30-50", count: LEADS.filter(l => l.score >= 30 && l.score < 50).length },
    { range: "50-70", count: LEADS.filter(l => l.score >= 50 && l.score < 70).length },
    { range: "70-85", count: LEADS.filter(l => l.score >= 70 && l.score < 85).length },
    { range: "85-100", count: LEADS.filter(l => l.score >= 85).length },
  ];

  const intentData = [
    { name: "High", value: LEADS.filter(l => l.intent === "High").length, fill: "#25D366" },
    { name: "Medium", value: LEADS.filter(l => l.intent === "Medium").length, fill: "#f59e0b" },
    { name: "Low", value: LEADS.filter(l => l.intent === "Low").length, fill: "#f43f5e" },
  ];

  return (
    <AppShell title="AI Lead Intelligence" subtitle="ذكاء العملاء — تنبؤات وتوصيات">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="عملاء حارّون" value={hot.length.toString()} delta="جاهزون للإغلاق" />
        <Stat label="معدل دقة التنبؤ" value="92%" delta="آخر 30 يوم" accent="#60a5fa" />
        <Stat label="فرص جديدة (24س)" value="14" delta="تم اكتشافها بالـ AI" accent="#a78bfa" />
        <Stat label="مخاطر فقدان" value={atRisk.length.toString()} delta="تحتاج تدخل" accent="#f43f5e" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-[#25D366]" />
            <h3 className="font-semibold">توزيع Lead Score</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={scoreBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0f141b", border: "1px solid #1f2937", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#25D366" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-4">نوايا الشراء</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="35%" outerRadius="100%" data={intentData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" background cornerRadius={8} />
                <Tooltip contentStyle={{ background: "#0f141b", border: "1px solid #1f2937", borderRadius: 8 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 mt-2 text-xs">
            {intentData.map(d => (
              <span key={d.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: d.fill }} /> {d.name}: {d.value}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="font-semibold">أعلى العملاء أولوية</h3>
          </div>
          <div className="space-y-2">
            {hot.map(l => (
              <div key={l.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 p-3">
                <div>
                  <div className="text-sm font-medium">{l.name}</div>
                  <div className="text-[11px] text-slate-500">{l.source} · {l.city}</div>
                </div>
                <div className="text-left">
                  <div className="text-[#25D366] font-bold">{l.score}</div>
                  <Badge tone="green">{l.intent}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <h3 className="font-semibold">مخاطر فقدان — تدخّل مطلوب</h3>
          </div>
          <div className="space-y-2">
            {atRisk.map(l => (
              <div key={l.id} className="rounded-xl bg-rose-500/[0.04] border border-rose-500/10 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{l.name}</div>
                  <Badge tone="red">خطر {100 - l.score}%</Badge>
                </div>
                <div className="mt-2 flex items-start gap-2 text-xs text-slate-300">
                  <Brain className="h-3.5 w-3.5 text-[#25D366] mt-0.5 shrink-0" />
                  <span>توصية AI: أرسل عرض خصم 10% + اتصال مباشر خلال 24 ساعة.</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
