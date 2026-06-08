import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import AppShell, { Badge, Card, Stat } from "@/components/app/AppShell";
import {
  ArrowLeftRight,
  Bot,
  Brain,
  Database,
  GitBranch,
  Grip,
  MessageSquare,
  Phone,
  Play,
  Plus,
  Save,
  Send,
  Sparkles,
  Ticket,
  UserCheck,
  Users,
  Wand2,
  X,
} from "lucide-react";

export const Route = createFileRoute("/bot-flow")({
  head: () => ({
    meta: [
      { title: "شجرة البوت — LeadFlow" },
      {
        name: "description",
        content:
          "Visual Bot Flow Tree with connected nodes, WhatsApp preview, node editor, AI takeover, groups, segments and CRM mapping.",
      },
    ],
  }),
  component: BotFlowPage,
});

type NodeKind = "start" | "question" | "collect" | "ai" | "crm" | "ticket" | "handover" | "end";

type FlowNode = {
  id: string;
  kind: NodeKind;
  title: string;
  body: string;
  options?: string[];
  crmField?: string;
  x: number;
  y: number;
};

type Edge = { from: string; to: string; label?: string };

const NODE_META: Record<NodeKind, { label: string; icon: typeof Play; tone: string; bg: string }> = {
  start: { label: "Start", icon: Play, tone: "#25D366", bg: "rgba(37,211,102,0.14)" },
  question: { label: "Question", icon: GitBranch, tone: "#38bdf8", bg: "rgba(56,189,248,0.14)" },
  collect: { label: "Collect Data", icon: Database, tone: "#f59e0b", bg: "rgba(245,158,11,0.14)" },
  ai: { label: "AI Takeover", icon: Brain, tone: "#a78bfa", bg: "rgba(167,139,250,0.14)" },
  crm: { label: "CRM", icon: Users, tone: "#14b8a6", bg: "rgba(20,184,166,0.14)" },
  ticket: { label: "Create Ticket", icon: Ticket, tone: "#fb7185", bg: "rgba(251,113,133,0.14)" },
  handover: { label: "Human Handover", icon: UserCheck, tone: "#60a5fa", bg: "rgba(96,165,250,0.14)" },
  end: { label: "End", icon: X, tone: "#94a3b8", bg: "rgba(148,163,184,0.14)" },
};

const INITIAL_NODES: FlowNode[] = [
  { id: "start", kind: "start", title: "Start", body: "أول رسالة واردة من العميل", x: 360, y: 24 },
  { id: "lang", kind: "question", title: "اختيار اللغة", body: "اختر اللغة المناسبة", options: ["العربية", "English"], x: 360, y: 180 },
  { id: "menu-ar", kind: "question", title: "الخدمة المطلوبة", body: "ما الخدمة التي تريدها؟", options: ["شراء عقار", "إيجار", "تمويل", "موظف"], x: 40, y: 360 },
  { id: "menu-en", kind: "question", title: "Service Menu", body: "Buy, Rent, Finance or Agent", options: ["Buy", "Rent", "Finance", "Agent"], x: 720, y: 360 },
  { id: "city", kind: "collect", title: "اسأل المدينة", body: "في أي مدينة تبحث؟", crmField: "City", x: 40, y: 560 },
  { id: "budget", kind: "collect", title: "اسأل الميزانية", body: "كم ميزانيتك؟", crmField: "Budget", x: 40, y: 720 },
  { id: "property", kind: "collect", title: "نوع العقار", body: "شقة، فيلا، أرض؟", crmField: "Property Type", x: 40, y: 880 },
  { id: "bedrooms", kind: "collect", title: "عدد الغرف", body: "كم عدد الغرف المطلوبة؟", crmField: "Bedrooms", x: 40, y: 1040 },
  { id: "payment", kind: "collect", title: "طريقة الدفع", body: "كاش أم تمويل؟", crmField: "Payment Method", x: 40, y: 1200 },
  { id: "crm", kind: "crm", title: "Update CRM", body: "حفظ العميل وتحديث Lead Score والـ Pipeline", x: 40, y: 1360 },
  { id: "ticket", kind: "ticket", title: "Create Ticket", body: "إنشاء تذكرة معاينة أو متابعة", x: 40, y: 1520 },
  { id: "end", kind: "end", title: "End", body: "شكراً، سيتم التواصل معك", x: 40, y: 1680 },
  { id: "rent", kind: "handover", title: "قسم الإيجار", body: "تحويل العميل إلى فريق الإيجار", x: 360, y: 560 },
  { id: "finance", kind: "handover", title: "مستشار التمويل", body: "تحويل مباشر لمستشار التمويل", x: 680, y: 560 },
  { id: "agent", kind: "handover", title: "موظف مبيعات", body: "ربط العميل بموظف متاح", x: 1000, y: 560 },
  { id: "ai", kind: "ai", title: "AI Takeover", body: "يتدخل إذا خرج العميل عن المسار أو كتب سؤالاً حرًا", x: 720, y: 880 },
];

