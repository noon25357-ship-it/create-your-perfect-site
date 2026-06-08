import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useMemo } from "react";
import { toast } from "sonner";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import {
  Bot, Sparkles, MessageSquare, GitBranch, Users, Ticket, Flame, Wand2,
  Play, ListChecks, Building2, Landmark, Stethoscope, Dumbbell, ShoppingBag,
  Briefcase, TrendingUp, Send, Smartphone, Plus, Trash2, Save, Database,
  UserCheck, Brain, Phone, X, Settings2, Zap, ArrowRight, Download,
} from "lucide-react";

export const Route = createFileRoute("/bot-flow")({
  head: () => ({
    meta: [
      { title: "Bot Flow Builder — LeadFlow" },
      { name: "description", content: "Visual WhatsApp Bot Flow Builder with drag & drop, AI generator, CRM mapping and live preview." },
    ],
  }),
  component: BotFlowPage,
});

/* ---------------- Types ---------------- */
type NodeKind = "start" | "message" | "question" | "condition" | "collect" | "ai" | "ticket" | "crm" | "handover" | "end";
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
type Edge = { from: string; to: string };

const KIND_META: Record<NodeKind, { label: string; icon: any; color: string; bg: string }> = {
  start:    { label: "بداية",        icon: Play,        color: "#25D366", bg: "rgba(37,211,102,0.12)" },
  message:  { label: "رسالة",        icon: MessageSquare, color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
  question: { label: "سؤال",         icon: ListChecks,  color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  condition:{ label: "شرط",          icon: GitBranch,   color: "#facc15", bg: "rgba(250,204,21,0.12)" },
  collect:  { label: "جمع بيانات",   icon: Database,    color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  ai:       { label: "AI Takeover",  icon: Brain,       color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  ticket:   { label: "تذكرة",        icon: Ticket,      color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  crm:      { label: "CRM",          icon: Users,       color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  handover: { label: "تحويل لموظف",  icon: UserCheck,   color: "#fb7185", bg: "rgba(251,113,133,0.12)" },
  end:      { label: "نهاية",        icon: X,           color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
};

/* ---------------- Default tree (branching) ---------------- */
const COL = { c: 920, l1: 480, l2: 1360, l3: 60, l4: 1780 } as const;

const DEFAULT_NODES: FlowNode[] = [
  // Spine
  { id: "n1",  kind: "start",    title: "بدء المحادثة", body: "أول رسالة من العميل على واتساب", x: COL.c, y: 20 },
  { id: "n2",  kind: "message",  title: "ترحيب",        body: "أهلاً بك في عقارات اللؤلؤة 🏡", x: COL.c, y: 150 },
  { id: "n3",  kind: "question", title: "اختيار اللغة", body: "اختر اللغة المفضلة", options: ["العربية", "English"], x: COL.c, y: 280 },

  // Arabic branch → Menu
  { id: "n4",  kind: "message",  title: "اللغة: العربية", body: "تم اختيار العربية ✅", x: COL.l1, y: 430 },
  { id: "n5",  kind: "question", title: "الخدمة المطلوبة", body: "كيف نقدر نخدمك؟",
    options: ["شراء عقار", "استئجار عقار", "تمويل عقاري", "تواصل مع موظف"], x: COL.l1, y: 560 },

  // English branch
  { id: "n6",  kind: "message",  title: "Language: English", body: "Great! How can we help?", options: ["Buy", "Rent", "Finance", "Agent"], x: COL.l2, y: 430 },

  // Buy flow (deep)
  { id: "n7",  kind: "collect",  title: "المدينة",       body: "في أي مدينة تبحث؟",          crmField: "City",          x: COL.l3, y: 740 },
  { id: "n8",  kind: "collect",  title: "الميزانية",     body: "كم ميزانيتك التقريبية؟",     crmField: "Budget",        x: COL.l3, y: 880 },
  { id: "n9",  kind: "question", title: "نوع العقار",    body: "ما نوع العقار؟", options: ["شقة","فيلا","أرض"], crmField: "Property Type", x: COL.l3, y: 1020 },
  { id: "n10", kind: "collect",  title: "عدد الغرف",     body: "كم عدد الغرف المطلوبة؟",     crmField: "Bedrooms",      x: COL.l3, y: 1160 },
  { id: "n11", kind: "message",  title: "حجز معاينة",    body: "نرتب لك معاينة في أقرب وقت", x: COL.l3, y: 1300 },
  { id: "n12", kind: "ticket",   title: "Create Ticket", body: "تذكرة معاينة + إشعار الفريق",x: COL.l3, y: 1440 },
  { id: "n13", kind: "crm",      title: "Add to CRM",    body: "حفظ بيانات العميل + Lead Score", x: COL.l3, y: 1580 },
  { id: "n14", kind: "end",      title: "End",           body: "شكراً لتواصلك معنا 🌟",      x: COL.l3, y: 1720 },

  // Other arabic branches (short)
  { id: "n15", kind: "message",  title: "استئجار عقار",  body: "تحويلك لقسم الإيجار",        x: COL.l1, y: 740 },
  { id: "n16", kind: "message",  title: "تمويل عقاري",   body: "تحويلك لمستشار التمويل",     x: COL.l1, y: 880 },
  { id: "n17", kind: "handover", title: "تواصل مع موظف", body: "إحالة فورية لمندوب",          x: COL.l1, y: 1020 },

  // AI Takeover (rescue branch)
  { id: "n18", kind: "ai",       title: "AI Takeover",   body: "إذا خرج العميل عن الخيارات يتدخل الذكاء ويفهم النية ويعيده للمسار الصحيح", x: COL.l4, y: 740 },
  { id: "n19", kind: "handover", title: "Assign Agent",  body: "تعيين أفضل موظف بناءً على القسم", x: COL.l4, y: 880 },
];

const DEFAULT_EDGES: Edge[] = [
  { from: "n1", to: "n2" }, { from: "n2", to: "n3" },
  // language branches
  { from: "n3", to: "n4" }, { from: "n3", to: "n6" },
  // arabic menu
  { from: "n4", to: "n5" },
  // buy deep path
  { from: "n5", to: "n7" }, { from: "n7", to: "n8" }, { from: "n8", to: "n9" },
  { from: "n9", to: "n10" }, { from: "n10", to: "n11" }, { from: "n11", to: "n12" },
  { from: "n12", to: "n13" }, { from: "n13", to: "n14" },
  // other arabic branches
  { from: "n5", to: "n15" }, { from: "n5", to: "n16" }, { from: "n5", to: "n17" },
  // AI takeover
  { from: "n3", to: "n18" }, { from: "n18", to: "n19" },
];

/* ---------------- Templates ---------------- */
const TEMPLATES = [
  { id: "real-estate", name: "عقار",          icon: Building2,   tone: "green" as const,  desc: "ميزانية • منطقة • نوع العقار" },
  { id: "clinic",      name: "عيادات",        icon: Stethoscope, tone: "purple" as const, desc: "تخصص • وقت • تأمين" },
  { id: "restaurant",  name: "مطاعم",         icon: ShoppingBag, tone: "yellow" as const, desc: "حجز • قائمة • توصيل" },
  { id: "training",    name: "تدريب",         icon: Dumbbell,    tone: "blue" as const,   desc: "دورات • مستوى • تاريخ" },
  { id: "support",     name: "خدمة عملاء",    icon: Briefcase,   tone: "red" as const,    desc: "تذاكر • متابعة • SLA" },
  { id: "ecom",        name: "متجر إلكتروني", icon: ShoppingBag, tone: "default" as const,desc: "منتج • دفع • شحن" },
  { id: "mortgage",    name: "تمويل عقاري",   icon: Landmark,    tone: "green" as const,  desc: "دخل • التزامات • نوع التمويل" },
];

const CRM_FIELDS = ["Budget", "Location", "Property Type", "Phone", "Name", "Email", "Lead Score", "Source"];

/* ---------------- Page ---------------- */
function BotFlowPage() {
  const [nodes, setNodes] = useState<FlowNode[]>(DEFAULT_NODES);
  const [edges] = useState<Edge[]>(DEFAULT_EDGES);
  const [selectedId, setSelectedId] = useState<string | null>("n4");
  const [aiPrompt, setAiPrompt] = useState("");
  const [activeTemplate, setActiveTemplate] = useState("real-estate");

  const selected = nodes.find(n => n.id === selectedId) || null;

  /* Drag */
  const dragRef = useRef<{ id: string; offX: number; offY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  function onPointerDown(e: React.PointerEvent, n: FlowNode) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const rect = canvasRef.current!.getBoundingClientRect();
    dragRef.current = { id: n.id, offX: e.clientX - rect.left - n.x, offY: e.clientY - rect.top - n.y };
    setSelectedId(n.id);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left - dragRef.current.offX);
    const y = Math.max(0, e.clientY - rect.top - dragRef.current.offY);
    setNodes(ns => ns.map(n => n.id === dragRef.current!.id ? { ...n, x, y } : n));
  }
  function onPointerUp() { dragRef.current = null; }

  function addNode(kind: NodeKind) {
    const id = "n" + Date.now();
    const meta = KIND_META[kind];
    const newNode: FlowNode = {
      id, kind, title: meta.label, body: "اضغط للتعديل",
      x: 320, y: 60 + nodes.length * 20,
    };
    setNodes([...nodes, newNode]);
    setSelectedId(id);
    toast.success("تمت إضافة Node جديد");
  }
  function deleteNode(id: string) {
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedId === id) setSelectedId(null);
    toast.success("تم حذف الـ Node");
  }
  function updateNode(id: string, patch: Partial<FlowNode>) {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, ...patch } : n));
  }

  function aiGenerate() {
    if (!aiPrompt.trim()) { toast.error("اكتب وصف للبوت أولاً"); return; }
    toast.success(`AI: تم توليد فلو "${aiPrompt}" بنجاح 🪄`);
    setAiPrompt("");
  }

  function loadTemplate(id: string) {
    setActiveTemplate(id);
    toast.success(`تم تحميل قالب: ${TEMPLATES.find(t => t.id === id)?.name}`);
  }

  /* Canvas size */
  const canvasH = useMemo(() => Math.max(1700, ...nodes.map(n => n.y + 200)), [nodes]);

  /* Edge paths */
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);

  return (
    <AppShell
      title="Bot Flow Builder"
      subtitle="منشئ تدفقات المحادثة البصري — Drag & Drop · AI Generator · CRM Mapping"
      actions={
        <div className="hidden md:flex items-center gap-2">
          <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> تصدير
          </button>
          <button className="rounded-xl bg-[#25D366] text-black px-3 py-2 text-xs font-medium hover:brightness-110 flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5" /> حفظ الفلو
          </button>
        </div>
      }
    >
      {/* Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Stat label="Completion Rate" value="68.4%" delta="+5.2% هذا الأسبوع" />
        <Stat label="Drop-off Rate" value="17.6%" delta="نقطة التسرب: الميزانية" accent="#f59e0b" />
        <Stat label="Handover Rate" value="11.8%" delta="142 محادثة محولة" accent="#38bdf8" />
        <Stat label="Hot Leads" value="198" delta="من 1,240 محادثة" accent="#fb7185" />
      </div>

      {/* AI Generator */}
      <Card className="mt-4 sm:mt-6 border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/5 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-[#25D366]" />
          <h3 className="text-sm font-semibold">AI Flow Generator</h3>
          <Badge tone="green">جديد</Badge>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder='مثل: "أنشئ بوت عقاري يسأل عن الميزانية والمدينة ويحول للمستشار"'
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[#25D366]/50"
            onKeyDown={e => e.key === "Enter" && aiGenerate()}
          />
          <button onClick={aiGenerate} className="rounded-xl bg-[#25D366] text-black px-4 py-2.5 text-sm font-medium hover:brightness-110 flex items-center justify-center gap-1.5">
            <Wand2 className="h-4 w-4" /> توليد بالذكاء
          </button>
        </div>
      </Card>

      {/* Templates */}
      <Card className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" /> قوالب جاهزة</h3>
          <span className="text-[11px] text-slate-400">اختر صناعتك للبدء بسرعة</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {TEMPLATES.map(t => {
            const Icon = t.icon;
            const active = activeTemplate === t.id;
            return (
              <button key={t.id} onClick={() => loadTemplate(t.id)}
                className={`rounded-xl border p-3 text-right transition-all ${active ? "border-[#25D366]/40 bg-[#25D366]/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                <Icon className={`h-5 w-5 mb-2 ${active ? "text-[#25D366]" : "text-slate-300"}`} />
                <div className="text-xs font-medium">{t.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.desc}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Builder: Toolbox + Canvas + Preview/Editor */}
      <div className="mt-4 grid grid-cols-12 gap-3 sm:gap-4">
        {/* Toolbox */}
        <Card className="col-span-12 lg:col-span-2 !p-3">
          <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> إضافة Node</h4>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-1.5">
            {(Object.keys(KIND_META) as NodeKind[]).map(k => {
              const m = KIND_META[k];
              const Icon = m.icon;
              return (
                <button key={k} onClick={() => addNode(k)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] hover:bg-white/10 hover:border-white/20 transition">
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: m.color }} />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Canvas */}
        <Card className="col-span-12 lg:col-span-7 !p-0 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02]">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <GitBranch className="h-3.5 w-3.5" /> Visual Flow Canvas
              <Badge tone="green">اسحب الـ Nodes لتحريكها</Badge>
            </div>
            <div className="text-[10px] text-slate-500">{nodes.length} nodes · {edges.length} connections</div>
          </div>
          <div
            ref={canvasRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className="relative overflow-auto bg-[#070a0e]"
            style={{
              height: "70vh",
              backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            <div className="relative" style={{ width: 600, height: canvasH }}>
              {/* Edges */}
              <svg className="absolute inset-0 pointer-events-none" width="100%" height={canvasH}>
                <defs>
                  <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill="#25D366" />
                  </marker>
                </defs>
                {edges.map((e, i) => {
                  const a = nodeMap[e.from]; const b = nodeMap[e.to];
                  if (!a || !b) return null;
                  const x1 = a.x + 130, y1 = a.y + 90;
                  const x2 = b.x + 130, y2 = b.y;
                  const my = (y1 + y2) / 2;
                  const d = `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
                  return <path key={i} d={d} stroke="#25D366" strokeOpacity="0.5" strokeWidth="2" fill="none" markerEnd="url(#arr)" />;
                })}
              </svg>

              {/* Nodes */}
              {nodes.map(n => {
                const m = KIND_META[n.kind];
                const Icon = m.icon;
                const isSel = selectedId === n.id;
                return (
                  <div
                    key={n.id}
                    onPointerDown={e => onPointerDown(e, n)}
                    style={{
                      left: n.x, top: n.y, width: 260,
                      borderColor: isSel ? m.color : "rgba(255,255,255,0.08)",
                      background: `linear-gradient(180deg, ${m.bg}, rgba(15,20,27,0.95))`,
                      boxShadow: isSel ? `0 0 0 2px ${m.color}55, 0 10px 30px -10px ${m.color}66` : "0 4px 16px -6px rgba(0,0,0,0.5)",
                    }}
                    className="absolute rounded-2xl border p-3 cursor-move select-none transition-shadow touch-none"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg grid place-items-center" style={{ background: m.bg }}>
                        <Icon className="h-4 w-4" style={{ color: m.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-wider" style={{ color: m.color }}>{m.label}</div>
                        <div className="text-sm font-semibold truncate">{n.title}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteNode(n.id); }}
                        className="opacity-50 hover:opacity-100 hover:text-rose-400 p-1">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-300 line-clamp-2">{n.body}</div>
                    {n.options && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {n.options.map((o, i) => (
                          <span key={i} className="rounded-md bg-white/5 border border-white/10 px-1.5 py-0.5 text-[10px]">{o}</span>
                        ))}
                      </div>
                    )}
                    {n.crmField && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-300">
                        <Database className="h-3 w-3" /> CRM: {n.crmField}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Right: Preview + Editor */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* WhatsApp Preview */}
          <Card className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-[#075E54]">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-white/20 grid place-items-center"><Bot className="h-3.5 w-3.5" /></div>
                <div>
                  <div className="text-xs font-semibold">LeadFlow Bot</div>
                  <div className="text-[10px] text-emerald-200">متصل الآن</div>
                </div>
              </div>
              <Phone className="h-3.5 w-3.5 opacity-70" />
            </div>
            <div className="p-3 space-y-2 max-h-[400px] overflow-auto"
              style={{ background: "#0b141a", backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><circle cx=%2250%22 cy=%2250%22 r=%221%22 fill=%22white%22 opacity=%220.03%22/></svg>')" }}>
              {nodes.filter(n => ["message", "question", "collect", "end"].includes(n.kind)).slice(0, 6).map(n => (
                <div key={n.id} className="max-w-[85%] rounded-lg rounded-tl-none bg-[#202c33] px-3 py-2 text-xs text-slate-100 shadow">
                  {n.body}
                  {n.options && (
                    <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-2">
                      {n.options.map((o, i) => (
                        <button key={i} className="rounded-md bg-[#2a3942] hover:bg-[#374248] px-2 py-1 text-[11px] text-sky-300 text-center transition">{o}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="max-w-[80%] mr-auto rounded-lg rounded-tr-none bg-[#005c4b] px-3 py-2 text-xs text-white shadow ml-auto">
                شقة في الرياض ميزانية 800k
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 border-t border-white/5 bg-[#1f2c33]">
              <input disabled placeholder="اكتب رسالة..." className="flex-1 rounded-full bg-[#2a3942] px-3 py-1.5 text-xs text-slate-300 outline-none" />
              <Send className="h-4 w-4 text-slate-400" />
            </div>
          </Card>

          {/* Node Editor */}
          <Card>
            <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5 text-[#25D366]" /> Node Editor
            </h4>
            {!selected ? (
              <div className="text-xs text-slate-400 text-center py-6">اختر Node من الكانفس للتعديل</div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">العنوان</label>
                  <input value={selected.title} onChange={e => updateNode(selected.id, { title: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-xs outline-none focus:border-[#25D366]/50" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">الرسالة / المحتوى</label>
                  <textarea value={selected.body} onChange={e => updateNode(selected.id, { body: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-xs outline-none focus:border-[#25D366]/50 resize-none" />
                </div>
                {(selected.kind === "question" || selected.kind === "collect") && (
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">الخيارات (افصل بفاصلة)</label>
                    <input value={(selected.options || []).join("، ")}
                      onChange={e => updateNode(selected.id, { options: e.target.value.split(/[،,]/).map(s => s.trim()).filter(Boolean) })}
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-xs outline-none focus:border-[#25D366]/50" />
                  </div>
                )}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 flex items-center gap-1"><Database className="h-3 w-3" /> ربط بحقل CRM</label>
                  <select value={selected.crmField || ""} onChange={e => updateNode(selected.id, { crmField: e.target.value || undefined })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-xs outline-none focus:border-[#25D366]/50">
                    <option value="">— لا يوجد —</option>
                    {CRM_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <button onClick={() => toast.success("تم حفظ التعديلات")}
                  className="w-full rounded-lg bg-[#25D366] text-black py-1.5 text-xs font-medium hover:brightness-110 flex items-center justify-center gap-1.5">
                  <Save className="h-3.5 w-3.5" /> حفظ
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* CRM Mapping */}
      <Card className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Database className="h-4 w-4 text-emerald-400" /> CRM Field Mapping</h3>
          <Badge tone="green">مزامنة تلقائية</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {nodes.filter(n => n.crmField).map(n => (
            <div key={n.id} className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
              <div className="text-xs text-slate-300 flex-1 truncate">{n.title}</div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              <Badge tone="green">{n.crmField}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Advanced features grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-2"><UserCheck className="h-4 w-4 text-rose-400" /><h4 className="text-sm font-semibold">Human Handover</h4></div>
          <p className="text-xs text-slate-400">تحويل المحادثة لموظف الكول سنتر مع تمرير كل سياق المحادثة وبيانات CRM.</p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">معدل التحويل</span>
            <Badge tone="red">11.8%</Badge>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2"><Brain className="h-4 w-4 text-cyan-400" /><h4 className="text-sm font-semibold">AI Takeover</h4></div>
          <p className="text-xs text-slate-400">إذا خرج العميل عن الفلو، يتدخل الذكاء الاصطناعي ويرد بناءً على معرفة الشركة.</p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">رضا العملاء</span>
            <Badge tone="blue">94%</Badge>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2"><Flame className="h-4 w-4 text-amber-400" /><h4 className="text-sm font-semibold">Lead Scoring</h4></div>
          <p className="text-xs text-slate-400">كل إجابة تضيف نقاط للعميل تلقائياً، والعملاء الأعلى نقاطاً يصبحون Hot Leads.</p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Hot Leads هذا الشهر</span>
            <Badge tone="yellow">198</Badge>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
