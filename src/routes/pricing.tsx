import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Card } from "@/components/app/AppShell";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "الباقات — LeadFlow" }, { name: "description", content: "خطط اشتراك LeadFlow." }] }),
  component: PricingPage,
});

const PLANS = [
  { name: "Starter", price: "299", desc: "للشركات الصغيرة", features: ["رقم واتساب واحد", "وكيل AI أساسي", "حتى 1,000 محادثة/شهر", "تصنيف عملاء", "مستخدم واحد"] },
  { name: "Growth", price: "799", desc: "للشركات النامية", popular: true, features: ["3 أرقام واتساب", "وكيل AI متقدّم", "حتى 6,000 محادثة/شهر", "حملات + جدولة", "CRM كامل", "حتى 5 مستخدمين"] },
  { name: "Enterprise", price: "تواصل معنا", desc: "للشركات الكبيرة", features: ["أرقام غير محدودة", "وكيل AI مخصّص", "محادثات غير محدودة", "مستخدمون غير محدودين", "تكامل API", "مدير حساب مخصّص", "SLA"] },
];

function PricingPage() {
  return (
    <AppShell title="الباقات" subtitle="اختر الخطة المناسبة لشركتك">
      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <Card key={p.name} className={p.popular ? "ring-2 ring-[#25D366]/40" : ""}>
            {p.popular && <div className="inline-block mb-2 rounded-full bg-[#25D366]/15 px-2 py-0.5 text-[10px] text-[#25D366]">الأكثر طلباً</div>}
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
            <div className="mt-3 text-2xl font-bold text-[#25D366]">{p.price} <span className="text-xs text-slate-400">SAR / شهرياً</span></div>
            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-slate-300"><Check className="h-4 w-4 text-[#25D366]" />{f}</li>
              ))}
            </ul>
            <button className="mt-5 w-full rounded-xl bg-[#25D366] py-2 text-sm font-semibold text-black hover:brightness-110">اختر الباقة</button>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
