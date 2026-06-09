import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import AppShell, { Badge, Card } from "@/components/app/AppShell";
import {
  ArrowLeftRight, ArrowLeft, Bot, Brain, Database, GitBranch, Grip, MessageSquare,
  Phone, Play, Plus, Save, Send, Sparkles, Ticket, Trash2, UserCheck, Users, Wand2, X,
} from "lucide-react";
import {
  deleteFlow, updateFlow, useFlow, type FlowNode, type NodeKind,
} from "@/lib/flows-store";
import { STATUS_STYLE } from "./FlowsListView";

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

export default function FlowBuilderView({ flowId, backTo = "/bot-tree" }: { flowId: string; backTo?: string }) {
  const flow = useFlow(flowId);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>(flow?.nodes[0]?.id ?? "");
  const [aiPrompt, setAiPrompt] = useState("أنشئ بوت عقاري");
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const nodes = flow?.nodes ?? [];
  const edges = flow?.edges ?? [];
  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const canvasHeight = useMemo(() => Math.max(1500, ...nodes.map((n) => n.y + 180)), [nodes]);

  if (!flow) {
    return (
      <AppShell title="شجرة غير موجودة">
        <Card className="grid place-items-center py-16 text-center">
          <p className="text-slate-300">لم يتم العثور على الشجرة المطلوبة.</p>
          <Link to={backTo as any} className="mt-4 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-black">رجوع للقائمة</Link>
        </Card>
      </AppShell>
    );
  }

  function setNodes(updater: (cur: FlowNode[]) => FlowNode[]) {
    if (!flow) return;
    updateFlow(flow.id, { nodes: updater(flow.nodes) });
  }
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
          <Link to={backTo as any} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
            <ArrowLeft className="h-3.5 w-3.5" /> رجوع
          </Link>
          <button onClick={() => { updateFlow(flow.id, {}); toast.success("تم الحفظ"); }}
            className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-semibold text-black hover:brightness-110">
            <Save className="h-3.5 w-3.5" /> حفظ
          </button>
          <button onClick={() => { updateFlow(flow.id, { status: "Published" }); toast.success("تم النشر"); }}
            className="flex items-center gap-1.5 rounded-xl bg-[#5b46f5] px-3 py-2 text-xs font-semibold text-white hover:brightness-110">
            Publish
          </button>
        </div>
      }
    >
      <Card className="!p-3 flex flex-wrap items-center gap-3 text-xs">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 ring-1 ${STATUS_STYLE[flow.status]}`}>{flow.status}</span>
        <span className="text-slate-400">Type: <span className="text-slate-200">{flow.type}</span></span>
        <span className="text-slate-400">Trigger: <span className="text-slate-200">{flow.triggerType}</span></span>
        <span className="text-slate-400">Language: <span className="text-slate-200">{flow.language}</span></span>
        <span className="text-slate-400">Modified: <span className="text-slate-200">{flow.modifiedAt}</span></span>
        <span className="text-slate-400">Runs: <span className="text-slate-200">{flow.runs}</span></span>
        <button onClick={() => { deleteFlow(flow.id); toast("تم الحذف"); navigate({ to: backTo as any }); }}
          className="ml-auto flex items-center gap-1 text-rose-300 hover:text-rose-200">
          <Trash2 className="h-3.5 w-3.5" /> حذف
        </button>
      </Card>

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
                <div className="text-[10px] text-emerald-100">{flow.name}</div>
              </div>
            </div>
            <Phone className="h-4 w-4 opacity-75" />
          </div>
          <div className="space-y-2 bg-[#0b141a] p-3">
            {nodes.slice(0, 4).map((n) => (
              <div key={n.id} className="max-w-[88%] rounded-2xl rounded-tr-md bg-[#202c33] px-3 py-2 text-xs text-slate-100">
                {n.body}
                {n.options?.length ? (
                  <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-2">
                    {n.options.slice(0, 4).map((o) => (
                      <button key={o} className="rounded-lg bg-[#2a3942] px-2 py-1 text-[11px] text-sky-300">{o}</button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-white/5 bg-[#1f2c33] p-2">
            <input disabled value="Preview only" readOnly className="flex-1 rounded-full bg-[#2a3942] px-3 py-2 text-xs text-slate-300 outline-none" />
            <Send className="h-4 w-4 text-slate-400" />
          </div>
        </Card>
      </div>

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
