import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Badge } from "@/components/app/AppShell";
import { CONVERSATIONS } from "@/lib/demo-data";
import { useState } from "react";
import { Send, Paperclip, Sparkles, Phone, MoreVertical } from "lucide-react";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Team Inbox — LeadFlow" }, { name: "description", content: "صندوق وارد فريقي موحد لمحادثات WhatsApp." }] }),
  component: InboxPage,
});

function InboxPage() {
  const [active, setActive] = useState(CONVERSATIONS[0].id);
  const conv = CONVERSATIONS.find(c => c.id === active)!;

  return (
    <AppShell title="Team Inbox" subtitle="صندوق وارد موحّد لفريق المبيعات">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
        <div className="col-span-12 md:col-span-4 lg:col-span-3 rounded-2xl border border-white/5 bg-[#0f141b] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/5 flex gap-1">
            {["الكل", "مفتوحة", "موكلة لي", "مغلقة"].map((t, i) => (
              <button key={t} className={`rounded-lg px-3 py-1.5 text-xs ${i === 0 ? "bg-[#25D366] text-black" : "bg-white/5 text-slate-300"}`}>{t}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map(c => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`w-full text-right p-3 border-b border-white/5 hover:bg-white/[0.03] transition ${active === c.id ? "bg-[#25D366]/[0.06]" : ""}`}
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
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Badge tone={c.priority === "high" ? "red" : c.priority === "medium" ? "yellow" : "default"}>{c.priority}</Badge>
                      {c.unread > 0 && <span className="rounded-full bg-[#25D366] text-black text-[10px] px-1.5 min-w-[18px] text-center font-bold">{c.unread}</span>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 lg:col-span-6 rounded-2xl border border-white/5 bg-[#0f141b] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xs font-bold">
              {conv.name.slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{conv.name}</div>
              <div className="text-[11px] text-slate-500">{conv.phone} · {conv.agent}</div>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/5"><Phone className="h-4 w-4 text-slate-400" /></button>
            <button className="p-2 rounded-lg hover:bg-white/5"><MoreVertical className="h-4 w-4 text-slate-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0d12]">
            {conv.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "lead" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.from === "lead" ? "bg-white/5 text-slate-100" :
                  m.from === "ai" ? "bg-violet-500/10 text-violet-200 border border-violet-500/20" :
                  "bg-[#25D366] text-black"
                }`}>
                  {m.from === "ai" && <div className="flex items-center gap-1 text-[10px] mb-1 opacity-80"><Sparkles className="h-3 w-3" /> اقتراح AI</div>}
                  <div>{m.text}</div>
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
        </div>

        <div className="hidden lg:flex col-span-3 rounded-2xl border border-white/5 bg-[#0f141b] p-4 flex-col gap-4 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-400">جهة الاتصال (CRM)</div>
              <Link to="/crm" className="text-[10px] text-[#25D366] hover:underline">عرض في CRM ←</Link>
            </div>
            <div className="text-base font-semibold">{conv.name}</div>
            <div className="text-xs text-slate-500">{conv.phone} · {conv.city}</div>
            <div className="mt-1">
              <Badge tone="green">تمت إضافته تلقائياً</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2">
              <div className="text-[10px] text-slate-500">Lead Score</div>
              <div className="text-lg font-bold text-[#25D366]">{conv.score}</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2">
              <div className="text-[10px] text-slate-500">Intent</div>
              <div className="mt-1.5">
                <Badge tone={conv.intent === "High" ? "green" : conv.intent === "Medium" ? "yellow" : "red"}>
                  {conv.intent === "High" ? "عالي" : conv.intent === "Medium" ? "متوسط" : "منخفض"}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
              <Sparkles className="h-3 w-3 text-violet-400" /> AI Summary
            </div>
            <div className="rounded-xl bg-violet-500/[0.06] border border-violet-500/15 p-3 text-xs text-slate-200 leading-relaxed">
              {conv.summary}
            </div>
          </div>

          <div>
            <div className="text-xs text-[#25D366] mb-2">Next Action</div>
            <div className="rounded-xl bg-[#25D366]/[0.06] border border-[#25D366]/20 p-3 text-xs text-slate-100 leading-relaxed">
              {conv.nextAction}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-2">إجراءات سريعة</div>
            <div className="flex flex-col gap-2">
              {["إرسال عرض سعر", "حجز موعد", "تحويل إلى مبيعات", "إنشاء صفقة"].map(a => (
                <button key={a} className="text-xs rounded-lg bg-white/5 hover:bg-white/10 py-2">{a}</button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
