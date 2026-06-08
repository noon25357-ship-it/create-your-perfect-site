import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell, { Badge } from "@/components/app/AppShell";
import { Modal, Field, inputCls } from "@/components/app/Modal";
import { CONVERSATIONS, PIPELINE, type PipelineStage, type TimelineItem } from "@/lib/demo-data";
import { useInboxStore, inboxActions } from "@/lib/inbox-store";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Send, Paperclip, Sparkles, Phone, MoreVertical, Mail, MapPin, Target, Wallet,
  Zap, Heart, Calendar, Ticket, FileText, UserPlus, MessageSquare, ChevronDown,
  CheckCircle2, AlertTriangle, ClipboardList, ArrowRight, Brain, ListChecks,
  PhoneCall, Tag, BookmarkCheck, Clock, StickyNote, Plus,
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
  message: MessageSquare, stage: ArrowRight, note: StickyNote,
  ticket: Ticket, followup: Calendar, meeting: Calendar, proposal: FileText,
};

const AGENTS = ["محمد العتيبي", "سارة الحربي", "خالد الزهراني", "ليان القحطاني", "عبدالله الفهد"];

type ModalKind = null | "meeting" | "ticket" | "followup" | "proposal" | "assign";

function InboxPage() {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [stageMenu, setStageMenu] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [noteText, setNoteText] = useState("");

  // modal local state
  const [mTitle, setMTitle] = useState("اجتماع تعريفي");
  const [mWhen, setMWhen] = useState("غداً 10:00 ص");
  const [tSubject, setTSubject] = useState("متابعة استفسار العميل");
  const [tPriority, setTPriority] = useState("متوسطة");
  const [fChannel, setFChannel] = useState("WhatsApp");
  const [fWhen, setFWhen] = useState("بعد 24 ساعة");
  const [pPlan, setPPlan] = useState("باقة Pro سنوي");
  const [pAmount, setPAmount] = useState("42,000 ر.س");
  const [aAgent, setAAgent] = useState(AGENTS[0]);

  const store = useInboxStore();
  const convBase = useMemo(() => CONVERSATIONS.find(c => c.id === activeId)!, [activeId]);
  const stage = store.stages[activeId] ?? convBase.stage;
  const timeline = store.timeline[activeId] ?? convBase.timeline;
  const notes = store.notes[activeId] ?? [];
  const agent = store.agents[activeId] ?? convBase.agent;
  const conv = { ...convBase, stage, agent };

  const moveStage = (s: PipelineStage) => {
    if (s === stage) return setStageMenu(false);
    inboxActions.moveStage(activeId, s, stage);
    setStageMenu(false);
    toast.success(`تم نقل العميل إلى مرحلة ${s}`);
  };

  const submitMeeting = () => { inboxActions.scheduleMeeting(activeId, mTitle, mWhen); toast.success("تم جدولة الاجتماع"); };
  const submitTicket  = () => { inboxActions.createTicket(activeId, tSubject, tPriority); toast.success("تم إنشاء تذكرة المتابعة"); };
  const submitFollow  = () => { inboxActions.sendFollowup(activeId, fChannel, fWhen); toast.success("تم جدولة رسالة المتابعة"); };
  const submitProposal= () => { inboxActions.generateProposal(activeId, pPlan, pAmount); toast.success("تم توليد العرض المبدئي"); };
  const submitAssign  = () => { inboxActions.assignAgent(activeId, aAgent); toast.success(`تم إسناد المحادثة إلى ${aAgent}`); };

  const addNote = () => {
    if (!noteText.trim()) return;
    inboxActions.addNote(activeId, noteText.trim());
    setNoteText("");
    toast.success("تمت إضافة الملاحظة الداخلية");
  };

  // AI recommendation derived from score/intent/stage
  const reco = (() => {
    if (conv.score >= 85) return { label: "Call now — اتصل الآن", desc: "العميل جاهز للإغلاق، اتصال مباشر يرفع التحويل +34%.", icon: PhoneCall, tone: "green" as const };
    if (conv.score >= 70) return { label: "Send offer — أرسل عرضاً", desc: "نية شراء قوية، عرض مخصص خلال ساعة يزيد الإغلاق.", icon: Tag, tone: "green" as const };
    if (conv.intent === "Medium") return { label: "Book viewing — احجز عرضاً تجريبياً", desc: "احجز Demo لمدة 20 دقيقة لكسر التردد.", icon: BookmarkCheck, tone: "yellow" as const };
    if (conv.score >= 40) return { label: "Follow up tomorrow — تابع غداً", desc: "أرسل رسالة متابعة بعد 24 ساعة بعرض قيمة جديد.", icon: Clock, tone: "yellow" as const };
    return { label: "Mark as low priority — أولوية منخفضة", desc: "تركيز الجهد على عملاء أعلى احتمالاً للإغلاق.", icon: AlertTriangle, tone: "red" as const };
  })();

  return (
    <AppShell title="Team Inbox" subtitle="إدارة كاملة للعميل من شاشة واحدة">
      <div className="grid grid-cols-12 gap-3 h-[calc(100vh-180px)]">

        {/* ============ LEFT ============ */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-3 rounded-2xl border border-white/5 bg-[#0f141b] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/5 flex gap-1 overflow-x-auto">
            {["الكل", "مفتوحة", "موكلة لي", "مغلقة"].map((t, i) => (
              <button key={t} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs ${i === 0 ? "bg-[#25D366] text-black" : "bg-white/5 text-slate-300"}`}>{t}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map(c => {
              const st = store.stages[c.id] ?? c.stage;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-right p-3 border-b border-white/5 hover:bg-white/[0.03] transition ${activeId === c.id ? "bg-[#25D366]/[0.06]" : ""}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xs font-bold">{c.name.slice(0, 2)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{c.name}</span>
                        <span className="text-[10px] text-slate-500 shrink-0">{c.time}</span>
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">{c.last}</div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Badge tone={STAGE_TONE[st]}>{st}</Badge>
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

        {/* ============ CENTER ============ */}
        <section className="col-span-12 md:col-span-9 lg:col-span-5 rounded-2xl border border-white/5 bg-[#0f141b] overflow-hidden flex flex-col">
          <header className="p-3 border-b border-white/5 flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#25D366] to-emerald-700 flex items-center justify-center text-xs font-bold text-black">{conv.name.slice(0, 2)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{conv.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{conv.phone} · {agent}</div>
            </div>

            <div className="relative">
              <button onClick={() => setStageMenu(v => !v)} className="flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-xs">
                <span className="text-slate-400">Move to:</span>
                <Badge tone={STAGE_TONE[stage]}>{stage}</Badge>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
              {stageMenu && (
                <div className="absolute end-0 mt-1 w-52 rounded-xl border border-white/10 bg-[#0a0d12] p-1 z-30 shadow-2xl">
                  {PIPELINE.map(s => (
                    <button key={s} onClick={() => moveStage(s)}
                      className={`w-full text-right px-3 py-2 text-xs rounded-lg hover:bg-white/5 flex items-center justify-between ${s === stage ? "bg-white/5" : ""}`}>
                      <span>{s}</span>
                      {s === stage && <CheckCircle2 className="h-3.5 w-3.5 text-[#25D366]" />}
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
              <button onClick={() => toast.success("تم إرسال الرسالة")} className="rounded-lg bg-[#25D366] text-black p-2"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </section>

        {/* ============ RIGHT ============ */}
        <aside className="hidden lg:flex col-span-4 rounded-2xl border border-white/5 bg-[#0f141b] flex-col overflow-hidden">
          <div className="overflow-y-auto p-4 space-y-4">

            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#25D366] to-emerald-700 flex items-center justify-center text-sm font-bold text-black">{conv.name.slice(0, 2)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{conv.name}</div>
                <div className="text-[11px] text-slate-500">CT-{conv.id} · مُنشأ تلقائياً</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <Badge tone="green">CRM</Badge>
                  <Badge tone="blue">{conv.source}</Badge>
                  <Badge tone={STAGE_TONE[stage]}>{stage}</Badge>
                </div>
              </div>
              <Link to="/crm" className="text-[10px] text-[#25D366] hover:underline shrink-0">CRM ←</Link>
            </div>

            {/* AI Sales Recommendation */}
            <section className={`rounded-2xl border p-3 ${reco.tone === "green" ? "border-[#25D366]/30 bg-[#25D366]/[0.06]" : reco.tone === "yellow" ? "border-amber-500/30 bg-amber-500/[0.06]" : "border-rose-500/30 bg-rose-500/[0.06]"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Brain className={`h-4 w-4 ${reco.tone === "green" ? "text-[#25D366]" : reco.tone === "yellow" ? "text-amber-400" : "text-rose-400"}`} />
                <h3 className="text-sm font-semibold">AI Sales Recommendation</h3>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <reco.icon className="h-4 w-4" /> {reco.label}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{reco.desc}</p>
              <button onClick={() => toast.success("تم تنفيذ توصية AI")} className="w-full rounded-lg bg-white/10 hover:bg-white/15 py-1.5 text-xs font-medium">تنفيذ التوصية الآن</button>
            </section>

            {/* AI Lead Card */}
            <section className="rounded-2xl border border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/[0.05] to-transparent p-3">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-[#25D366]" />
                <h3 className="text-sm font-semibold">AI Lead Card</h3>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Lead Score</span><span className="text-[#25D366] font-bold text-sm">{conv.score}/100</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#25D366] to-emerald-400" style={{ width: `${conv.score}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Tile icon={Target} label="Intent" value={conv.intent} tone={conv.intent === "High" ? "green" : conv.intent === "Medium" ? "yellow" : "red"} />
                <Tile icon={Wallet} label="Budget" value={conv.budget} />
                <Tile icon={MapPin} label="Location" value={conv.city} />
                <Tile icon={Heart} label="Interest" value={conv.interest} />
                <Tile icon={ListChecks} label="Stage" value={stage} />
                <Tile icon={Mail} label="Email" value={conv.email} />
              </div>
              <div className="mt-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/25 p-2.5">
                <div className="text-[10px] text-[#25D366] mb-1 flex items-center gap-1"><ArrowRight className="h-3 w-3" /> Next Action</div>
                <p className="text-xs text-slate-100 leading-relaxed">{conv.nextAction}</p>
              </div>
            </section>

            {/* AI Summary */}
            <section className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-violet-300" /><h3 className="text-sm font-semibold">AI Summary</h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed mb-2">{conv.summary}</p>
              <SumRow label="آخر طلب" value={conv.lastRequest} />
              <SumRow label="الاعتراضات" value={conv.objections.length ? conv.objections.join(" · ") : "لا يوجد"} />
              <SumRow label="حالة العميل" value={conv.customerStatus} last />
            </section>

            {/* Quick Actions */}
            <section>
              <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5"><Zap className="h-3 w-3" /> إجراءات سريعة</div>
              <div className="grid grid-cols-2 gap-2">
                <QA icon={Calendar} label="Schedule Meeting" onClick={() => setModal("meeting")} />
                <QA icon={Ticket} label="Create Ticket" onClick={() => setModal("ticket")} />
                <QA icon={MessageSquare} label="Send Follow-up" onClick={() => setModal("followup")} />
                <QA icon={FileText} label="Generate Proposal" onClick={() => setModal("proposal")} />
                <QA icon={UserPlus} label="Assign Agent" onClick={() => setModal("assign")} className="col-span-2" />
              </div>
            </section>

            {/* Internal Notes */}
            <section>
              <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5"><StickyNote className="h-3 w-3" /> ملاحظات داخلية</div>
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2 mb-2">
                <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                  placeholder="أضف ملاحظة داخلية يراها الفريق فقط..."
                  rows={2}
                  className="w-full bg-transparent outline-none text-xs placeholder:text-slate-500 resize-none" />
                <div className="flex justify-end">
                  <button onClick={addNote} className="rounded-lg bg-[#25D366] text-black px-2.5 py-1 text-[11px] font-medium flex items-center gap-1">
                    <Plus className="h-3 w-3" /> إضافة
                  </button>
                </div>
              </div>
              {notes.length === 0 && <div className="text-[11px] text-slate-500 text-center py-2">لا توجد ملاحظات بعد</div>}
              <div className="space-y-2">
                {notes.map(n => (
                  <div key={n.id} className="rounded-xl bg-amber-500/[0.05] border border-amber-500/15 p-2.5">
                    <p className="text-xs text-slate-100">{n.text}</p>
                    <div className="text-[10px] text-slate-500 mt-1">{n.author} · {n.time}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Timeline */}
            <section>
              <div className="text-xs text-slate-400 mb-3 flex items-center gap-1.5"><ClipboardList className="h-3 w-3" /> سجل النشاطات</div>
              <ol className="relative border-s border-white/10 ms-1.5 space-y-3 pe-2">
                {timeline.map(t => {
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

      {/* ============ MODALS ============ */}
      <Modal open={modal === "meeting"} onClose={() => setModal(null)} title="جدولة اجتماع" onSubmit={submitMeeting}>
        <Field label="عنوان الاجتماع"><input className={inputCls} value={mTitle} onChange={e => setMTitle(e.target.value)} /></Field>
        <Field label="الموعد"><input className={inputCls} value={mWhen} onChange={e => setMWhen(e.target.value)} /></Field>
        <Field label="القناة">
          <select className={inputCls} defaultValue="Zoom"><option>Zoom</option><option>Google Meet</option><option>حضوري</option></select>
        </Field>
      </Modal>

      <Modal open={modal === "ticket"} onClose={() => setModal(null)} title="إنشاء تذكرة" onSubmit={submitTicket}>
        <Field label="موضوع التذكرة"><input className={inputCls} value={tSubject} onChange={e => setTSubject(e.target.value)} /></Field>
        <Field label="الأولوية">
          <select className={inputCls} value={tPriority} onChange={e => setTPriority(e.target.value)}>
            <option>منخفضة</option><option>متوسطة</option><option>عالية</option><option>عاجلة</option>
          </select>
        </Field>
      </Modal>

      <Modal open={modal === "followup"} onClose={() => setModal(null)} title="إرسال متابعة" onSubmit={submitFollow}>
        <Field label="القناة">
          <select className={inputCls} value={fChannel} onChange={e => setFChannel(e.target.value)}>
            <option>WhatsApp</option><option>Email</option><option>SMS</option>
          </select>
        </Field>
        <Field label="الموعد"><input className={inputCls} value={fWhen} onChange={e => setFWhen(e.target.value)} /></Field>
        <Field label="القالب">
          <select className={inputCls} defaultValue="تذكير لطيف"><option>تذكير لطيف</option><option>عرض مخصص</option><option>طلب رأي</option></select>
        </Field>
      </Modal>

      <Modal open={modal === "proposal"} onClose={() => setModal(null)} title="توليد عرض سعر" onSubmit={submitProposal}>
        <Field label="الباقة">
          <select className={inputCls} value={pPlan} onChange={e => setPPlan(e.target.value)}>
            <option>باقة Starter</option><option>باقة Growth</option><option>باقة Pro سنوي</option><option>Enterprise</option>
          </select>
        </Field>
        <Field label="المبلغ"><input className={inputCls} value={pAmount} onChange={e => setPAmount(e.target.value)} /></Field>
        <Field label="ملاحظات للعميل"><textarea rows={2} className={inputCls} defaultValue="عرض حصري ساري لمدة 7 أيام." /></Field>
      </Modal>

      <Modal open={modal === "assign"} onClose={() => setModal(null)} title="إسناد المحادثة" onSubmit={submitAssign}>
        <Field label="اختر الموظف">
          <select className={inputCls} value={aAgent} onChange={e => setAAgent(e.target.value)}>
            {AGENTS.map(a => <option key={a}>{a}</option>)}
          </select>
        </Field>
        <Field label="ملاحظة (اختياري)"><textarea rows={2} className={inputCls} placeholder="سبب الإسناد..." /></Field>
      </Modal>
    </AppShell>
  );
}

function Tile({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone?: "green" | "yellow" | "red" }) {
  return (
    <div className="rounded-lg bg-white/[0.04] border border-white/5 p-2">
      <div className="flex items-center gap-1 text-[10px] text-slate-500"><Icon className="h-3 w-3" /> {label}</div>
      {tone ? <div className="mt-1"><Badge tone={tone}>{value}</Badge></div> : <div className="text-[11px] text-slate-100 mt-0.5 truncate">{value}</div>}
    </div>
  );
}

function SumRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 py-1.5 ${last ? "" : "border-b border-white/5"}`}>
      <span className="text-[10px] text-slate-500">{label}</span>
      <span className="text-xs text-slate-200">{value}</span>
    </div>
  );
}

function QA({ icon: Icon, label, onClick, className = "" }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 py-2 text-xs text-slate-200 ${className}`}>
      <Icon className="h-3.5 w-3.5 text-[#25D366]" /> {label}
    </button>
  );
}
