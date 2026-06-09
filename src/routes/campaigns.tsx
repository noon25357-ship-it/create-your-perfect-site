import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import {
  Megaphone, Plus, FileText, Image as ImageIcon, Video, FileType2, Users, Send,
  Calendar, BarChart3, Eye, MousePointerClick, Trophy,
  Library, Layers, Smartphone, ChevronLeft, Inbox, Ticket, Flame, GitBranch,
  Sparkles, Filter, Tag, Building2, Stethoscope, Utensils, MapPin,
} from "lucide-react";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaign Manager — LeadFlow" },
      { name: "description", content: "WhatsApp Business API campaign manager with templates, groups, scheduler and analytics." },
    ],
  }),
  component: CampaignsPage,
});

/* ---------- Types & Data ---------- */

type TemplateKind = "Marketing" | "Utility" | "Authentication";
type MediaKind = "Text" | "Image" | "Video" | "PDF";

const TEMPLATES = [
  { id: "t1", name: "عرض الربيع — عقار", kind: "Marketing" as TemplateKind, media: "Image" as MediaKind, status: "Approved", lang: "ar", updated: "قبل ساعة",
    header: "🌸 عرض الربيع من اللؤلؤة", body: "أهلاً {{1}}، خصم 12% على فلل الرياض حتى نهاية الشهر — احجز معاينتك مجاناً.", footer: "LeadFlow Realty", buttons: ["احجز الآن", "تواصل معنا"] },
  { id: "t2", name: "تأكيد موعد العيادة", kind: "Utility" as TemplateKind, media: "Text" as MediaKind, status: "Approved", lang: "ar", updated: "اليوم",
    header: "تأكيد موعدك", body: "مرحباً {{1}}، موعدك مع د. {{2}} يوم {{3}} الساعة {{4}}.", footer: "LeadFlow Clinics", buttons: ["تأكيد", "إعادة جدولة"] },
  { id: "t3", name: "رمز التحقق", kind: "Authentication" as TemplateKind, media: "Text" as MediaKind, status: "Approved", lang: "ar", updated: "أمس",
    header: "رمز التحقق", body: "رمزك هو {{1}}. لا تشاركه مع أي شخص.", footer: "", buttons: ["نسخ الرمز"] },
  { id: "t4", name: "كتيب المشروع — PDF", kind: "Marketing" as TemplateKind, media: "PDF" as MediaKind, status: "Pending", lang: "ar", updated: "قبل 3 ساعات",
    header: "كتيب مشروع اللؤلؤة", body: "أرفقنا لك كتيب المشروع. تواصل معنا لحجز جلسة استشارية مع مستشار المبيعات.", footer: "", buttons: ["حجز جلسة"] },
  { id: "t5", name: "فيديو ترويجي — مطعم", kind: "Marketing" as TemplateKind, media: "Video" as MediaKind, status: "Approved", lang: "ar", updated: "قبل يومين",
    header: "🎬 افتتاح فرع جديد", body: "زرنا في فرع الرياض الجديد واستمتع بخصم 20% عند ذكر هذه الرسالة.", footer: "LeadFlow Restaurants", buttons: ["اطلب الآن", "العنوان"] },
];

const GROUPS = [
  { id: "g1", name: "Hot Leads", count: 412, icon: Flame, tone: "red" as const },
  { id: "g2", name: "Cold Leads", count: 1830, icon: Filter, tone: "blue" as const },
  { id: "g3", name: "Real Estate", count: 920, icon: Building2, tone: "green" as const },
  { id: "g4", name: "Clinics", count: 540, icon: Stethoscope, tone: "purple" as const },
  { id: "g5", name: "Restaurants", count: 388, icon: Utensils, tone: "yellow" as const },
  { id: "g6", name: "Riyadh", count: 2140, icon: MapPin, tone: "default" as const },
  { id: "g7", name: "Jeddah", count: 1260, icon: MapPin, tone: "default" as const },
];

