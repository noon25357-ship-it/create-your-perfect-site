import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import AppShell, { Badge, Card } from "@/components/app/AppShell";
import {
  ArrowLeftRight, Bot, Brain, Database, GitBranch, Grip, MessageSquare, Phone, Play,
  Plus, RefreshCw, Save, Search, Send, Sparkles, Ticket, UserCheck, Users, Wand2, X,
  ArrowLeft, MoreVertical, Copy, Trash2, MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/bot-flow")({
  head: () => ({
    meta: [
      { title: "WhatsApp Flows — LeadFlow" },
      { name: "description", content: "إدارة وإنشاء WhatsApp Bot Flows مع Visual Builder بأسلوب InfoSeed." },
    ],
  }),
  component: BotFlowPage,
});

type FlowStatus = "Draft" | "Published" | "Deprecated" | "Blocked";
type FlowType = "Inbound" | "Outbound";

type FlowListItem = {
  id: string;
  name: string;
  status: FlowStatus;
  type: FlowType;
  modified: string;
  category: string;
  runs: number;
};

const FLOWS: FlowListItem[] = [
  { id: "rent-my-car", name: "Rent My Car", status: "Published", type: "Inbound", modified: "06/07/2026", category: "Real Estate", runs: 1240 },
  { id: "real-estate-buy", name: "بوت شراء عقار", status: "Published", type: "Inbound", modified: "05/29/2026", category: "Real Estate", runs: 864 },
  { id: "support-tickets", name: "Support Tickets Bot", status: "Draft", type: "Inbound", modified: "05/21/2026", category: "Support", runs: 0 },
  { id: "ramadan-promo", name: "Ramadan Promo Flow", status: "Deprecated", type: "Outbound", modified: "04/12/2026", category: "Marketing", runs: 3520 },
  { id: "lead-qualify", name: "Lead Qualification", status: "Published", type: "Inbound", modified: "04/02/2026", category: "Sales", runs: 2106 },
  { id: "feedback-nps", name: "NPS Feedback", status: "Draft", type: "Outbound", modified: "03/18/2026", category: "Feedback", runs: 0 },
  { id: "abandoned-cart", name: "Abandoned Cart Reminder", status: "Blocked", type: "Outbound", modified: "02/27/2026", category: "E-commerce", runs: 412 },
];

const STATUS_STYLE: Record<FlowStatus, string> = {
  Published: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  Draft: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
  Deprecated: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  Blocked: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
};

// ============ Builder types ============
type NodeKind = "start" | "question" | "collect" | "ai" | "crm" | "ticket" | "handover" | "end";

type FlowNode = {
  id: string; kind: NodeKind; title: string; body: string;
  options?: string[]; crmField?: string; x: number; y: number;
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
  { id: "ai", kind: "ai", title: "AI Takeover", body: "يتدخل إذا خرج العميل عن المسار", x: 720, y: 880 },
];
const INITIAL_EDGES: Edge[] = [
  { from: "start", to: "lang" },
  { from: "lang", to: "menu-ar", label: "العربية" },
  { from: "lang", to: "menu-en", label: "English" },
  { from: "menu-ar", to: "city", label: "شراء عقار" },
  { from: "city", to: "budget" }, { from: "budget", to: "property" },
  { from: "property", to: "bedrooms" }, { from: "bedrooms", to: "payment" },
  { from: "payment", to: "crm" }, { from: "crm", to: "ticket" }, { from: "ticket", to: "end" },
  { from: "menu-ar", to: "rent", label: "إيجار" },
  { from: "menu-ar", to: "finance", label: "تمويل" },
  { from: "menu-ar", to: "agent", label: "موظف" },
  { from: "menu-en", to: "ai", label: "Out of flow" },
];

const CRM_MAPPING = [
  ["المدينة", "City"], ["الميزانية", "Budget"], ["نوع العقار", "Property Type"],
  ["عدد الغرف", "Bedrooms"], ["طريقة الدفع", "Payment Method"],
] as const;

const GROUPS = [
  { name: "Hot Leads", count: 198, tone: "red" as const },
  { name: "Riyadh", count: 624, tone: "green" as const },
  { name: "Jeddah", count: 318, tone: "green" as const },
  { name: "Interested in Buying", count: 488, tone: "blue" as const },
];

// ============ Main ============
function BotFlowPage() {
  const [openFlow, setOpenFlow] = useState<FlowListItem | null>(null);
  return openFlow ? (
    <FlowBuilder flow={openFlow} onBack={() => setOpenFlow(null)} />
  ) : (
    <FlowsList onOpen={setOpenFlow} />
  );
}

