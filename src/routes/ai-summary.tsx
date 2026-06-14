import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import { REVENUE_TREND } from "@/lib/demo-data";
import {
  Sparkles, ArrowUpRight, ArrowDownRight, Lightbulb, TrendingUp, DollarSign,
  Target, Trophy, AlertTriangle, Flame, GitBranch, Brain,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, LineChart, Line,
} from "recharts";

export const Route = createFileRoute("/ai-summary")({
  head: () => ({ meta: [{ title: "AI Summary — مسار" }, { name: "description", content: "ملخص ذكي يومي لأداء فريق المبيعات." }] }),
  component: AISummaryPage,
});

const FORECAST_30D = [
  { d: "W1", actual: 284, forecast: 280 },
  { d: "W2", actual: 312, forecast: 305 },
  { d: "W3", actual: 348, forecast: 340 },
  { d: "W4", actual: 0, forecast: 395 },
];
const LOST_REASONS = [
  { r: "السعر مرتفع", v: 38 },
  { r: "تأخر الرد", v: 24 },
  { r: "اختار منافس", v: 18 },
  { r: "لم يكن جاهزاً", v: 12 },
  { r: "أسباب أخرى", v: 8 },
];

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

      {/* Revenue Intelligence */}
      <div className="mt-8 mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-[#25D366]/15 p-2"><TrendingUp className="h-4 w-4 text-[#25D366]" /></div>
        <div>
          <h2 className="text-lg font-bold">Revenue Intelligence</h2>
          <p className="text-xs text-slate-400">تحليل الإيرادات والتنبؤ بالأداء — مدعوم بـ AI</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
        <Stat label="Expected Revenue" value="1.84M" delta="ر.س — هذا الشهر" />
        <Stat label="Pipeline Value" value="4.62M" delta="ر.س مفتوحة" accent="#60a5fa" />
        <Stat label="Forecast 30D" value="2.31M" delta="+22% توقع AI" accent="#a78bfa" />
        <Stat label="Avg Deal Size" value="48.7k" delta="+5.2% vs السابق" accent="#fbbf24" />
        <Stat label="Win Rate" value="34%" delta="+3% هذا الربع" accent="#34d399" />
        <Stat label="Lost Deals" value="19" delta="-4 vs السابق" accent="#fb7185" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Revenue Forecast — 30 يوم</h3>
            <Badge tone="purple">AI Forecast</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={FORECAST_30D}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="d" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0f141b", border: "1px solid #1f2937", borderRadius: 8 }} />
                <Line type="monotone" dataKey="actual" stroke="#25D366" strokeWidth={2} name="فعلي" dot />
                <Line type="monotone" dataKey="forecast" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5" name="توقع AI" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Lost Deals Analysis</h3>
            <Badge tone="red">19 صفقة</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={LOST_REASONS} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis type="category" dataKey="r" stroke="#94a3b8" fontSize={11} width={80} />
                <Tooltip contentStyle={{ background: "#0f141b", border: "1px solid #1f2937", borderRadius: 8 }} />
                <Bar dataKey="v" fill="#fb7185" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mb-4 bg-gradient-to-br from-violet-500/10 via-[#0f141b] to-[#0f141b] border-violet-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-violet-400" />
          <h3 className="font-semibold">AI Insights — قرارات تنفيذية</h3>
          <Badge tone="purple">مولّد ذكاءً</Badge>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { i: AlertTriangle, t: "أكثر سبب لخسارة الصفقات", v: "السعر مرتفع (38%)", d: "اقترح خطة سنوية بـ 15% خصم لاسترجاع ~6 صفقات شهرياً." },
            { i: GitBranch, t: "أكثر مرحلة يحدث عندها التعثر", v: "Proposal Sent", d: "62% من الصفقات تتوقف هنا — أرسل متابعة خلال 48 ساعة." },
            { i: Target, t: "أفضل مصدر للعملاء", v: "WhatsApp Ads", d: "ROI ×4.2 — زِد الميزانية بـ 30% الشهر القادم." },
            { i: Trophy, t: "أفضل موظف تحويلًا", v: "محمد العتيبي", d: "معدل إغلاق 47% — كرّر أسلوبه عبر تدريب الفريق." },
            { i: DollarSign, t: "أعلى صفقة متوقعة", v: "شركة الرواد — 312k", d: "احتمال إغلاق 78% خلال 7 أيام." },
            { i: Flame, t: "ساخنون يحتاجون تدخل اليوم", v: "9 عملاء", d: "Lead Score > 85 ولم يُرد عليهم منذ +24 ساعة." },
          ].map((x, i) => {
            const Icon = x.i;
            return (
              <div key={i} className="rounded-xl bg-white/[0.03] border border-white/5 p-4 hover:border-violet-500/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white/5 p-2"><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-slate-400">{x.t}</div>
                    <div className="text-sm font-bold mt-0.5 truncate">{x.v}</div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{x.d}</p>
                    <button className="mt-2 text-[11px] text-[#25D366] hover:underline">اتخذ إجراء ←</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-4 w-4 text-rose-400" />
          <h3 className="font-semibold">عملاء ساخنون — تدخل اليوم</h3>
          <Badge tone="red">9 عملاء</Badge>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { n: "خالد الحربي", c: "شركة الرواد", s: 92, last: "قبل 28 ساعة", v: "312k" },
            { n: "سارة المطيري", c: "مجموعة نخبة", s: 89, last: "قبل 30 ساعة", v: "184k" },
            { n: "عبدالله القحطاني", c: "ميديا برو", s: 87, last: "قبل 26 ساعة", v: "96k" },
          ].map((h, i) => (
            <div key={i} className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{h.n}</div>
                  <div className="text-xs text-slate-400">{h.c}</div>
                </div>
                <Badge tone="red">{h.s}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400">آخر رد: {h.last}</span>
                <span className="text-emerald-300 font-semibold">{h.v} ر.س</span>
              </div>
              <button className="mt-3 w-full rounded-lg bg-[#25D366] text-black text-xs font-semibold py-2 hover:brightness-110">
                تواصل الآن
              </button>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