const INITIAL_EDGES: Edge[] = [
  { from: "start", to: "lang" },
  { from: "lang", to: "menu-ar", label: "العربية" },
  { from: "lang", to: "menu-en", label: "English" },
  { from: "menu-ar", to: "city", label: "شراء عقار" },
  { from: "city", to: "budget" },
  { from: "budget", to: "property" },
  { from: "property", to: "bedrooms" },
  { from: "bedrooms", to: "payment" },
  { from: "payment", to: "crm" },
  { from: "crm", to: "ticket" },
  { from: "ticket", to: "end" },
  { from: "menu-ar", to: "rent", label: "إيجار" },
  { from: "menu-ar", to: "finance", label: "تمويل" },
  { from: "menu-ar", to: "agent", label: "موظف" },
  { from: "menu-en", to: "ai", label: "Out of flow" },
  { from: "menu-ar", to: "ai", label: "AI rescue" },
];

const GROUPS = [
  { name: "Hot Leads", count: 198, tone: "red" as const },
  { name: "Riyadh", count: 624, tone: "green" as const },
  { name: "Jeddah", count: 318, tone: "green" as const },
  { name: "Interested in Buying", count: 488, tone: "blue" as const },
];

const SEGMENTS = [
  { name: "Budget > 800K", rule: "Budget > 800000", count: 142 },
  { name: "Lead Score > 80", rule: "Lead Score > 80", count: 198 },
  { name: "City = Riyadh", rule: "City = Riyadh", count: 624 },
];

const CRM_MAPPING = [
  ["المدينة", "City"],
  ["الميزانية", "Budget"],
  ["نوع العقار", "Property Type"],
  ["عدد الغرف", "Bedrooms"],
  ["طريقة الدفع", "Payment Method"],
] as const;

