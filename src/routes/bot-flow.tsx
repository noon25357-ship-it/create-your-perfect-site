import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import {
  Bot, Sparkles, MessageSquare, GitBranch, Users, Ticket, Flame, ArrowDown,
  Wand2, CheckCircle2, XCircle, Plus, Play, Phone, ListChecks, Building2,
  Landmark, Stethoscope, Dumbbell, ShoppingBag, Briefcase, Trophy, AlertTriangle,
  TrendingUp, Clock, Target, Send, ChevronLeft, Smartphone,
} from "lucide-react";

export const Route = createFileRoute("/bot-flow")({
  head: () => ({
    meta: [
      { title: "Bot Flow — LeadFlow" },
      { name: "description", content: "AI Bot Flow Builder with templates, lead scoring and WhatsApp preview." },
    ],
  }),
  component: BotFlowPage,
});

/* ---------------- Data ---------------- */

const FLOWS = [
  {
    id: "f1", name: "تأهيل عملاء عقار", runs: 1240, completed: 812, dropped: 220, avgMin: 3.4,
    handover: 142, hot: 198, tickets: 167, conv: 26.4,
  },
  { id: "f2", name: "تمويل عقاري", runs: 860, completed: 540, dropped: 180, avgMin: 4.1, handover: 90, hot: 134, tickets: 102, conv: 22.1 },
  { id: "f3", name: "حجز موعد عيادة", runs: 2120, completed: 1740, dropped: 210, avgMin: 2.1, handover: 60, hot: 88, tickets: 320, conv: 41.2 },
];

const TEMPLATES = [
  { id: "real-estate", name: "عقار", icon: Building2, desc: "ميزانية، منطقة، نوع العقار، موعد معاينة", tone: "green" as const },
  { id: "mortgage", name: "تمويل عقاري", icon: Landmark, desc: "الدخل، الالتزامات، نوع التمويل", tone: "blue" as const },
  { id: "clinic", name: "عيادات", icon: Stethoscope, desc: "التخصص، الوقت المناسب، التأمين", tone: "purple" as const },
  { id: "training", name: "مراكز تدريب", icon: Dumbbell, desc: "نوع الدورة، المستوى، تاريخ البدء", tone: "yellow" as const },
  { id: "ecom", name: "متاجر إلكترونية", icon: ShoppingBag, desc: "المنتج، الكمية، طريقة الدفع", tone: "red" as const },
  { id: "services", name: "شركات خدمات", icon: Briefcase, desc: "نوع الخدمة، النطاق، الميزانية", tone: "default" as const },
];

const NODES = [
  { id: "n1", kind: "Trigger", title: "بدء المحادثة", desc: "أول رسالة من العميل على واتساب", tone: "green" as const, icon: Play },
  { id: "n2", kind: "Message", title: "ترحيب", desc: "أهلاً بك في عقارات اللؤلؤة 🏡 كيف أقدر أساعدك؟", tone: "blue" as const, icon: MessageSquare },
  { id: "n3", kind: "Question", title: "نوع العقار؟", desc: "Quick Reply: شقة • فيلا • أرض", tone: "blue" as const, icon: ListChecks, crm: "Property Type" },
  { id: "n4", kind: "Question", title: "المدينة؟", desc: "إدخال نصي", tone: "blue" as const, icon: MessageSquare, crm: "City" },
  { id: "n5", kind: "Question", title: "الميزانية؟", desc: "أقل من 500k • 500k–1M • أكثر من 1M", tone: "blue" as const, icon: MessageSquare, crm: "Budget" },
  { id: "n6", kind: "Condition", title: "ميزانية > 1M؟", desc: "If Budget > 1,000,000 SAR", tone: "yellow" as const, icon: GitBranch },
  { id: "n7", kind: "Action", title: "Lead Score +50", desc: "تحديث تقييم العميل تلقائياً", tone: "purple" as const, icon: TrendingUp },
  { id: "n8", kind: "Action", title: "حجز معاينة", desc: "إنشاء تذكرة + إشعار الفريق", tone: "red" as const, icon: Ticket },
  { id: "n9", kind: "Handover", title: "تحويل للمندوب", desc: "تعيين أفضل مندوب متاح", tone: "red" as const, icon: Users },
];