const CAMPAIGNS = [
  { id: "c1", name: "عرض الربيع — Hot Leads", template: "t1", group: "g1", sent: 412, delivered: 408, read: 372, clicked: 198, replied: 96, converted: 31, status: "Running", date: "اليوم 10:00" },
  { id: "c2", name: "تذكير موعد العيادة", template: "t2", group: "g4", sent: 540, delivered: 540, read: 510, clicked: 240, replied: 180, converted: 142, status: "Completed", date: "أمس" },
  { id: "c3", name: "فيديو افتتاح الفرع", template: "t5", group: "g5", sent: 388, delivered: 380, read: 320, clicked: 156, replied: 64, converted: 22, status: "Scheduled", date: "غداً 18:00" },
  { id: "c4", name: "إعادة تفعيل Cold Leads", template: "t1", group: "g2", sent: 1830, delivered: 1790, read: 1140, clicked: 320, replied: 142, converted: 38, status: "Completed", date: "قبل 3 أيام" },
];

const MEDIA = [
  { id: "m1", kind: "Image" as MediaKind, name: "spring-villa.jpg", size: "1.8 MB" },
  { id: "m2", kind: "Image" as MediaKind, name: "clinic-banner.jpg", size: "920 KB" },
  { id: "m3", kind: "Video" as MediaKind, name: "restaurant-opening.mp4", size: "12.4 MB" },
  { id: "m4", kind: "PDF" as MediaKind, name: "project-brochure.pdf", size: "3.1 MB" },
  { id: "m5", kind: "Image" as MediaKind, name: "training-cover.png", size: "680 KB" },
  { id: "m6", kind: "PDF" as MediaKind, name: "price-list.pdf", size: "540 KB" },
];

const kindTone: Record<string, "green" | "blue" | "purple" | "yellow" | "red" | "default"> = {
  Marketing: "green", Utility: "blue", Authentication: "purple",
};
const statusTone: Record<string, "green" | "yellow" | "blue" | "default"> = {
  Approved: "green", Pending: "yellow", Running: "blue", Completed: "green", Scheduled: "yellow",
};
const mediaIcon: Record<MediaKind, any> = { Text: FileText, Image: ImageIcon, Video: Video, PDF: FileType2 };

/* ---------- Page ---------- */

