import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import {
  Zap, Plus, Play, Pause, GitBranch, Filter, Bolt, Clock, CheckCircle2,
  TrendingUp, Workflow as WorkflowIcon, ArrowDown, Bell, MessageSquare,
  Calendar, Ticket, UserPlus, Send, Trophy, Flame, AlertTriangle, GripVertical,
  Settings2, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/automations")({
  head: () => ({
    meta: [
      { title: "AI Automations — LeadFlow" },
      { name: "description", content: "Sales automation workflows builder powered by AI." },
    ],
  }),
  component: AutomationsPage,
});

type NodeKind = "trigger" | "condition" | "action";
type WFNode = { id: string; kind: NodeKind; icon: any; title: string; desc: string; tone: "green" | "yellow" | "blue" | "purple" | "red" };
type Workflow = {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
  runs: number;
  success: number; // %
  savedMin: number;
  lastRun: string;
  nodes: WFNode[];
};

const WORKFLOWS: Workflow[] = [
  {
    id: "wf1",
    name: "Hot Lead Routing",
    desc: "إذا Lead Score > 80 → تذكرة + مندوب + متابعة + Hot Leads",
    enabled: true,
    runs: 142,
    success: 96,
    savedMin: 380,
    lastRun: "قبل 4 دقائق",
    nodes: [
      { id: "n1", kind: "trigger", icon: Flame, title: "Trigger", desc: "Lead Score يصبح > 80", tone: "green" },
      { id: "n2", kind: "condition", icon: Filter, title: "Condition", desc: "Intent = High AND Stage ≠ Won", tone: "yellow" },
      { id: "n3", kind: "action", icon: Ticket, title: "Create Ticket", desc: "تذكرة بأولوية عالية", tone: "blue" },
      { id: "n4", kind: "action", icon: UserPlus, title: "Assign Sales Agent", desc: "أفضل مندوب متاح", tone: "blue" },
      { id: "n5", kind: "action", icon: Send, title: "Send Follow-up", desc: "رسالة WhatsApp قالب جاهز", tone: "blue" },
      { id: "n6", kind: "action", icon: Flame, title: "Add to Hot Leads", desc: "قائمة Hot Leads", tone: "red" },
    ],
  },
  {
    id: "wf2",
    name: "Meeting Scheduled Reminders",
    desc: "عند Meeting Scheduled → Reminder + WhatsApp + Calendar",
    enabled: true,
    runs: 87,
    success: 99,
    savedMin: 210,
    lastRun: "قبل 22 دقيقة",
    nodes: [
      { id: "n1", kind: "trigger", icon: Calendar, title: "Trigger", desc: "Stage = Meeting Scheduled", tone: "green" },
      { id: "n2", kind: "action", icon: Bell, title: "Create Reminder", desc: "قبل الموعد بساعة", tone: "blue" },
      { id: "n3", kind: "action", icon: MessageSquare, title: "WhatsApp Reminder", desc: "تذكير تلقائي للعميل", tone: "blue" },
      { id: "n4", kind: "action", icon: Calendar, title: "Add Calendar Event", desc: "Google Calendar", tone: "purple" },
    ],
  },
  {
    id: "wf3",
    name: "Re-engage Cold Leads",
    desc: "إذا لم يرد العميل خلال 3 أيام → Follow-up + Needs Attention",
    enabled: true,
    runs: 64,
    success: 78,
    savedMin: 145,
    lastRun: "قبل ساعة",
    nodes: [
      { id: "n1", kind: "trigger", icon: Clock, title: "Trigger", desc: "لا رد منذ 3 أيام", tone: "green" },
      { id: "n2", kind: "condition", icon: Filter, title: "Condition", desc: "Stage ≠ Won/Lost", tone: "yellow" },
      { id: "n3", kind: "action", icon: Send, title: "Send Follow-up", desc: "قالب إعادة تفعيل", tone: "blue" },
      { id: "n4", kind: "action", icon: AlertTriangle, title: "Mark Needs Attention", desc: "علم الحالة", tone: "red" },
    ],
  },
  {
    id: "wf4",
    name: "Won Deal Celebration",
    desc: "عند Won → تهنئة + نقل إلى Customers + تسجيل الإيراد",
    enabled: true,
    runs: 38,
    success: 100,
    savedMin: 95,
    lastRun: "قبل 3 ساعات",
    nodes: [
      { id: "n1", kind: "trigger", icon: Trophy, title: "Trigger", desc: "Stage = Won", tone: "green" },
      { id: "n2", kind: "action", icon: MessageSquare, title: "Send Congrats", desc: "رسالة تهنئة شخصية", tone: "blue" },
      { id: "n3", kind: "action", icon: UserPlus, title: "Move to Customers", desc: "قائمة العملاء", tone: "purple" },
      { id: "n4", kind: "action", icon: TrendingUp, title: "Log Revenue", desc: "تسجيل في التقارير", tone: "green" },
    ],
  },
];

