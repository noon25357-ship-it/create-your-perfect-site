import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Card, Stat } from "@/components/app/AppShell";
import { REVENUE_TREND } from "@/lib/demo-data";
import { Sparkles, ArrowUpRight, ArrowDownRight, Lightbulb } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/ai-summary")({
  head: () => ({ meta: [{ title: "AI Summary — LeadFlow" }, { name: "description", content: "ملخص ذكي يومي لأداء فريق المبيعات." }] }),
  component: AISummaryPage,
});

function AISummaryPage() {
  return (
    <AppShell title="AI Summary" subtitle="ملخص اليوم — مولّد بالذكاء الاصطناعي">
      <Card className="mb-6 bg-gradient-to-br from-[#25D366]/10 via-[#0f141b] to-[#0f141b] border-[#25D366]/20">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-[#25D366]/15 p-2.5">
            <Sparkles className="h-5 w-5 text-[#25D366]" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#25D366] font-medium mb-1">ملخص ذكي — اليوم</div>
            <p className="text-slate-200 leading-relaxed">
              قام فريقك بإغلاق <b className="text-[#25D366]">7 صفقات</b> بقيمة إجمالية <b>284,500 ر.س</b> اليوم،
              بنمو <b className="text-emerald-400">+18%</b> مقارنة بالأمس. <b>محمد العتيبي</b> كان الأعلى أداءً
              بـ 3 صفقات مكسوبة، بينما لُوحظ <b className="text-rose-400">انخفاض 12%</b> في معدل الرد على
              عملاء قناة Instagram — يُوصى بمراجعة قوالب الردود الآلية.
            </p>
            <div className="mt-3 text-xs text-slate-500">آخر تحديث: قبل دقيقتين · تم تحليل 1,284 رسالة</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="إيرادات اليوم" value="284.5k" delta="+18% vs أمس" />
        <Stat label="صفقات مكسوبة" value="7" delta="+2 صفقات" accent="#34d399" />
        <Stat label="رسائل معالجة" value="1,284" delta="بواسطة AI" accent="#60a5fa" />
        <Stat label="رضا العملاء" value="4.7/5" delta="+0.2 هذا الأسبوع" accent="#a78bfa" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold mb-4">الإيرادات — آخر 8 أشهر (ألف ر.س)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={REVENUE_TREND}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#25D366" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#25D366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="m" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0f141b", border: "1px solid #1f2937", borderRadius: 8 }} />
                <Area type="monotone" dataKey="v" stroke="#25D366" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3">أهم المؤشرات</h3>
          <div className="space-y-3">
            {[
              { l: "معدل التحويل", v: "24.6%", up: true, d: "+3.1%" },
              { l: "متوسط زمن الرد", v: "1.4د", up: true, d: "-22%" },
              { l: "معدل الإغلاق", v: "31%", up: true, d: "+4%" },
              { l: "تكلفة الـ Lead", v: "42 ر.س", up: false, d: "+6%" },
            ].map(k => (
              <div key={k.l} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 p-3">
                <div>
                  <div className="text-xs text-slate-400">{k.l}</div>
                  <div className="text-lg font-bold mt-0.5">{k.v}</div>
                </div>
                <div className={`flex items-center gap-1 text-xs ${k.up ? "text-emerald-400" : "text-rose-400"}`}>
                  {k.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {k.d}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <h3 className="font-semibold">توصيات الذكاء الاصطناعي</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { t: "زِد متابعة عملاء Instagram", d: "أرسل قالب متابعة خلال 2 ساعة لرفع التحويل بـ +14%." },
            { t: "فعّل عرض Pro السنوي", d: "8 عملاء في مرحلة Negotiation يستجيبون للعروض السنوية." },
            { t: "أعد تدريب نموذج الردود", d: "تحسّن دقة الرد الآلي بـ +9% بعد إضافة 120 محادثة جديدة." },
          ].map((r, i) => (
            <div key={i} className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
              <div className="text-sm font-medium mb-1">{r.t}</div>
              <div className="text-xs text-slate-400 leading-relaxed">{r.d}</div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