function CampaignsPage() {
  const [tab, setTab] = useState<"sender" | "groups" | "tree" | "templates" | "exclude" | "history" | "analytics" | "media">("sender");
  const [selectedTplId, setSelectedTplId] = useState(TEMPLATES[0].id);
  const [selectedGroupId, setSelectedGroupId] = useState(GROUPS[0].id);
  const [schedule, setSchedule] = useState("now");

  const selectedTpl = TEMPLATES.find((t) => t.id === selectedTplId)!;
  const selectedGroup = GROUPS.find((g) => g.id === selectedGroupId)!;

  const totals = useMemo(() => CAMPAIGNS.reduce(
    (a, c) => ({
      sent: a.sent + c.sent, delivered: a.delivered + c.delivered, read: a.read + c.read,
      clicked: a.clicked + c.clicked, replied: a.replied + c.replied, converted: a.converted + c.converted,
    }), { sent: 0, delivered: 0, read: 0, clicked: 0, replied: 0, converted: 0 }
  ), []);

  return (
    <AppShell
      title="Campaign Manager"
      subtitle="إدارة حملات WhatsApp Business — Templates، Groups، Scheduler، Analytics"
      actions={
        <button onClick={() => { setTab("sender"); toast.success("ابدأ إنشاء حملة جديدة"); }}
          className="hidden md:inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-black hover:brightness-110">
          <Plus className="h-4 w-4" /> حملة جديدة
        </button>
      }
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-3">
        {[
          { id: "sender", label: "إنشاء حملة", icon: Send },
          { id: "groups", label: "المجموعات", icon: Users },
          { id: "tree", label: "شجرة الجمهور", icon: GitBranch },
          { id: "templates", label: "القوالب", icon: FileText },
          { id: "exclude", label: "قائمة الاستبعاد", icon: Filter },
          { id: "history", label: "سجل الحملات", icon: Megaphone },
          { id: "analytics", label: "تحليلات الحملة", icon: BarChart3 },
          { id: "media", label: "مكتبة الوسائط", icon: Library },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ring-1 transition ${
                active ? "bg-[#25D366]/10 text-[#25D366] ring-[#25D366]/30"
                       : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
              }`}>
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ANALYTICS */}
      {tab === "analytics" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
            <Stat label="Sent" value={`${totals.sent.toLocaleString()}`} delta="آخر 30 يوم" />
            <Stat label="Delivered" value={`${totals.delivered.toLocaleString()}`} delta={`${Math.round(totals.delivered/totals.sent*100)}%`} accent="#60a5fa" />
            <Stat label="Read" value={`${totals.read.toLocaleString()}`} delta={`${Math.round(totals.read/totals.sent*100)}%`} accent="#a78bfa" />
            <Stat label="Clicked" value={`${totals.clicked.toLocaleString()}`} delta="CTR" accent="#fbbf24" />
            <Stat label="Replied" value={`${totals.replied.toLocaleString()}`} delta="ردود" accent="#22d3ee" />
            <Stat label="Converted" value={`${totals.converted.toLocaleString()}`} delta="تحويل" accent="#f97316" />
          </div>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><Megaphone className="h-4 w-4 text-[#25D366]" /> الحملات الأخيرة</h3>
              <span className="text-[11px] text-slate-500">{CAMPAIGNS.length} حملة</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-slate-400 border-b border-white/5">
                  <tr>
                    <th className="text-right py-2 px-3">الحملة</th>
                    <th className="text-right py-2 px-3">الحالة</th>
                    <th className="text-right py-2 px-3">التاريخ</th>
                    <th className="text-center py-2 px-2">Sent</th>
                    <th className="text-center py-2 px-2">Delivered</th>
                    <th className="text-center py-2 px-2">Read</th>
                    <th className="text-center py-2 px-2">Clicked</th>
                    <th className="text-center py-2 px-2">Replied</th>
                    <th className="text-center py-2 px-2">Converted</th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPAIGNS.map((c) => (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2.5 px-3 text-slate-200">{c.name}</td>
                      <td className="py-2.5 px-3"><Badge tone={statusTone[c.status]}>{c.status}</Badge></td>
                      <td className="py-2.5 px-3 text-slate-400">{c.date}</td>
                      <td className="py-2.5 px-2 text-center">{c.sent}</td>
                      <td className="py-2.5 px-2 text-center text-sky-300">{c.delivered}</td>
                      <td className="py-2.5 px-2 text-center text-violet-300">{c.read}</td>
                      <td className="py-2.5 px-2 text-center text-amber-300">{c.clicked}</td>
                      <td className="py-2.5 px-2 text-center text-cyan-300">{c.replied}</td>
                      <td className="py-2.5 px-2 text-center text-[#25D366] font-semibold">{c.converted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* CRM Integration */}
          <Card className="mt-6">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <GitBranch className="h-4 w-4 text-[#25D366]" /> تكامل CRM
            </h3>
            <p className="text-xs text-slate-400 mb-4">عندما يرد العميل على أي حملة، يتم تلقائياً:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { icon: Inbox, label: "فتح Inbox للموظف", tone: "blue" as const },
                { icon: Users, label: "تحديث بيانات CRM", tone: "purple" as const },
                { icon: Flame, label: "تعديل Lead Score", tone: "red" as const },
                { icon: Ticket, label: "إنشاء Ticket عند الحاجة", tone: "yellow" as const },
              ].map((s) => {
                const I = s.icon;
                return (
                  <div key={s.label} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 flex items-center gap-3">
                    <div className="rounded-lg bg-[#25D366]/15 p-2 ring-1 ring-[#25D366]/30"><I className="h-4 w-4 text-[#25D366]" /></div>
                    <div>
                      <div className="font-medium text-slate-200">{s.label}</div>
                      <Badge tone={s.tone}>تلقائي</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {/* HISTORY */}
      {tab === "history" && (
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Megaphone className="h-4 w-4 text-[#25D366]" /> سجل الحملات</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-slate-400 border-b border-white/5">
                <tr><th className="text-right py-2 px-3">الحملة</th><th className="text-right py-2 px-3">الحالة</th><th className="text-right py-2 px-3">التاريخ</th><th className="text-center py-2 px-2">Sent</th><th className="text-center py-2 px-2">Delivered</th><th className="text-center py-2 px-2">Converted</th></tr>
              </thead>
              <tbody>
                {CAMPAIGNS.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2.5 px-3">{c.name}</td><td className="py-2.5 px-3"><Badge tone={statusTone[c.status]}>{c.status}</Badge></td><td className="py-2.5 px-3 text-slate-400">{c.date}</td><td className="py-2.5 px-2 text-center">{c.sent}</td><td className="py-2.5 px-2 text-center text-sky-300">{c.delivered}</td><td className="py-2.5 px-2 text-center text-[#25D366] font-semibold">{c.converted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* AUDIENCE TREE */}
      {tab === "tree" && (
        <Card>
          <h3 className="font-semibold mb-2 flex items-center gap-2"><GitBranch className="h-4 w-4 text-[#25D366]" /> شجرة الجمهور</h3>
          <p className="text-xs text-slate-400 mb-4">شرائح الجمهور المتفرّعة حسب المصدر والاهتمام والمدينة.</p>
          <div className="space-y-2 text-sm">
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="font-semibold">كل العملاء — 5,470</div>
              <div className="mr-4 mt-2 space-y-2">
                <div className="rounded-lg bg-[#0a0d12] p-2 ring-1 ring-white/5">🔥 Hot Leads — 412</div>
                <div className="rounded-lg bg-[#0a0d12] p-2 ring-1 ring-white/5">❄️ Cold Leads — 1,830
                  <div className="mr-4 mt-2 space-y-1 text-xs text-slate-300">
                    <div className="rounded-md bg-white/5 p-1.5">🏢 عقار — 920</div>
                    <div className="rounded-md bg-white/5 p-1.5">🩺 عيادات — 540</div>
                    <div className="rounded-md bg-white/5 p-1.5">🍽️ مطاعم — 388</div>
                  </div>
                </div>
                <div className="rounded-lg bg-[#0a0d12] p-2 ring-1 ring-white/5">📍 الرياض — 2,140 | جدة — 1,260</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* EXCLUDE LIST */}
      {tab === "exclude" && (
        <Card>
          <h3 className="font-semibold mb-2 flex items-center gap-2"><Filter className="h-4 w-4 text-[#25D366]" /> قائمة الاستبعاد</h3>
          <p className="text-xs text-slate-400 mb-4">أرقام لن تستلم أي حملات (Opt-out / DND).</p>
          <table className="w-full text-xs">
            <thead className="text-slate-400 border-b border-white/5"><tr><th className="text-right py-2 px-3">الجوال</th><th className="text-right py-2 px-3">السبب</th><th className="text-right py-2 px-3">التاريخ</th></tr></thead>
            <tbody>
              {[
                { p: "+966 50 111 2233", r: "Opt-out", d: "قبل يومين" },
                { p: "+966 55 444 5566", r: "Bounce", d: "قبل 3 أيام" },
                { p: "+966 56 777 8899", r: "Spam Report", d: "الأسبوع الماضي" },
              ].map((x, i) => (
                <tr key={i} className="border-b border-white/5"><td className="py-2.5 px-3">{x.p}</td><td className="py-2.5 px-3"><Badge tone="red">{x.r}</Badge></td><td className="py-2.5 px-3 text-slate-400">{x.d}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}


      {/* TEMPLATES */}
      {tab === "templates" && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-5">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-[#25D366]" /> القوالب</h3>
                <button onClick={() => toast.success("قالب جديد (Demo)")}
                  className="rounded-lg ring-1 ring-white/10 px-2.5 py-1 text-xs hover:bg-white/5 flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> إضافة
                </button>
              </div>
              <div className="space-y-2">
                {TEMPLATES.map((t) => {
                  const MI = mediaIcon[t.media];
                  const active = t.id === selectedTplId;
                  return (
                    <button key={t.id} onClick={() => setSelectedTplId(t.id)}
                      className={`w-full text-right rounded-xl border p-3 transition ${
                        active ? "border-[#25D366]/40 bg-[#25D366]/5" : "border-white/5 bg-[#0f141b] hover:border-white/10"
                      }`}>
                      <div className="flex items-center gap-2">
                        <MI className="h-4 w-4 text-slate-300" />
                        <span className="text-sm font-semibold truncate flex-1">{t.name}</span>
                        <Badge tone={kindTone[t.kind]}>{t.kind}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                        <Badge tone={statusTone[t.status]}>{t.status}</Badge>
                        <span>{t.lang.toUpperCase()}</span>
                        <span>•</span>
                        <span>{t.updated}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Builder */}
          <div className="col-span-12 lg:col-span-4">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2"><Layers className="h-4 w-4 text-[#25D366]" /> Template Builder</h3>
                <Badge tone={kindTone[selectedTpl.kind]}>{selectedTpl.kind}</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 mb-1 block">نوع التمبلت</label>
                  <div className="flex gap-2">
                    {(["Marketing", "Utility", "Authentication"] as TemplateKind[]).map((k) => (
                      <span key={k} className={`rounded-lg px-2.5 py-1 ring-1 cursor-pointer ${
                        selectedTpl.kind === k ? "ring-[#25D366]/40 bg-[#25D366]/10 text-[#25D366]" : "ring-white/10 bg-white/5 text-slate-300"
                      }`}>{k}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 mb-1 block">نوع المحتوى</label>
                  <div className="flex gap-2">
                    {(["Text", "Image", "Video", "PDF"] as MediaKind[]).map((k) => {
                      const I = mediaIcon[k];
                      return (
                        <span key={k} className={`flex items-center gap-1 rounded-lg px-2.5 py-1 ring-1 cursor-pointer ${
                          selectedTpl.media === k ? "ring-[#25D366]/40 bg-[#25D366]/10 text-[#25D366]" : "ring-white/10 bg-white/5 text-slate-300"
                        }`}><I className="h-3 w-3" /> {k}</span>
                      );
                    })}
                  </div>
                </div>

                <Field label="Header" value={selectedTpl.header} />
                <Field label="Body" value={selectedTpl.body} multiline />
                <Field label="Footer" value={selectedTpl.footer || "—"} />

                <div>
                  <label className="text-slate-400 mb-1 block">Buttons</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTpl.buttons.map((b, i) => (
                      <span key={i} className="rounded-lg bg-[#25D366]/10 ring-1 ring-[#25D366]/30 px-2.5 py-1 text-[#25D366]">{b}</span>
                    ))}
                    <button onClick={() => toast.success("تمت إضافة زر")}
                      className="rounded-lg ring-1 ring-dashed ring-white/15 px-2.5 py-1 text-slate-400 hover:text-[#25D366] hover:ring-[#25D366]/40">
                      + زر
                    </button>
                  </div>
                </div>

                <button onClick={() => toast.success("تم حفظ القالب — قيد المراجعة")}
                  className="w-full rounded-xl bg-[#25D366] text-black font-semibold py-2 hover:brightness-110">
                  حفظ وإرسال للمراجعة
                </button>
              </div>
            </Card>
          </div>

          {/* WhatsApp Preview */}
          <div className="col-span-12 lg:col-span-3">
            <WhatsAppPreview tpl={selectedTpl} />
          </div>
        </div>
      )}

      {/* GROUPS */}
      {tab === "groups" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-[#25D366]" /> Contact Groups</h3>
            <button onClick={() => toast.success("تم إنشاء مجموعة (Demo)")}
              className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> مجموعة جديدة
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GROUPS.map((g) => {
              const I = g.icon;
              return (
                <Card key={g.id} className="!p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/5 p-2.5 ring-1 ring-white/10"><I className="h-5 w-5 text-[#25D366]" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate">{g.name}</div>
                      <div className="text-[11px] text-slate-400">{g.count.toLocaleString()} جهة اتصال</div>
                    </div>
                    <Badge tone={g.tone}>Group</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Auto-sync</span>
                    <button onClick={() => { setSelectedGroupId(g.id); setTab("sender"); }}
                      className="text-[#25D366] hover:underline">إرسال حملة →</button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* SENDER */}
      {tab === "sender" && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <Card>
              <h3 className="font-semibold flex items-center gap-2 mb-4"><Send className="h-4 w-4 text-[#25D366]" /> إنشاء حملة جديدة</h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 mb-1.5 block">اسم الحملة</label>
                  <input defaultValue="حملة جديدة — Hot Leads"
                    className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm outline-none focus:ring-[#25D366]/40" />
                </div>

                <div>
                  <label className="text-slate-400 mb-1.5 block">اختر القالب</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {TEMPLATES.filter(t => t.status === "Approved").map((t) => {
                      const MI = mediaIcon[t.media];
                      const active = t.id === selectedTplId;
                      return (
                        <button key={t.id} onClick={() => setSelectedTplId(t.id)}
                          className={`text-right rounded-xl border p-3 transition ${
                            active ? "border-[#25D366]/40 bg-[#25D366]/5" : "border-white/5 bg-[#0f141b] hover:border-white/10"
                          }`}>
                          <div className="flex items-center gap-2">
                            <MI className="h-4 w-4 text-slate-300" />
                            <span className="font-semibold truncate flex-1">{t.name}</span>
                            <Badge tone={kindTone[t.kind]}>{t.kind}</Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{t.body}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 mb-1.5 block">اختر المجموعة</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {GROUPS.map((g) => {
                      const I = g.icon;
                      const active = g.id === selectedGroupId;
                      return (
                        <button key={g.id} onClick={() => setSelectedGroupId(g.id)}
                          className={`rounded-xl border p-2.5 transition flex items-center gap-2 ${
                            active ? "border-[#25D366]/40 bg-[#25D366]/5" : "border-white/5 bg-[#0f141b] hover:border-white/10"
                          }`}>
                          <I className="h-4 w-4 text-[#25D366]" />
                          <div className="text-right flex-1 min-w-0">
                            <div className="font-semibold truncate">{g.name}</div>
                            <div className="text-[10px] text-slate-500">{g.count}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 mb-1.5 block">جدولة الإرسال</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "now", label: "إرسال فوري" },
                      { id: "today", label: "اليوم 18:00" },
                      { id: "tomorrow", label: "غداً 10:00" },
                      { id: "custom", label: "مخصص" },
                    ].map((s) => (
                      <button key={s.id} onClick={() => setSchedule(s.id)}
                        className={`flex items-center gap-1.5 rounded-lg ring-1 px-3 py-1.5 ${
                          schedule === s.id ? "ring-[#25D366]/40 bg-[#25D366]/10 text-[#25D366]" : "ring-white/10 bg-white/5 text-slate-300"
                        }`}>
                        <Calendar className="h-3.5 w-3.5" /> {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-[#25D366]/5 ring-1 ring-[#25D366]/20 p-3 flex items-center justify-between">
                  <div>
                    <div className="text-slate-300">سيتم إرسال <span className="text-[#25D366] font-semibold">{selectedTpl.name}</span> إلى مجموعة <span className="text-[#25D366] font-semibold">{selectedGroup.name}</span></div>
                    <div className="text-[11px] text-slate-500 mt-1">{selectedGroup.count.toLocaleString()} متلقي • {schedule === "now" ? "إرسال فوري" : "مجدول"}</div>
                  </div>
                  <button onClick={() => toast.success(`تم إرسال الحملة إلى ${selectedGroup.count} متلقي`)}
                    className="rounded-xl bg-[#25D366] text-black font-semibold px-4 py-2 hover:brightness-110 flex items-center gap-2">
                    <Send className="h-4 w-4" /> إرسال
                  </button>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-[#25D366]" /> توقعات الأداء (AI)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {[
                  { l: "وصول متوقع", v: `${Math.round(selectedGroup.count * 0.97)}`, t: "97%" },
                  { l: "قراءة متوقعة", v: `${Math.round(selectedGroup.count * 0.78)}`, t: "78%" },
                  { l: "نقرات متوقعة", v: `${Math.round(selectedGroup.count * 0.34)}`, t: "34%" },
                  { l: "تحويل متوقع", v: `${Math.round(selectedGroup.count * 0.08)}`, t: "8%" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                    <div className="text-slate-400 text-[11px]">{s.l}</div>
                    <div className="text-lg font-bold text-[#25D366] mt-1">{s.v}</div>
                    <div className="text-[10px] text-slate-500">{s.t}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <WhatsAppPreview tpl={selectedTpl} />
          </div>
        </div>
      )}

      {/* MEDIA */}
      {tab === "media" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Library className="h-4 w-4 text-[#25D366]" /> Media Library</h3>
            <button onClick={() => toast.success("ارفع ملف جديد (Demo)")}
              className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> رفع ملف
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {MEDIA.map((m) => {
              const I = mediaIcon[m.kind];
              const bg: Record<MediaKind, string> = {
                Image: "from-emerald-500/20 to-emerald-500/5",
                Video: "from-rose-500/20 to-rose-500/5",
                PDF: "from-amber-500/20 to-amber-500/5",
                Text: "from-sky-500/20 to-sky-500/5",
              };
              return (
                <Card key={m.id} className="!p-3">
                  <div className={`rounded-xl bg-gradient-to-br ${bg[m.kind]} ring-1 ring-white/10 aspect-video flex items-center justify-center`}>
                    <I className="h-10 w-10 text-white/70" />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.size}</div>
                    </div>
                    <Badge tone="default">{m.kind}</Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </AppShell>
  );
}

/* ---------- Helpers ---------- */

function Field({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <label className="text-slate-400 mb-1 block">{label}</label>
      {multiline ? (
        <textarea defaultValue={value} rows={3}
          className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm outline-none focus:ring-[#25D366]/40 resize-none" />
      ) : (
        <input defaultValue={value}
          className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm outline-none focus:ring-[#25D366]/40" />
      )}
    </div>
  );
}

function WhatsAppPreview({ tpl }: { tpl: (typeof TEMPLATES)[number] }) {
  const MI = mediaIcon[tpl.media];
  return (
    <Card className="!p-3">
      <h3 className="font-semibold flex items-center gap-2 mb-3 px-2 pt-1">
        <Smartphone className="h-4 w-4 text-[#25D366]" /> معاينة WhatsApp
      </h3>
      <div className="rounded-2xl bg-[#0a0f0a] ring-1 ring-white/10 overflow-hidden">
        <div className="bg-[#075E54] px-3 py-2 flex items-center gap-2">
          <ChevronLeft className="h-4 w-4 text-white" />
          <div className="h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center text-[10px] font-bold">LF</div>
          <div className="text-white text-xs">
            <div className="font-semibold">LeadFlow Business</div>
            <div className="text-[10px] opacity-80">متصل الآن</div>
          </div>
        </div>
        <div className="p-3 space-y-2 min-h-[300px] text-[11px]" style={{ background: "#0d1410" }}>
          <div className="bg-white/95 text-slate-900 rounded-lg overflow-hidden max-w-[88%] shadow">
            {tpl.media !== "Text" && (
              <div className="bg-gradient-to-br from-emerald-200 to-emerald-50 aspect-video flex items-center justify-center text-emerald-700">
                <MI className="h-8 w-8" />
              </div>
            )}
            <div className="px-2.5 py-2">
              {tpl.header && <div className="font-bold mb-1">{tpl.header}</div>}
              <div className="leading-relaxed">{tpl.body}</div>
              {tpl.footer && <div className="text-[10px] text-slate-500 mt-1">{tpl.footer}</div>}
              <div className="text-[9px] text-slate-400 text-left mt-1">10:24 ✓✓</div>
            </div>
            {tpl.buttons.length > 0 && (
              <div className="border-t border-slate-200 divide-y divide-slate-200">
                {tpl.buttons.map((b, i) => (
                  <div key={i} className="text-center py-1.5 text-[#0a7cff] font-medium text-[11px]">{b}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
        <div className="rounded-lg bg-white/5 p-2 text-center">
          <Eye className="h-3 w-3 inline ml-1 text-violet-300" /> قراءة 78%
        </div>
        <div className="rounded-lg bg-white/5 p-2 text-center">
          <MousePointerClick className="h-3 w-3 inline ml-1 text-amber-300" /> نقر 34%
        </div>
        <div className="rounded-lg bg-white/5 p-2 text-center">
          <Trophy className="h-3 w-3 inline ml-1 text-[#25D366]" /> تحويل 8%
        </div>
      </div>
    </Card>
  );
}