const NODE_LIBRARY: { kind: NodeKind; icon: any; title: string; tone: WFNode["tone"] }[] = [
  { kind: "trigger", icon: Flame, title: "Lead Score", tone: "green" },
  { kind: "trigger", icon: Calendar, title: "Stage Change", tone: "green" },
  { kind: "trigger", icon: Clock, title: "Time-based", tone: "green" },
  { kind: "condition", icon: Filter, title: "If/Else", tone: "yellow" },
  { kind: "action", icon: Ticket, title: "Create Ticket", tone: "blue" },
  { kind: "action", icon: Send, title: "Send Message", tone: "blue" },
  { kind: "action", icon: UserPlus, title: "Assign Agent", tone: "blue" },
  { kind: "action", icon: Bell, title: "Reminder", tone: "purple" },
];

function NodeCard({ node, onDragStart }: { node: WFNode; onDragStart?: () => void }) {
  const Icon = node.icon;
  const ring: Record<string, string> = {
    green: "ring-emerald-500/30 bg-emerald-500/5",
    yellow: "ring-amber-500/30 bg-amber-500/5",
    blue: "ring-sky-500/30 bg-sky-500/5",
    purple: "ring-violet-500/30 bg-violet-500/5",
    red: "ring-rose-500/30 bg-rose-500/5",
  };
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`group relative rounded-xl ring-1 ${ring[node.tone]} p-4 cursor-grab active:cursor-grabbing transition-transform hover:-translate-y-0.5`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white/5 p-2"><Icon className="h-4 w-4" /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge tone={node.tone}>{node.kind}</Badge>
            <span className="text-sm font-semibold truncate">{node.title}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{node.desc}</p>
        </div>
        <GripVertical className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100" />
      </div>
    </div>
  );
}