// ============ LIST VIEW (InfoSeed-style) ============
function FlowsList({ onOpen }: { onOpen: (f: FlowListItem) => void }) {
  const [filter, setFilter] = useState<FlowStatus | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = FLOWS.filter((f) =>
    (filter === "All" || f.status === filter) &&
    (query === "" || f.name.toLowerCase().includes(query.toLowerCase()) || f.category.toLowerCase().includes(query.toLowerCase()))
  );

  const counts: Record<string, number> = {
    All: FLOWS.length,
    Draft: FLOWS.filter((f) => f.status === "Draft").length,
    Published: FLOWS.filter((f) => f.status === "Published").length,
    Deprecated: FLOWS.filter((f) => f.status === "Deprecated").length,
    Blocked: FLOWS.filter((f) => f.status === "Blocked").length,
  };

  return (
    <AppShell title="WhatsApp Flows" subtitle="Build interactive flows you can send inside WhatsApp messages">
      {/* Hero header */}
      <Card className="!p-0 overflow-hidden border-white/10 bg-gradient-to-br from-[#5b46f5]/10 via-[#0f141b] to-[#0f141b]">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">WhatsApp Flows</h2>
            <p className="mt-1 text-sm text-slate-400">Build interactive flows you can send inside WhatsApp messages.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpen({ id: "new", name: "New Flow", status: "Draft", type: "Inbound", modified: new Date().toLocaleDateString(), category: "—", runs: 0 })}
              className="flex items-center gap-2 rounded-xl bg-[#5b46f5] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Create flow
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10">
              <RefreshCw className="h-4 w-4" /> Sync with Business
            </button>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="mt-4 !p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category or ID..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 pr-9 text-sm outline-none placeholder:text-slate-500 focus:border-[#25D366]/40"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["All", "Draft", "Published", "Deprecated", "Blocked"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                  filter === s
                    ? "bg-[#25D366]/15 text-[#25D366] ring-1 ring-[#25D366]/30"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {s} <span className="opacity-60">({counts[s]})</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Flows table */}
      <Card className="mt-4 !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-white/[0.03] text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">الإسم</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Runs</th>
                <th className="px-4 py-3 font-medium">تم تعديله في التاريخ</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <button onClick={() => onOpen(f)} className="font-medium text-slate-100 hover:text-[#25D366]">{f.name}</button>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] ring-1 ${STATUS_STYLE[f.status]}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-emerald-300">
                      <ArrowLeftRight className="h-3.5 w-3.5" /> {f.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{f.category}</td>
                  <td className="px-4 py-3 text-slate-300">{f.runs.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-400">{f.modified}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onOpen(f)} className="grid h-8 w-8 place-items-center rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20" title="فتح المحادثة">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button onClick={() => toast.success("تم النسخ")} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-slate-300 hover:bg-white/10">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">لا توجد فلوهات مطابقة.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-4 py-3 text-xs text-slate-400">
          <span>المجموع: {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10">‹</button>
            <span className="rounded-lg bg-[#25D366]/15 px-3 py-1.5 text-[#25D366]">1</span>
            <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10">›</button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}

// ============ BUILDER VIEW ============
function FlowBuilder({ flow, onBack }: { flow: FlowListItem; onBack: () => void }) {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [selectedId, setSelectedId] = useState<string>("menu-ar");
  const [aiPrompt, setAiPrompt] = useState("أنشئ بوت عقاري");
  const [edges] = useState(INITIAL_EDGES);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const canvasHeight = useMemo(() => Math.max(1840, ...nodes.map((n) => n.y + 180)), [nodes]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>, node: FlowNode) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = { id: node.id, offsetX: e.clientX - rect.left - node.x, offsetY: e.clientY - rect.top - node.y };
    setSelectedId(node.id);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(16, e.clientX - rect.left - dragRef.current.offsetX);
    const y = Math.max(16, e.clientY - rect.top - dragRef.current.offsetY);
    setNodes((cur) => cur.map((n) => (n.id === dragRef.current?.id ? { ...n, x, y } : n)));
  }
  const onPointerUp = () => { dragRef.current = null; };
  function updateNode(patch: Partial<FlowNode>) {
    if (!selectedNode) return;
    setNodes((c) => c.map((n) => (n.id === selectedNode.id ? { ...n, ...patch } : n)));
  }
  function addNode(kind: NodeKind) {
    const id = `node-${Date.now()}`;
    const meta = NODE_META[kind];
    setNodes((c) => [...c, { id, kind, title: meta.label, body: "Node جديدة", x: 1100, y: 120 + c.length * 24 }]);
    setSelectedId(id);
    toast.success("تمت إضافة Node");
  }

  return (
    <AppShell
      title={flow.name}
      subtitle={`Visual Flow Builder — ${flow.category}`}
      actions={
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
            <ArrowLeft className="h-3.5 w-3.5" /> رجوع للقائمة
          </button>
          <button onClick={() => toast.success("تم الحفظ")} className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-semibold text-black hover:brightness-110">
            <Save className="h-3.5 w-3.5" /> حفظ
          </button>
          <button onClick={() => toast.success("تم النشر")} className="flex items-center gap-1.5 rounded-xl bg-[#5b46f5] px-3 py-2 text-xs font-semibold text-white hover:brightness-110">
            Publish
          </button>
        </div>
      }
    >
      {/* Flow meta strip */}
      <Card className="!p-3 flex flex-wrap items-center gap-3 text-xs">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 ring-1 ${STATUS_STYLE[flow.status]}`}>{flow.status}</span>
        <span className="text-slate-400">Type: <span className="text-slate-200">{flow.type}</span></span>
        <span className="text-slate-400">Modified: <span className="text-slate-200">{flow.modified}</span></span>
        <span className="text-slate-400">Runs: <span className="text-slate-200">{flow.runs}</span></span>
        <button onClick={() => toast("تم الحذف", { description: "محاكاة فقط" })} className="ml-auto flex items-center gap-1 text-rose-300 hover:text-rose-200">
          <Trash2 className="h-3.5 w-3.5" /> حذف
        </button>
      </Card>

      {/* AI Generator */}
      <Card className="mt-4 border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/5 to-transparent">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-[#25D366]" /> AI Flow Generator</div>
            <p className="mt-1 text-xs text-slate-400">اكتب وصفاً وسيتم توليد شجرة كاملة.</p>
          </div>
          <div className="flex w-full flex-col gap-2 xl:w-[640px] xl:flex-row">
            <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[#25D366]/40" />
            <button onClick={() => toast.success(`تم توليد: ${aiPrompt}`)}
              className="rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-medium text-black hover:brightness-110">
              <span className="flex items-center justify-center gap-1.5"><Wand2 className="h-4 w-4" /> توليد</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <Card className="mt-4 overflow-hidden !p-0">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold"><GitBranch className="h-4 w-4 text-[#25D366]" /> Visual Bot Flow Tree</div>
          <Badge tone="green">{nodes.length} Nodes</Badge>
        </div>
        <div ref={canvasRef} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} dir="ltr"
          className="relative overflow-auto bg-[#070a0e]"
          style={{ height: "70vh", backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "22px 22px" }}>
          <div className="relative min-w-[1320px]" style={{ height: canvasHeight }}>
            <svg className="absolute inset-0" width="1320" height={canvasHeight}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 Z" fill="#25D366" />
                </marker>
              </defs>
              {edges.map((edge) => {
                const from = nodeMap[edge.from]; const to = nodeMap[edge.to];
                if (!from || !to) return null;
                const sx = from.x + 140, sy = from.y + 92, ex = to.x + 140, ey = to.y, my = (sy + ey) / 2;
                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <path d={`M ${sx} ${sy} C ${sx} ${my}, ${ex} ${my}, ${ex} ${ey}`}
                      stroke="#25D366" strokeOpacity="0.55" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                    {edge.label && <text x={(sx + ex) / 2} y={my - 8} fill="#a3e635" fontSize="11" textAnchor="middle">{edge.label}</text>}
                  </g>
                );
              })}
            </svg>
            {nodes.map((node) => {
              const meta = NODE_META[node.kind]; const Icon = meta.icon; const sel = selectedId === node.id;
              return (
                <div key={node.id} onPointerDown={(e) => onPointerDown(e, node)}
                  className="absolute w-[280px] cursor-grab select-none rounded-2xl border p-3 shadow-lg active:cursor-grabbing"
                  style={{
                    left: node.x, top: node.y,
                    borderColor: sel ? meta.tone : "rgba(255,255,255,0.08)",
                    background: `linear-gradient(180deg, ${meta.bg}, rgba(15,20,27,0.96))`,
                    boxShadow: sel ? `0 0 0 1px ${meta.tone}, 0 16px 40px -18px ${meta.tone}` : "0 16px 40px -24px rgba(0,0,0,0.8)",
                  }}>
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: meta.bg }}>
                      <Icon className="h-4 w-4" style={{ color: meta.tone }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-semibold">{node.title}</div>
                        <Grip className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.18em]" style={{ color: meta.tone }}>{meta.label}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs leading-5 text-slate-300">{node.body}</div>
                  {node.options?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {node.options.map((o) => <span key={o} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-300">{o}</span>)}
                    </div>
                  ) : null}
                  {node.crmField && <div className="mt-3 text-[11px] text-emerald-300">CRM → {node.crmField}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Sidebar trio */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Plus className="h-4 w-4 text-[#25D366]" /> Node Library</div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(NODE_META) as NodeKind[]).map((kind) => {
                const meta = NODE_META[kind]; const Icon = meta.icon;
                return (
                  <button key={kind} onClick={() => addNode(kind)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs hover:bg-white/10">
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: meta.tone }} />
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4 text-sky-400" /> Groups</div>
            <div className="space-y-2">
              {GROUPS.map((g) => (
                <div key={g.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-3 text-sm">
                  <span>{g.name}</span><Badge tone={g.tone}>{g.count}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4 text-[#25D366]" /> Node Editor</div>
          {selectedNode && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">العنوان</label>
                <input value={selectedNode.title} onChange={(e) => updateNode({ title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">المحتوى</label>
                <textarea value={selectedNode.body} onChange={(e) => updateNode({ body: e.target.value })} rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">الخيارات (مفصولة بفاصلة)</label>
                <input value={(selectedNode.options ?? []).join("، ")}
                  onChange={(e) => updateNode({ options: e.target.value.split(/[،,]/).map((x) => x.trim()).filter(Boolean) })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] text-slate-400">ربط CRM</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => updateNode({ crmField: undefined })}
                    className={`rounded-xl border px-3 py-2 text-xs ${!selectedNode.crmField ? "border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366]" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>
                    بدون ربط
                  </button>
                  {CRM_MAPPING.map(([, v]) => (
                    <button key={v} onClick={() => updateNode({ crmField: v })}
                      className={`rounded-xl border px-3 py-2 text-xs ${selectedNode.crmField === v ? "border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366]" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between bg-[#075E54] px-3 py-2 text-white">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-white/15"><Bot className="h-4 w-4" /></div>
              <div>
                <div className="text-xs font-semibold">WhatsApp Preview</div>
                <div className="text-[10px] text-emerald-100">LeadFlow Bot</div>
              </div>
            </div>
            <Phone className="h-4 w-4 opacity-75" />
          </div>
          <div className="space-y-2 bg-[#0b141a] p-3">
            <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-[#202c33] px-3 py-2 text-xs text-slate-100">أهلاً 👋 اختر اللغة</div>
            <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-[#202c33] px-3 py-2 text-xs text-slate-100">
              الخدمة المطلوبة؟
              <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-2">
                <button className="rounded-lg bg-[#2a3942] px-2 py-1 text-[11px] text-sky-300">شراء عقار</button>
                <button className="rounded-lg bg-[#2a3942] px-2 py-1 text-[11px] text-sky-300">إيجار</button>
                <button className="rounded-lg bg-[#2a3942] px-2 py-1 text-[11px] text-sky-300">تمويل</button>
              </div>
            </div>
            <div className="mr-auto max-w-[80%] rounded-2xl rounded-tl-md bg-[#005c4b] px-3 py-2 text-xs text-white">أريد شقة في الرياض بميزانية 800K</div>
          </div>
          <div className="flex items-center gap-2 border-t border-white/5 bg-[#1f2c33] p-2">
            <input disabled value="Preview only" readOnly className="flex-1 rounded-full bg-[#2a3942] px-3 py-2 text-xs text-slate-300 outline-none" />
            <Send className="h-4 w-4 text-slate-400" />
          </div>
        </Card>
      </div>

      {/* CRM Mapping */}
      <Card className="mt-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Database className="h-4 w-4 text-emerald-400" /> CRM Mapping</div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {CRM_MAPPING.map(([label, field]) => (
            <div key={field} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3 text-sm">
              <span>{label}</span>
              <div className="flex items-center gap-2 text-emerald-300"><ArrowLeftRight className="h-3.5 w-3.5" /><span>{field}</span></div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
