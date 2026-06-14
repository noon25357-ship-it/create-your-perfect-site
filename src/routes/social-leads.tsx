import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Card, Stat, Badge } from "@/components/app/AppShell";
import { Instagram, MessageCircle, AtSign, Music2 } from "lucide-react";

export const Route = createFileRoute("/social-leads")({
  head: () => ({ meta: [{ title: "فرص السوشال — مسار" }, { name: "description", content: "عملاء محتملون من قنوات التواصل الاجتماعي." }] }),
  component: SocialLeadsPage,
});

const LEADS = [
  { id: "s1", name: "ريم العتيبي", source: "Instagram", icon: Instagram, message: "كم سعر شقة النرجس؟", time: "قبل 5 د", intent: "High" as const },
  { id: "s2", name: "خالد القحطاني", source: "TikTok", icon: Music2, message: "أبغى تفاصيل التمويل", time: "قبل 12 د", intent: "Medium" as const },
  { id: "s3", name: "نوف الشمري", source: "Messenger", icon: MessageCircle, message: "متى أقرب موعد معاينة؟", time: "قبل 25 د", intent: "High" as const },
  { id: "s4", name: "سعد الدوسري", source: "Threads", icon: AtSign, message: "هل في خصم للدفع كاش؟", time: "قبل ساعة", intent: "Medium" as const },
];

function SocialLeadsPage() {
  return (
    <AppShell title="فرص السوشال" subtitle="عملاء محتملون من Instagram, TikTok, Messenger, Threads">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Instagram" value="142" delta="هذا الأسبوع" accent="#ec4899" />
        <Stat label="TikTok" value="89" delta="هذا الأسبوع" accent="#22d3ee" />
        <Stat label="Messenger" value="56" delta="هذا الأسبوع" accent="#60a5fa" />
        <Stat label="Threads" value="34" delta="هذا الأسبوع" accent="#a78bfa" />
      </div>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-xs text-slate-400">
            <tr><th className="px-4 py-3 text-right">العميل</th><th className="px-4 py-3 text-right">المصدر</th><th className="px-4 py-3 text-right">الرسالة</th><th className="px-4 py-3 text-right">النية</th><th className="px-4 py-3 text-right">الوقت</th></tr>
          </thead>
          <tbody>
            {LEADS.map((l) => { const I = l.icon; return (
              <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-xs text-slate-300"><I className="h-3.5 w-3.5" />{l.source}</span></td>
                <td className="px-4 py-3 text-slate-300">{l.message}</td>
                <td className="px-4 py-3"><Badge tone={l.intent === "High" ? "green" : "yellow"}>{l.intent === "High" ? "عالي" : "متوسط"}</Badge></td>
                <td className="px-4 py-3 text-xs text-slate-500">{l.time}</td>
              </tr>
            );})}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
