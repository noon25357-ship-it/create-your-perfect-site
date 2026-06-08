import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import { CAMPAIGN_TEMPLATES } from "@/lib/demo-data";
import { useState } from "react";
import { Sparkles, Send, Wand2, Target, Users, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/campaigns")({
  head: () => ({ meta: [{ title: "AI Campaign Builder — LeadFlow" }, { name: "description", content: "إنشاء حملات WhatsApp بالذكاء الاصطناعي." }] }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const [goal, setGoal] = useState("Conversion");
  const [audience, setAudience] = useState("عملاء Pipeline نشطون");
  const [tone, setTone] = useState("ودّي");
  const [prompt, setPrompt] = useState("حملة عرض الجمعة البيضاء على باقة Pro بخصم 20%");

  const generated = `🎉 خصم حصري لعملائنا المميزين!

أهلاً [الاسم] 👋
بمناسبة الجمعة البيضاء، نقدم لك *خصم 20%* على باقة Pro لفترة محدودة جداً.

✅ دعم على مدار الساعة
✅ تكامل مع جميع أنظمتك
✅ تقارير ذكية بالـ AI

اضغط هنا للاستفادة من العرض 👇
${"`leadflow.app/pro-offer`"}

العرض ساري حتى يوم الجمعة فقط ⏳`;

  return (
    <AppShell title="AI Campaign Builder" subtitle="أنشئ حملات WhatsApp تتحوّل، بالذكاء الاصطناعي">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="حملات نشطة" value="6" delta="+2 هذا الشهر" />
        <Stat label="معدل الفتح" value="78%" delta="+12% vs Email" accent="#34d399" />
        <Stat label="معدل التحويل" value="14.2%" delta="+3.4% MoM" accent="#60a5fa" />
        <Stat label="إيراد محقق" value="412k" delta="ر.س من الحملات" accent="#a78bfa" />
      </div>

      <div className="grid lg:grid-cols-5 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="h-4 w-4 text-[#25D366]" />
            <h3 className="font-semibold">مولّد الحملات</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block flex items-center gap-1.5"><Target className="h-3 w-3" /> هدف الحملة</label>
              <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none">
                {["Awareness", "Conversion", "Retention", "Re-engagement"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block flex items-center gap-1.5"><Users className="h-3 w-3" /> الجمهور</label>
              <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none">
                {["عملاء Pipeline نشطون", "عملاء خاملون 30+ يوم", "عملاء VIP", "عملاء جدد"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">النبرة</label>
              <div className="flex gap-2">
                {["ودّي", "احترافي", "حماسي", "موجز"].map(t => (
                  <button key={t} onClick={() => setTone(t)} className={`rounded-lg px-3 py-1.5 text-xs ${tone === t ? "bg-[#25D366] text-black" : "bg-white/5 text-slate-300"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">وصف العرض</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none resize-none" />
            </div>
            <button className="w-full rounded-xl bg-[#25D366] text-black font-medium py-2.5 flex items-center justify-center gap-2 hover:brightness-110">
              <Sparkles className="h-4 w-4" /> توليد الحملة بالـ AI
            </button>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#25D366]" />
              <h3 className="font-semibold">معاينة الرسالة</h3>
            </div>
            <Badge tone="green">جاهزة للإرسال</Badge>
          </div>
          <div className="rounded-2xl bg-[#0a0d12] p-4 border border-white/5">
            <div className="max-w-sm mx-auto bg-[#0b141a] rounded-3xl p-3 border border-white/10">
              <div className="bg-[#005c4b] text-white rounded-2xl rounded-tr-sm p-3 text-sm whitespace-pre-wrap leading-relaxed">
                {generated}
              </div>
              <div className="text-[10px] text-slate-500 text-right mt-1">10:24 ✓✓</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <div className="text-[10px] text-slate-500">جمهور مستهدف</div>
              <div className="text-lg font-bold mt-0.5">3,420</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <div className="text-[10px] text-slate-500">فتح متوقع</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">82%</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <div className="text-[10px] text-slate-500">إيراد متوقع</div>
              <div className="text-lg font-bold text-[#25D366] mt-0.5">96k</div>
            </div>
          </div>
          <button className="w-full mt-4 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] font-medium py-2.5 flex items-center justify-center gap-2 hover:bg-[#25D366]/15">
            <Send className="h-4 w-4" /> جدولة الإرسال
          </button>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-4">قوالب جاهزة</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {CAMPAIGN_TEMPLATES.map(t => (
            <div key={t.id} className="rounded-xl bg-white/[0.03] border border-white/5 p-4 hover:border-[#25D366]/30 cursor-pointer transition">
              <Badge tone="purple">{t.goal}</Badge>
              <div className="text-sm font-medium mt-2">{t.name}</div>
              <div className="text-[11px] text-slate-500 mt-1">{t.channel}</div>
              <div className="text-xs text-emerald-400 mt-2">{t.est}</div>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