function BotFlowPage() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [selectedId, setSelectedId] = useState<string>("menu-ar");
  const [aiPrompt, setAiPrompt] = useState("أنشئ بوت عقاري");
  const [edges] = useState(INITIAL_EDGES);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const selectedNode = nodes.find((node) => node.id === selectedId) ?? null;
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes]);
  const canvasHeight = useMemo(() => Math.max(1840, ...nodes.map((node) => node.y + 180)), [nodes]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>, node: FlowNode) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      id: node.id,
      offsetX: event.clientX - rect.left - node.x,
      offsetY: event.clientY - rect.top - node.y,
    };
    setSelectedId(node.id);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(16, event.clientX - rect.left - dragRef.current.offsetX);
    const y = Math.max(16, event.clientY - rect.top - dragRef.current.offsetY);

    setNodes((current) =>
      current.map((node) => (node.id === dragRef.current?.id ? { ...node, x, y } : node)),
    );
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  function updateNode(patch: Partial<FlowNode>) {
    if (!selectedNode) return;
    setNodes((current) => current.map((node) => (node.id === selectedNode.id ? { ...node, ...patch } : node)));
  }

  function addNode(kind: NodeKind) {
    const nextId = `node-${Date.now()}`;
    const meta = NODE_META[kind];
    setNodes((current) => [
      ...current,
      {
        id: nextId,
        kind,
        title: meta.label,
        body: "Node جديدة قابلة للتعديل",
        x: 1540,
        y: 120 + current.length * 24,
      },
    ]);
    setSelectedId(nextId);
    toast.success("تمت إضافة Node جديدة");
  }

  function runAiGenerator() {
    toast.success(`تم توليد الشجرة من: ${aiPrompt}`);
  }

  return (
    <AppShell
      title="شجرة البوت"
      subtitle="Visual Bot Flow Tree مستقلة عن إعدادات الوكيل الذكي"
      actions={
        <button className="rounded-xl bg-[#25D366] px-3 py-2 text-xs font-medium text-black hover:brightness-110">
          <span className="flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5" /> حفظ الفلو
          </span>
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-5">
        <Stat label="Completion Rate" value="68.4%" delta="848 مكتمل" accent="#34d399" />
        <Stat label="Drop-off Rate" value="17.6%" delta="أعلى تسرب عند الميزانية" accent="#f59e0b" />
        <Stat label="Handover Rate" value="11.8%" delta="142 تحويل لموظف" accent="#60a5fa" />
        <Stat label="Hot Leads" value="198" delta="تم توليدها من الفلو" accent="#fb7185" />
        <Stat label="Runs" value="1,240" delta="عدد مرات التشغيل" accent="#25D366" />
      </div>

      <Card className="mt-4 border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/5 to-transparent">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-[#25D366]" /> AI Flow Generator
            </div>
            <p className="mt-1 text-xs text-slate-400">اكتب وصفًا مثل: أنشئ بوت عقاري، وسيتم توليد شجرة أولية كاملة.</p>
          </div>
          <div className="flex w-full flex-col gap-2 xl:w-[640px] xl:flex-row">
            <input
              value={aiPrompt}
              onChange={(event) => setAiPrompt(event.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[#25D366]/40"
            />
            <button
              onClick={runAiGenerator}
              className="rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-medium text-black hover:brightness-110"
            >
              <span className="flex items-center justify-center gap-1.5">
                <Wand2 className="h-4 w-4" /> توليد الشجرة
              </span>
            </button>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Plus className="h-4 w-4 text-[#25D366]" /> Node Library
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {(Object.keys(NODE_META) as NodeKind[]).map((kind) => {
                const meta = NODE_META[kind];
                const Icon = meta.icon;
                return (
                  <button
                    key={kind}
                    onClick={() => addNode(kind)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs hover:bg-white/10"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: meta.tone }} />
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-sky-400" /> Groups / Segments
            </div>
            <div className="space-y-2">
              {GROUPS.map((group) => (
                <div key={group.name} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm">{group.name}</div>
                    <Badge tone={group.tone}>{group.count}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
              {SEGMENTS.map((segment) => (
                <div key={segment.name} className="rounded-xl border border-violet-500/15 bg-violet-500/[0.04] p-3">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span>{segment.name}</span>
                    <Badge tone="purple">{segment.count}</Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-violet-300">{segment.rule}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden !p-0">
          <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <GitBranch className="h-4 w-4 text-[#25D366]" /> Visual Bot Flow Tree
              </div>
              <div className="mt-1 text-xs text-slate-400">Canvas كبير مع Nodes مربوطة بخطوط ويمكن تحريكها بالسحب.</div>
            </div>
            <Badge tone="green">{nodes.length} Nodes</Badge>
          </div>

          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative overflow-auto bg-[#070a0e]"
            style={{
              height: "76vh",
              backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          >
            <div className="relative min-w-[1750px]" style={{ height: canvasHeight }}>
              <svg className="absolute inset-0" width="1750" height={canvasHeight}>
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0 0 L10 5 L0 10 Z" fill="#25D366" />
                  </marker>
                </defs>
                {edges.map((edge) => {
                  const from = nodeMap[edge.from];
                  const to = nodeMap[edge.to];
                  if (!from || !to) return null;

                  const startX = from.x + 140;
                  const startY = from.y + 92;
                  const endX = to.x + 140;
                  const endY = to.y;
                  const middleY = (startY + endY) / 2;

                  return (
                    <g key={`${edge.from}-${edge.to}`}>
                      <path
                        d={`M ${startX} ${startY} C ${startX} ${middleY}, ${endX} ${middleY}, ${endX} ${endY}`}
                        stroke="#25D366"
                        strokeOpacity="0.55"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrow)"
                      />
                      {edge.label ? (
                        <text x={(startX + endX) / 2} y={middleY - 8} fill="#a3e635" fontSize="11" textAnchor="middle">
                          {edge.label}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
              </svg>

              {nodes.map((node) => {
                const meta = NODE_META[node.kind];
                const Icon = meta.icon;
                const selected = selectedId === node.id;

                return (
                  <div
                    key={node.id}
                    onPointerDown={(event) => handlePointerDown(event, node)}
                    className="absolute w-[280px] cursor-grab select-none rounded-2xl border p-3 shadow-lg transition-transform active:cursor-grabbing"
                    style={{
                      left: node.x,
                      top: node.y,
                      borderColor: selected ? meta.tone : "rgba(255,255,255,0.08)",
                      background: `linear-gradient(180deg, ${meta.bg}, rgba(15,20,27,0.96))`,
                      boxShadow: selected ? `0 0 0 1px ${meta.tone}, 0 16px 40px -18px ${meta.tone}` : "0 16px 40px -24px rgba(0,0,0,0.8)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: meta.bg }}>
                        <Icon className="h-4 w-4" style={{ color: meta.tone }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate text-sm font-semibold">{node.title}</div>
                          <Grip className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.18em]" style={{ color: meta.tone }}>
                          {meta.label}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs leading-5 text-slate-300">{node.body}</div>
                    {node.options?.length ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {node.options.map((option) => (
                          <span key={option} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-300">
                            {option}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {node.crmField ? <div className="mt-3 text-[11px] text-emerald-300">CRM → {node.crmField}</div> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between bg-[#075E54] px-3 py-2 text-white">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">WhatsApp Preview</div>
                  <div className="text-[10px] text-emerald-100">LeadFlow Bot</div>
                </div>
              </div>
              <Phone className="h-4 w-4 opacity-75" />
            </div>
            <div className="space-y-2 bg-[#0b141a] p-3">
              <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-[#202c33] px-3 py-2 text-xs text-slate-100">
                أهلاً بك 👋 اختر اللغة المناسبة
              </div>
              <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-[#202c33] px-3 py-2 text-xs text-slate-100">
                الخدمة المطلوبة؟
                <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-2">
                  <button className="rounded-lg bg-[#2a3942] px-2 py-1 text-[11px] text-sky-300">شراء عقار</button>
                  <button className="rounded-lg bg-[#2a3942] px-2 py-1 text-[11px] text-sky-300">إيجار</button>
                  <button className="rounded-lg bg-[#2a3942] px-2 py-1 text-[11px] text-sky-300">تمويل</button>
                </div>
              </div>
              <div className="mr-auto max-w-[80%] rounded-2xl rounded-tl-md bg-[#005c4b] px-3 py-2 text-xs text-white">
                أريد شراء شقة في الرياض بميزانية 800 ألف
              </div>
              <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-[#202c33] px-3 py-2 text-xs text-slate-100">
                ممتاز، ما نوع العقار وعدد الغرف؟
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-white/5 bg-[#1f2c33] p-2">
              <input
                disabled
                value="Preview only"
                className="flex-1 rounded-full bg-[#2a3942] px-3 py-2 text-xs text-slate-300 outline-none"
                readOnly
              />
              <Send className="h-4 w-4 text-slate-400" />
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4 text-[#25D366]" /> Node Editor
            </div>
            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">العنوان</label>
                  <input
                    value={selectedNode.title}
                    onChange={(event) => updateNode({ title: event.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">المحتوى</label>
                  <textarea
                    value={selectedNode.body}
                    onChange={(event) => updateNode({ body: event.target.value })}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">الخيارات</label>
                  <input
                    value={(selectedNode.options ?? []).join("، ")}
                    onChange={(event) =>
                      updateNode({
                        options: event.target.value.split(/[،,]/).map((item) => item.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] text-slate-400">ربط CRM</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateNode({ crmField: undefined })}
                      className={`rounded-xl border px-3 py-2 text-xs transition ${
                        !selectedNode.crmField
                          ? "border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366]"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      بدون ربط
                    </button>
                    {CRM_MAPPING.map(([, value]) => (
                      <button
                        key={value}
                        onClick={() => updateNode({ crmField: value })}
                        className={`rounded-xl border px-3 py-2 text-xs transition ${
                          selectedNode.crmField === value
                            ? "border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366]"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                    <div className="flex items-center gap-2 font-medium text-cyan-300">
                      <Brain className="h-3.5 w-3.5" /> AI Takeover
                    </div>
                    <div className="mt-1 text-slate-400">يتدخل عند الخروج عن الفلو.</div>
                  </div>
                  <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
                    <div className="flex items-center gap-2 font-medium text-sky-300">
                      <ArrowLeftRight className="h-3.5 w-3.5" /> Handover
                    </div>
                    <div className="mt-1 text-slate-400">تحويل مباشر لموظف.</div>
                  </div>
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Database className="h-4 w-4 text-emerald-400" /> CRM Mapping
          </div>
          <div className="space-y-2">
            {CRM_MAPPING.map(([label, field]) => (
              <div key={field} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3 text-sm">
                <span>{label}</span>
                <div className="flex items-center gap-2 text-emerald-300">
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  <span>{field}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Brain className="h-4 w-4 text-violet-400" /> AI Suggestions
          </div>
          <div className="space-y-2 text-sm">
            <div className="rounded-xl border border-violet-500/15 bg-violet-500/[0.04] p-3">سؤال ناقص بعد الميزانية: هل يريد العميل شراء للاستثمار أم للسكن؟</div>
            <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-3">نقطة تسرب واضحة عند سؤال الميزانية؛ أضف خيارات نطاقات جاهزة بدل إدخال مفتوح.</div>
            <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.04] p-3">فرصة: إذا كانت الميزانية فوق 1M، ارفع Lead Score وحوّل مباشرة لمسؤول كبار العملاء.</div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}