const AI_SUGGESTIONS = [
  { icon: AlertTriangle, text: "العملاء يخرجون عند سؤال \"الميزانية\" بنسبة 18% — جرّب صيغة أقل مباشرة", tone: "yellow" as const },
  { icon: Sparkles, text: "أضف سؤال \"طريقة الدفع\" لزيادة جودة التأهيل (+12% تحويل متوقع)", tone: "green" as const },
  { icon: Target, text: "أضف عقدة Quick Reply بدل النص الحر في خطوة \"المدينة\" لتقليل الأخطاء", tone: "blue" as const },
  { icon: TrendingUp, text: "إضافة Follow-up بعد 24 ساعة للعملاء الذين لم يكملوا الفلو يرفع الإكمال 21%", tone: "purple" as const },
  { icon: Flame, text: "اقتراح عقدة جديدة: \"هل تريد تمويل؟\" لرفع التحويل لـ Hot Leads", tone: "red" as const },
];

const SCORING_RULES = [
  { cond: "الميزانية > مليون ريال", pts: 20 },
  { cond: "طلب معاينة عقار", pts: 30 },
  { cond: "حدد منطقة معينة", pts: 15 },
  { cond: "يحتاج تمويل عقاري", pts: 10 },
  { cond: "رد خلال أقل من 5 دقائق", pts: 10 },
  { cond: "زار أكثر من 3 منتجات", pts: 15 },
];

const COMPETITORS = [
  { feature: "Flow Builder", inf: true, uni: true, lf: true },
  { feature: "AI Lead Scoring", inf: false, uni: false, lf: true },
  { feature: "CRM متكامل", inf: false, uni: false, lf: true },
  { feature: "Pipeline حي", inf: false, uni: false, lf: true },
  { feature: "Campaigns", inf: false, uni: true, lf: true },
  { feature: "AI Sales Intelligence", inf: false, uni: false, lf: true },
  { feature: "Tickets", inf: false, uni: false, lf: true },
  { feature: "Revenue Intelligence", inf: false, uni: false, lf: true },
  { feature: "Executive Dashboard", inf: false, uni: false, lf: true },
];

/* ---------------- Helpers ---------------- */

