import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import {
  Sparkles, TrendingUp, DollarSign, Target, Trophy, AlertTriangle, Flame,
  GitBranch, Brain, Calendar, CheckCircle2, Clock, Users, Activity, ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, LineChart, Line,
} from "recharts";

export const Route = createFileRoute("/executive-dashboard")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — LeadFlow" },
      { name: "description", content: "لوحة تنفيذية شاملة لأداء المبيعات والإيرادات." },
    ],
  }),
  component: ExecutivePage,
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

function SectionHeader({ icon: Icon, title, subtitle, tone = "#25D366" }: any) {
  return (
    <div className="mt-8 mb-4 flex items-center gap-2">
      <div className="rounded-lg p-2" style={{ background: `${tone}26` }}>
        <Icon className="h-4 w-4" style={{ color: tone }} />
      </div>
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

function ExecutivePage() {
  return (
    <AppShell
      title="Executive Dashboard"
      subtitle="لمحة تنفيذية شاملة — للمدير، الشريك، والمستثمر"
      actions={
        <button className="hidden md:inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-black hover:brightness-110">
          <ArrowUpRight className="h-4 w-4" /> تصدير PDF
        </button>
      }
    >
      {/* AI Executive Summary */}
      <Card className="mb-6 bg-gradient-to-br from-[#25D366]/10 via-[#0f141b] to-[#0f141b] border-[#25D366]/20">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-[#25D366]/15 p-2.5">
            <Sparkles className="h-5 w-5 text-[#25D366]" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#25D366] font-medium mb-1">AI Executive Summary — اليوم</div>
            <p className="text-slate-200 leading-relaxed">
              فريق المبيعات أغلق <b className="text-[#25D366]">7 صفقات</b> بقيمة <b>284,500 ر.س</b> بنمو
              <b className="text-emerald-400"> +18%</b> مقارنة بالأمس. توقعات الإيراد للشهر <b>1.84M ر.س</b>
              مع احتمالية تجاوز الهدف بـ <b className="text-emerald-400">+12%</b>. لُوحظ تعثر
              <b className="text-amber-400"> 62%</b> من الصفقات في مرحلة Proposal — التوصية: تفعيل أتمتة
              المتابعة خلال 48 ساعة. <b className="text-rose-400">9 عملاء ساخنين</b> يحتاجون تدخل اليوم.
            </p>
            <div className="mt-3 text-xs text-slate-500">آخر تحديث: قبل دقيقتين · تم تحليل 1,284 رسالة و 312 صفقة</div>
          </div>
        </div>
      </Card>

      {/* Core KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
        <Stat label="إيرادات اليوم" value="284.5k" delta="+18% vs أمس" />
        <Stat label="صفقات مكسوبة" value="7" delta="+2 صفقات" accent="#34d399" />
        <Stat label="رسائل معالجة" value="1,284" delta="بواسطة AI" accent="#60a5fa" />
        <Stat label="رضا العملاء" value="4.7/5" delta="+0.2 هذا الأسبوع" accent="#a78bfa" />
      </div>

      {/* Revenue Intelligence */}
      <SectionHeader icon={TrendingUp} title="Revenue Intelligence" subtitle="تحليل الإيرادات والتنبؤ بالأداء — مدعوم بـ AI" />

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
        <Stat label="Expected Revenue" value="1.84M" delta="ر.س — هذا الشهر" />
        <Stat label="Pipeline Value" value="4.62M" delta="ر.س مفتوحة" accent="#60a5fa" />
        <Stat label="Forecast 30D" value="2.31M" delta="+22% توقع AI" accent="#a78bfa" />
        <Stat label="Avg Deal Size" value="48.7k" delta="+5.2%" accent="#fbbf24" />
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
            { i: GitBranch, t: "أكثر مرحلة تعثر", v: "Proposal Sent", d: "62% من الصفقات تتوقف هنا — أرسل متابعة خلال 48 ساعة." },
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Top Hot Leads */}
      <SectionHeader icon={Flame} title="Top Hot Leads" subtitle="أعلى العملاء قيمةً وحرارة الآن" tone="#fb7185" />
      <Card className="mb-2">
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

      {/* Tasks + Meetings */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <SectionHeader icon={AlertTriangle} title="Tasks Requiring Attention" subtitle="مهام عاجلة تستدعي تدخلك" tone="#fbbf24" />
          <Card>
            <div className="space-y-2">
              {[
                { t: "متابعة عرض شركة الرواد", o: "محمد العتيبي", due: "اليوم 3:00م", p: "high" },
                { t: "إعادة تأكيد موعد مجموعة نخبة", o: "نورة السبيعي", due: "اليوم 5:30م", p: "high" },
                { t: "إرسال عقد ميديا برو", o: "فهد الزهراني", due: "غداً", p: "med" },
                { t: "تجديد اشتراك شركة الأفق", o: "محمد العتيبي", due: "خلال يومين", p: "med" },
                { t: "مراجعة 12 محادثة بدون رد", o: "AI Bot", due: "متأخر", p: "high" },
              ].map((x, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge tone={x.p === "high" ? "red" : "yellow"}>{x.p === "high" ? "عاجل" : "متوسط"}</Badge>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{x.t}</div>
                      <div className="text-[11px] text-slate-500">{x.o}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" /> {x.due}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <SectionHeader icon={Calendar} title="Upcoming Meetings" subtitle="الاجتماعات القادمة هذا الأسبوع" tone="#60a5fa" />
          <Card>
            <div className="space-y-2">
              {[
                { t: "Demo — شركة الرواد", w: "خالد الحربي", time: "اليوم 4:00م", who: "محمد العتيبي" },
                { t: "Negotiation — مجموعة نخبة", w: "سارة المطيري", time: "غداً 11:00ص", who: "نورة السبيعي" },
                { t: "Discovery — ميديا برو", w: "عبدالله القحطاني", time: "الأربعاء 2:00م", who: "فهد الزهراني" },
                { t: "Renewal — شركة الأفق", w: "ريم العمري", time: "الخميس 10:00ص", who: "محمد العتيبي" },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 p-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{m.t}</div>
                    <div className="text-[11px] text-slate-500">{m.w} · {m.who}</div>
                  </div>
                  <Badge tone="blue">{m.time}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recently Won */}
      <SectionHeader icon={Trophy} title="Recently Won Deals" subtitle="آخر الصفقات المغلقة بنجاح" tone="#34d399" />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-400 border-b border-white/5">
              <tr>
                <th className="text-right py-2 px-3">العميل</th>
                <th className="text-right py-2 px-3">الشركة</th>
                <th className="text-right py-2 px-3">القيمة</th>
                <th className="text-right py-2 px-3">المندوب</th>
                <th className="text-right py-2 px-3">المصدر</th>
                <th className="text-right py-2 px-3">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {[
                { n: "بدر العنزي", c: "ركن التقنية", v: "124,500", a: "محمد العتيبي", src: "WhatsApp Ads", d: "اليوم" },
                { n: "هند الشهراني", c: "نوفا للإعلان", v: "86,000", a: "نورة السبيعي", src: "Instagram", d: "اليوم" },
                { n: "ماجد القرني", c: "إبداع للحلول", v: "212,000", a: "محمد العتيبي", src: "Referral", d: "أمس" },
                { n: "لمى الدوسري", c: "مدى المستقبل", v: "58,300", a: "فهد الزهراني", src: "Website", d: "أمس" },
                { n: "تركي الغامدي", c: "أوج التطوير", v: "175,000", a: "نورة السبيعي", src: "WhatsApp Ads", d: "قبل يومين" },
              ].map((w, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="py-2.5 px-3 font-medium">{w.n}</td>
                  <td className="py-2.5 px-3 text-slate-400">{w.c}</td>
                  <td className="py-2.5 px-3 text-emerald-300 font-semibold">{w.v} ر.س</td>
                  <td className="py-2.5 px-3 text-slate-300">{w.a}</td>
                  <td className="py-2.5 px-3"><Badge tone="blue">{w.src}</Badge></td>
                  <td className="py-2.5 px-3 text-slate-400 text-xs">{w.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 5 صفقات بقيمة 655,800 ر.س</div>
          <div className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> آخر 48 ساعة</div>
        </div>
      </Card>
    </AppShell>
  );
}
