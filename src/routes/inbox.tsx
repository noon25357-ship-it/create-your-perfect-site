import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell, { Badge } from "@/components/app/AppShell";
import { CONVERSATIONS, PIPELINE, type PipelineStage, type TimelineItem } from "@/lib/demo-data";
import { useMemo, useState } from "react";
import {
  Send, Paperclip, Sparkles, Phone, MoreVertical, Mail, MapPin, Target, Wallet,
  Zap, Heart, Calendar, Ticket, FileText, UserPlus, MessageSquare, ChevronDown,
  CheckCircle2, AlertTriangle, ClipboardList, ArrowRight, Brain, ListChecks,
} from "lucide-react";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Team Inbox — LeadFlow" }, { name: "description", content: "صندوق وارد فريقي موحد مع CRM ذكي." }] }),
  component: InboxPage,
});

const STAGE_TONE: Record<PipelineStage, "default" | "blue" | "purple" | "yellow" | "green" | "red"> = {
  "New Lead": "blue", "Qualified": "purple", "Interested": "purple",
  "Meeting Scheduled": "yellow", "Proposal Sent": "yellow", "Negotiation": "yellow",
  "Won": "green", "Lost": "red",
};

const TIMELINE_ICON: Record<TimelineItem["type"], React.ComponentType<{ className?: string }>> = {
  message: MessageSquare, stage: ArrowRight, note: ClipboardList,
  ticket: Ticket, followup: Calendar, meeting: Calendar, proposal: FileText,
};