function NodeBlock({ n }: { n: (typeof NODES)[number] }) {
  const Icon = n.icon;
  const ring: Record<string, string> = {
    green: "ring-emerald-500/30 bg-emerald-500/5",
    yellow: "ring-amber-500/30 bg-amber-500/5",
    blue: "ring-sky-500/30 bg-sky-500/5",
    purple: "ring-violet-500/30 bg-violet-500/5",
    red: "ring-rose-500/30 bg-rose-500/5",
    default: "ring-white/10 bg-white/5",
  };
  return (
    <div className={`rounded-xl ring-1 ${ring[n.tone]} p-3 w-full max-w-md`}>
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white/10 p-2"><Icon className="h-4 w-4" /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge tone={n.tone}>{n.kind}</Badge>
            <span className="text-sm font-semibold truncate">{n.title}</span>
            {"crm" in n && n.crm && <Badge tone="default">CRM: {n.crm}</Badge>}
          </div>
          <p className="text-xs text-slate-400 mt-1">{n.desc}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

function BotFlowPage() {
  const [selectedId, setSelectedId] = useState(FLOWS[0].id);
  const selected = FLOWS.find((f) => f.id === selectedId)!;
  const [prompt, setPrompt] = useState("أبغى بوت عقاري يجمع الميزانية والمنطقة ويحجز معاينة");
  const [generated, setGenerated] = useState(false);

  return (
    <AppShell
      title="Bot Flow"
      subtitle="منشئ تدفقات بوت WhatsApp مدعوم بـ AI — تأهيل + تحويل + تكامل CRM"
      actions={
        <button
          onClick={() => toast.success("تم حفظ الفلو")}
          className="hidden md:inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> فلو جديد
        </button>
      }
    >
      {/* Flow selector + analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <div className="lg:col-span-3 space-y-2">
          <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#25D366]" /> Flows
          </h3>
          {FLOWS.map((f) => {
            const active = f.id === selectedId;
            return (
              <button key={f.id} onClick={() => setSelectedId(f.id)}
                className={`w-full text-right rounded-xl border p-3 ${active ? "border-[#25D366]/40 bg-[#25D366]/5" : "border-white/5 bg-[#0f141b] hover:border-white/10"}`}>
                <div className="text-sm font-semibold">{f.name}</div>
                <div className="text-[11px] text-slate-500 mt-1">{f.runs} تشغيل • {f.conv}% تحويل</div>
              </button>
            );
          })}
        </div>
        <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="مرات التشغيل" value={`${selected.runs}`} delta="آخر 30 يوم" />
          <Stat label="أكملوا الفلو" value={`${selected.completed}`} delta={`${Math.round(selected.completed/selected.runs*100)}%`} accent="#60a5fa" />
          <Stat label="خرجوا قبل النهاية" value={`${selected.dropped}`} delta="Drop-off" accent="#fb7185" />
          <Stat label="متوسط وقت الإكمال" value={`${selected.avgMin} د`} delta="Avg time" accent="#fbbf24" />
          <Stat label="تحويل للموظف" value={`${selected.handover}`} delta="Handover" accent="#a78bfa" />
          <Stat label="Hot Leads" value={`${selected.hot}`} delta="عملاء ساخنون" accent="#f97316" />
          <Stat label="تذاكر مفتوحة" value={`${selected.tickets}`} delta="Tickets" accent="#22d3ee" />
          <Stat label="نسبة التحويل" value={`${selected.conv}%`} delta="Conversion" accent="#25D366" />
        </div>
      </div>

      {/* AI Flow Generator */}
      <Card className="mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="rounded-xl bg-[#25D366]/15 p-2 ring-1 ring-[#25D366]/30"><Wand2 className="h-4 w-4 text-[#25D366]" /></div>
          <div>
            <h3 className="font-semibold">AI Flow Generator</h3>
            <p className="text-xs text-slate-400">اكتب وصف البوت وسيقوم الـ AI ببناء Flow كامل تلقائياً</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2.5 text-sm outline-none focus:ring-[#25D366]/40" />
          <button onClick={() => { setGenerated(true); toast.success("تم توليد الفلو بنجاح ✨"); }}
            className="rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> توليد بالـ AI
          </button>
        </div>
        {generated && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-2 text-[11px]">
            {["الرسائل", "الأسئلة", "الشروط", "التذاكر", "CRM Mapping", "Lead Score"].map((t) => (
              <div key={t} className="rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 px-2 py-2 text-center text-emerald-300">
                <CheckCircle2 className="h-3 w-3 inline ml-1" /> {t}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Templates */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2"><ListChecks className="h-4 w-4 text-[#25D366]" /> قوالب تأهيل جاهزة</h3>
          <span className="text-[11px] text-slate-500">6 قوالب</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => toast.success(`تم تحميل قالب: ${t.name}`)}
                className="text-right rounded-xl border border-white/5 bg-[#0f141b] p-3 hover:border-[#25D366]/30 transition">
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-white/5 p-2"><Icon className="h-4 w-4 text-[#25D366]" /></div>
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>
                <p className="text-[11px] text-slate-400">{t.desc}</p>
                <div className="mt-2 text-[11px] text-[#25D366]">استخدم القالب →</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Builder + WhatsApp Preview + Sidebar */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        {/* Builder */}
        <div className="col-span-12 lg:col-span-5">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><GitBranch className="h-4 w-4 text-[#25D366]" /> Flow Builder</h3>
              <button onClick={() => toast.success("تمت إضافة عقدة (Demo)")}
                className="rounded-lg ring-1 ring-white/10 px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> أضف عقدة
              </button>
            </div>
            <div className="rounded-2xl bg-[#0a0d12] ring-1 ring-white/5 p-4 max-h-[560px] overflow-auto">
              <div className="flex flex-col items-center gap-1">
                {NODES.map((n, i) => (
                  <div key={n.id} className="w-full flex flex-col items-center">
                    <NodeBlock n={n} />
                    {i < NODES.length - 1 && <ArrowDown className="h-4 w-4 text-slate-600 my-1" />}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* AI Suggestions */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#25D366]" /> AI Suggestions
            </h3>
            <div className="space-y-2">
              {AI_SUGGESTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-start gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                    <Icon className="h-4 w-4 mt-0.5 text-[#25D366]" />
                    <div className="text-xs text-slate-300 flex-1">{s.text}</div>
                    <Badge tone={s.tone}>اقتراح</Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Phone className="h-4 w-4 text-[#25D366]" /> Human Handover
            </h3>
            <p className="text-xs text-slate-400 mb-3">عند أي نقطة في الفلو يمكن تفعيل:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["تحويل للموظف", "فتح تذكرة", "إشعار الفريق", "تعيين Agent"].map((t) => (
                <div key={t} className="rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> {t}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* WhatsApp Preview */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="!p-3">
            <h3 className="font-semibold flex items-center gap-2 mb-3 px-2 pt-1">
              <Smartphone className="h-4 w-4 text-[#25D366]" /> WhatsApp Preview
            </h3>
            <div className="rounded-2xl bg-[#0a0f0a] ring-1 ring-white/10 overflow-hidden">
              <div className="bg-[#075E54] px-3 py-2 flex items-center gap-2">
                <ChevronLeft className="h-4 w-4 text-white" />
                <div className="h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center text-[10px] font-bold">LF</div>
                <div className="text-white text-xs">
                  <div className="font-semibold">LeadFlow Bot</div>
                  <div className="text-[10px] opacity-80">يكتب الآن...</div>
                </div>
              </div>
              <div className="bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><circle cx=%221%22 cy=%221%22 r=%221%22 fill=%22%23153%22/></svg>')] p-3 space-y-2 min-h-[360px] text-[11px]">
                <div className="bg-white/95 text-slate-900 rounded-lg px-2 py-1.5 max-w-[80%]">أهلاً بك في عقارات اللؤلؤة 🏡</div>
                <div className="bg-white/95 text-slate-900 rounded-lg px-2 py-1.5 max-w-[80%]">ما نوع العقار الذي تبحث عنه؟</div>
                <div className="flex flex-wrap gap-1 max-w-[85%]">
                  {["شقة", "فيلا", "أرض"].map((q) => (
                    <span key={q} className="rounded-full bg-white/90 text-[#075E54] text-[10px] px-2 py-1 ring-1 ring-[#075E54]/20">{q}</span>
                  ))}
                </div>
                <div className="bg-[#DCF8C6] text-slate-900 rounded-lg px-2 py-1.5 max-w-[80%] ml-auto">فيلا</div>
                <div className="bg-white/95 text-slate-900 rounded-lg px-2 py-1.5 max-w-[80%]">في أي مدينة؟</div>
                <div className="bg-[#DCF8C6] text-slate-900 rounded-lg px-2 py-1.5 max-w-[80%] ml-auto">الرياض</div>
                <div className="bg-white/95 text-slate-900 rounded-lg px-2 py-1.5 max-w-[80%]">كم ميزانيتك التقريبية؟</div>
                <div className="flex flex-wrap gap-1 max-w-[85%]">
                  {["< 500k", "500k–1M", "> 1M"].map((q) => (
                    <span key={q} className="rounded-full bg-white/90 text-[#075E54] text-[10px] px-2 py-1 ring-1 ring-[#075E54]/20">{q}</span>
                  ))}
                </div>
              </div>
              <div className="bg-[#0a0f0a] px-3 py-2 flex items-center gap-2 border-t border-white/5">
                <div className="flex-1 rounded-full bg-white/5 px-3 py-1.5 text-[11px] text-slate-500">رسالة</div>
                <div className="h-7 w-7 rounded-full bg-[#25D366] flex items-center justify-center"><Send className="h-3.5 w-3.5 text-black" /></div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CRM Mapping + Lead Scoring */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-12 lg:col-span-6">
          <Card>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-[#25D366]" /> CRM Mapping
            </h3>
            <p className="text-xs text-slate-400 mb-3">كل خطوة في الفلو مرتبطة بحقل في الـ CRM</p>
            <div className="space-y-2 text-xs">
              {[
                ["المدينة", "City"],
                ["الميزانية", "Budget"],
                ["نوع العقار", "Property Type"],
                ["عدد الغرف", "Bedrooms"],
                ["طريقة الدفع", "Payment Method"],
                ["موعد المعاينة", "Appointment Date"],
              ].map(([a, b]) => (
                <div key={a} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-slate-300">{a}</span>
                  <span className="text-slate-500">→</span>
                  <Badge tone="green">{b}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <Card>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Flame className="h-4 w-4 text-[#25D366]" /> AI Lead Scoring Rules
            </h3>
            <p className="text-xs text-slate-400 mb-3">يتم احتساب Score تلقائياً بناءً على هذه القواعد</p>
            <div className="space-y-2 text-xs">
              {SCORING_RULES.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-slate-300">{r.cond}</span>
                  <Badge tone="green">+{r.pts}</Badge>
                </div>
              ))}
            </div>
            <button onClick={() => toast.success("تمت إضافة قاعدة جديدة")}
              className="mt-3 w-full rounded-lg border border-dashed border-white/10 py-2 text-xs text-slate-400 hover:border-[#25D366]/40 hover:text-[#25D366] flex items-center justify-center gap-2">
              <Plus className="h-3.5 w-3.5" /> أضف قاعدة
            </button>
          </Card>
        </div>
      </div>

      {/* Competitive Advantage */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Trophy className="h-4 w-4 text-[#25D366]" /> الميزة التنافسية</h3>
            <p className="text-xs text-slate-400 mt-1">LeadFlow ليس Flow Builder فقط — بل منظومة متكاملة من المحادثة حتى الإيراد</p>
          </div>
          <Badge tone="green">All-in-one</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-white/5">
                <th className="text-right py-2 px-3">الميزة</th>
                <th className="text-center py-2 px-3">Infoseed</th>
                <th className="text-center py-2 px-3">Unifonic</th>
                <th className="text-center py-2 px-3 text-[#25D366]">LeadFlow</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map((c, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2.5 px-3 text-slate-200">{c.feature}</td>
                  <td className="py-2.5 px-3 text-center">{c.inf ? <CheckCircle2 className="h-4 w-4 text-emerald-400 inline" /> : <XCircle className="h-4 w-4 text-rose-400/70 inline" />}</td>
                  <td className="py-2.5 px-3 text-center">{c.uni ? <CheckCircle2 className="h-4 w-4 text-emerald-400 inline" /> : <XCircle className="h-4 w-4 text-rose-400/70 inline" />}</td>
                  <td className="py-2.5 px-3 text-center bg-[#25D366]/5">{c.lf ? <CheckCircle2 className="h-4 w-4 text-[#25D366] inline" /> : <XCircle className="h-4 w-4 text-rose-400 inline" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-xl bg-[#25D366]/5 ring-1 ring-[#25D366]/20 p-4 text-xs text-slate-300 leading-relaxed">
          <span className="text-[#25D366] font-semibold">الفرق الأساسي:</span> LeadFlow يربط
          <Badge tone="green"> Bot Flow</Badge> →
          <Badge tone="blue"> AI Agent</Badge> →
          <Badge tone="purple"> CRM</Badge> →
          <Badge tone="yellow"> Pipeline</Badge> →
          <Badge tone="red"> Tickets</Badge> →
          <Badge tone="green"> Lead Scoring</Badge> →
          <Badge tone="green"> Revenue Dashboard</Badge>
          {" "}كلها داخل منصة واحدة.
        </div>
      </Card>
    </AppShell>
  );
}