function AutomationsPage() {
  const [workflows, setWorkflows] = useState(WORKFLOWS);
  const [selectedId, setSelectedId] = useState(WORKFLOWS[0].id);
  const selected = workflows.find((w) => w.id === selectedId)!;

  const totalRuns = workflows.reduce((a, w) => a + w.runs, 0);
  const avgSuccess = Math.round(workflows.reduce((a, w) => a + w.success, 0) / workflows.length);
  const totalSaved = workflows.reduce((a, w) => a + w.savedMin, 0);

  const toggle = (id: string) => {
    setWorkflows((ws) => ws.map((w) => w.id === id ? { ...w, enabled: !w.enabled } : w));
    const w = workflows.find((x) => x.id === id)!;
    toast.success(`${w.enabled ? "تم إيقاف" : "تم تفعيل"} الأتمتة: ${w.name}`);
  };

  const runNow = (id: string) => {
    const w = workflows.find((x) => x.id === id)!;
    toast.success(`تشغيل تجريبي: ${w.name}`);
    setWorkflows((ws) => ws.map((x) => x.id === id ? { ...x, runs: x.runs + 1, lastRun: "الآن" } : x));
  };

  return (
    <AppShell
      title="AI Automations"
      subtitle="أتمت عمليات المبيعات بـ Workflows ذكية شبيهة بـ HubSpot وZapier"
      actions={
        <button
          onClick={() => toast.success("تم إنشاء Workflow جديد (Demo)")}
          className="hidden md:inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Workflow جديد
        </button>
      }
    >
      {/* Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="عدد الـ Workflows" value={`${workflows.length}`} delta={`${workflows.filter(w => w.enabled).length} نشطة`} />
        <Stat label="مرات التشغيل" value={`${totalRuns}`} delta="آخر 30 يوم" accent="#60a5fa" />
        <Stat label="نسبة النجاح" value={`${avgSuccess}%`} delta="متوسط جميع الـ Workflows" accent="#a78bfa" />
        <Stat label="الوقت الموفر" value={`${Math.round(totalSaved / 60)} ساعة`} delta={`${totalSaved} دقيقة هذا الشهر`} accent="#fbbf24" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Workflows list */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <WorkflowIcon className="h-4 w-4 text-[#25D366]" /> Workflows
            </h2>
            <span className="text-[11px] text-slate-500">{workflows.length}</span>
          </div>
          {workflows.map((w) => {
            const active = w.id === selectedId;
            return (
              <button
                key={w.id}
                onClick={() => setSelectedId(w.id)}
                className={`w-full text-right rounded-2xl border p-4 transition-all ${
                  active ? "border-[#25D366]/40 bg-[#25D366]/5" : "border-white/5 bg-[#0f141b] hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{w.name}</span>
                      <Badge tone={w.enabled ? "green" : "default"}>{w.enabled ? "نشط" : "متوقف"}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{w.desc}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><Bolt className="h-3 w-3" /> {w.runs}</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {w.success}%</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {w.lastRun}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); toggle(w.id); }}
                      className={`rounded-lg p-1.5 ring-1 ${w.enabled ? "ring-emerald-500/30 text-emerald-300" : "ring-white/10 text-slate-400"}`}
                      title={w.enabled ? "إيقاف" : "تشغيل"}
                    >
                      {w.enabled ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    </span>
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); runNow(w.id); }}
                      className="rounded-lg p-1.5 ring-1 ring-white/10 text-slate-300 hover:text-white"
                      title="تشغيل الآن"
                    >
                      <Zap className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Builder */}
        <div className="col-span-12 lg:col-span-5">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-[#25D366]" />
                  <h3 className="font-semibold">{selected.name}</h3>
                  <Badge tone={selected.enabled ? "green" : "default"}>{selected.enabled ? "نشط" : "متوقف"}</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1">{selected.desc}</p>
              </div>
              <button
                onClick={() => toast.success("تم حفظ Workflow")}
                className="rounded-lg ring-1 ring-white/10 px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-1.5"
              >
                <Settings2 className="h-3.5 w-3.5" /> إعدادات
              </button>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => toast.success("تمت إضافة الخطوة (Demo)")}
              className="rounded-2xl bg-[#0a0d12] ring-1 ring-white/5 p-5 min-h-[420px]"
            >
              <div className="flex flex-col items-center gap-2">
                {selected.nodes.map((n, i) => (
                  <div key={n.id} className="w-full max-w-md">
                    <NodeCard node={n} onDragStart={() => {}} />
                    {i < selected.nodes.length - 1 && (
                      <div className="flex justify-center my-1">
                        <ArrowDown className="h-4 w-4 text-slate-600" />
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => toast.success("اسحب خطوة من اللوحة الجانبية أو اضغط لإضافتها")}
                  className="mt-3 w-full max-w-md rounded-xl border border-dashed border-white/10 px-4 py-3 text-xs text-slate-400 hover:border-[#25D366]/40 hover:text-[#25D366] flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" /> أضف خطوة
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-[11px] text-slate-400">مرات التشغيل</div>
                <div className="text-lg font-bold text-sky-300">{selected.runs}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-[11px] text-slate-400">نجاح</div>
                <div className="text-lg font-bold text-emerald-300">{selected.success}%</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-[11px] text-slate-400">وقت موفر</div>
                <div className="text-lg font-bold text-amber-300">{selected.savedMin}د</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Library / Logs */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#25D366]" /> مكتبة الخطوات
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">اسحب وأفلت داخل الـ Builder</p>
            <div className="space-y-2">
              {NODE_LIBRARY.map((n, i) => (
                <NodeCard
                  key={i}
                  node={{ id: `lib-${i}`, kind: n.kind, icon: n.icon, title: n.title, desc: n.kind, tone: n.tone }}
                />
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-[#25D366]" /> آخر عمليات التشغيل
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { t: "Hot Lead Routing", s: "نجاح", time: "قبل 4 د", tone: "green" as const },
                { t: "Meeting Reminders", s: "نجاح", time: "قبل 22 د", tone: "green" as const },
                { t: "Re-engage Cold", s: "نجاح", time: "قبل ساعة", tone: "green" as const },
                { t: "Hot Lead Routing", s: "تخطي شرط", time: "قبل ساعتين", tone: "yellow" as const },
                { t: "Won Celebration", s: "نجاح", time: "قبل 3 س", tone: "green" as const },
              ].map((l, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <div className="truncate">{l.t}</div>
                  <div className="flex items-center gap-2">
                    <Badge tone={l.tone}>{l.s}</Badge>
                    <span className="text-slate-500">{l.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