function InboxPage() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [stageOverrides, setStageOverrides] = useState<Record<string, PipelineStage>>({});
  const [stageMenu, setStageMenu] = useState(false);

  const convBase = useMemo(() => CONVERSATIONS.find(c => c.id === activeId)!, [activeId]);
  const conv = { ...convBase, stage: stageOverrides[activeId] ?? convBase.stage };

  const moveStage = (s: PipelineStage) => {
    setStageOverrides(prev => ({ ...prev, [activeId]: s }));
    setStageMenu(false);
  };

  return (
    <AppShell title="Team Inbox" subtitle="صندوق وارد موحّد ↔ CRM ذكي">
      <div className="grid grid-cols-12 gap-3 h-[calc(100vh-180px)]">

        {/* ============ LEFT: Conversation list ============ */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-3 rounded-2xl border border-white/5 bg-[#0f141b] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/5 flex gap-1 overflow-x-auto">
            {["الكل", "مفتوحة", "موكلة لي", "مغلقة"].map((t, i) => (
              <button key={t} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs ${i === 0 ? "bg-[#25D366] text-black" : "bg-white/5 text-slate-300"}`}>{t}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map(c => {
              const stage = stageOverrides[c.id] ?? c.stage;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-right p-3 border-b border-white/5 hover:bg-white/[0.03] transition ${activeId === c.id ? "bg-[#25D366]/[0.06]" : ""}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xs font-bold">
                      {c.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{c.name}</span>
                        <span className="text-[10px] text-slate-500 shrink-0">{c.time}</span>
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">{c.last}</div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Badge tone={STAGE_TONE[stage]}>{stage}</Badge>
                        <span className="text-[10px] text-slate-500">Score {c.score}</span>
                        {c.unread > 0 && <span className="ms-auto rounded-full bg-[#25D366] text-black text-[10px] px-1.5 min-w-[18px] text-center font-bold">{c.unread}</span>}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ============ CENTER: Chat ============ */}
        <section className="col-span-12 md:col-span-9 lg:col-span-5 rounded-2xl border border-white/5 bg-[#0f141b] overflow-hidden flex flex-col">
          <header className="p-3 border-b border-white/5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#25D366] to-emerald-700 flex items-center justify-center text-xs font-bold text-black">
              {conv.name.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{conv.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{conv.phone} · {conv.agent}</div>
            </div>

            {/* Move to pipeline */}
            <div className="relative">
              <button
                onClick={() => setStageMenu(v => !v)}
                className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-xs"
              >
                <span className="text-slate-400">Move to:</span>
                <Badge tone={STAGE_TONE[conv.stage]}>{conv.stage}</Badge>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              {stageMenu && (
                <div className="absolute end-0 mt-1 w-48 rounded-xl border border-white/10 bg-[#0a0d12] p-1 z-20 shadow-2xl">
                  {PIPELINE.map(s => (
                    <button
                      key={s}
                      onClick={() => moveStage(s)}
                      className={`w-full text-right px-3 py-2 text-xs rounded-lg hover:bg-white/5 flex items-center justify-between ${s === conv.stage ? "bg-white/5" : ""}`}
                    >
                      <span>{s}</span>
                      {s === conv.stage && <CheckCircle2 className="h-3.5 w-3.5 text-[#25D366]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-2 rounded-lg hover:bg-white/5"><Phone className="h-4 w-4 text-slate-400" /></button>
            <button className="p-2 rounded-lg hover:bg-white/5"><MoreVertical className="h-4 w-4 text-slate-400" /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0d12]">
            {conv.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "lead" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.from === "lead" ? "bg-white/5 text-slate-100" :
                  m.from === "ai" ? "bg-violet-500/10 text-violet-200 border border-violet-500/20" :
                  "bg-[#25D366] text-black"
                }`}>
                  {m.from === "ai" && <div className="flex items-center gap-1 text-[10px] mb-1 opacity-80"><Sparkles className="h-3 w-3" /> اقتراح AI</div>}
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div className={`text-[10px] mt-1 ${m.from === "agent" ? "text-black/60" : "text-slate-500"}`}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
              <button><Paperclip className="h-4 w-4 text-slate-400" /></button>
              <input placeholder="اكتب رسالتك..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500" />
              <button className="rounded-lg bg-violet-500/15 text-violet-300 px-2 py-1 text-xs flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI</button>
              <button className="rounded-lg bg-[#25D366] text-black p-2"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </section>

        {/* ============ RIGHT: CRM 360° ============ */}
        <aside className="hidden lg:flex col-span-4 rounded-2xl border border-white/5 bg-[#0f141b] flex-col overflow-hidden">
          <div className="overflow-y-auto p-4 space-y-4">

            {/* Contact header */}
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#25D366] to-emerald-700 flex items-center justify-center text-sm font-bold text-black">
                {conv.name.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{conv.name}</div>
                <div className="text-[11px] text-slate-500">CT-{conv.id} · مُنشأ تلقائياً</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <Badge tone="green">CRM</Badge>
                  <Badge tone="blue">{conv.source}</Badge>
                  <Badge tone={STAGE_TONE[conv.stage]}>{conv.stage}</Badge>
                </div>
              </div>
              <Link to="/crm" className="text-[10px] text-[#25D366] hover:underline shrink-0">عرض في CRM ←</Link>
            </div>

            {/* AI LEAD CARD */}
            <section className="rounded-2xl border border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/[0.05] to-transparent p-3">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-[#25D366]" />
                <h3 className="text-sm font-semibold">AI Lead Card</h3>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Lead Score</span>
                  <span className="text-[#25D366] font-bold text-sm">{conv.score}/100</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#25D366] to-emerald-400" style={{ width: `${conv.score}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <InfoTile icon={Target} label="Intent" value={conv.intent === "High" ? "عالي" : conv.intent === "Medium" ? "متوسط" : "منخفض"} tone={conv.intent === "High" ? "green" : conv.intent === "Medium" ? "yellow" : "red"} />
                <InfoTile icon={Wallet} label="Budget" value={conv.budget} />
                <InfoTile icon={MapPin} label="Location" value={conv.city} />
                <InfoTile icon={Heart} label="Interest" value={conv.interest} />
                <InfoTile icon={ListChecks} label="Stage" value={conv.stage} />
                <InfoTile icon={Mail} label="Email" value={conv.email} />
              </div>

              <div className="mt-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/25 p-2.5">
                <div className="text-[10px] text-[#25D366] mb-1 flex items-center gap-1"><ArrowRight className="h-3 w-3" /> Next Action</div>
                <p className="text-xs text-slate-100 leading-relaxed">{conv.nextAction}</p>
              </div>
            </section>

            {/* AI SUMMARY PANEL */}
            <section className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-violet-300" />
                <h3 className="text-sm font-semibold">AI Summary</h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed mb-3">{conv.summary}</p>

              <SummaryRow label="آخر طلب" value={conv.lastRequest} />
              <SummaryRow
                label="الاعتراضات"
                value={
                  conv.objections.length ? (
                    <ul className="space-y-1">
                      {conv.objections.map((o, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <span className="text-slate-500">لا يوجد</span>
                }
              />
              <SummaryRow label="حالة العميل" value={<Badge tone={conv.score >= 80 ? "green" : conv.score >= 50 ? "yellow" : "red"}>{conv.customerStatus}</Badge>} />
              <SummaryRow label="الخطوة القادمة" value={conv.nextAction} last />
            </section>

            {/* QUICK ACTIONS */}
            <section>
              <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                <Zap className="h-3 w-3" /> إجراءات سريعة
              </div>
              <div className="grid grid-cols-2 gap-2">
                <QuickAction icon={Calendar} label="حجز اجتماع" />
                <QuickAction icon={Ticket} label="إنشاء تذكرة" />
                <QuickAction icon={MessageSquare} label="رسالة متابعة" />
                <QuickAction icon={FileText} label="توليد عرض سعر" />
                <QuickAction icon={UserPlus} label="إسناد موظف" className="col-span-2" />
              </div>
            </section>

            {/* ACTIVITY TIMELINE */}
            <section>
              <div className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
                <ClipboardList className="h-3 w-3" /> سجل النشاطات
              </div>
              <ol className="relative border-s border-white/10 ms-1.5 space-y-3 pe-2">
                {conv.timeline.map(t => {
                  const Icon = TIMELINE_ICON[t.type];
                  return (
                    <li key={t.id} className="ms-4 relative">
                      <span className="absolute -start-[22px] top-0.5 h-4 w-4 rounded-full bg-[#0f141b] border border-white/15 flex items-center justify-center">
                        <Icon className="h-2.5 w-2.5 text-[#25D366]" />
                      </span>
                      <div className="text-xs font-medium text-slate-100">{t.title}</div>
                      {t.detail && <div className="text-[11px] text-slate-400 mt-0.5">{t.detail}</div>}
                      <div className="text-[10px] text-slate-500 mt-0.5">{t.time} · {t.actor}</div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function InfoTile({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone?: "green" | "yellow" | "red" }) {
  return (
    <div className="rounded-lg bg-white/[0.04] border border-white/5 p-2">
      <div className="flex items-center gap-1 text-[10px] text-slate-500"><Icon className="h-3 w-3" /> {label}</div>
      {tone ? (
        <div className="mt-1"><Badge tone={tone}>{value}</Badge></div>
      ) : (
        <div className="text-[11px] text-slate-100 mt-0.5 truncate">{value}</div>
      )}
    </div>
  );
}

function SummaryRow({ label, value, last }: { label: string; value: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 py-2 ${last ? "" : "border-b border-white/5"}`}>
      <span className="text-[10px] text-slate-500">{label}</span>
      <div className="text-xs text-slate-200">{value}</div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, className = "" }: { icon: React.ComponentType<{ className?: string }>; label: string; className?: string }) {
  return (
    <button className={`flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 py-2 text-xs text-slate-200 ${className}`}>
      <Icon className="h-3.5 w-3.5 text-[#25D366]" />
      {label}
    </button>
  );
}
