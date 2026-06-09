import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/app/AppShell";
import { LiveFlow } from "@/components/LeadFlow";

export const Route = createFileRoute("/live-demo")({
  head: () => ({ meta: [{ title: "العرض الحي — LeadFlow" }, { name: "description", content: "رحلة عميل WhatsApp كاملة — مباشرة." }] }),
  component: LiveDemoPage,
});

function LiveDemoPage() {
  return (
    <AppShell title="العرض الحي" subtitle="رحلة عميل WhatsApp كاملة من الرسالة إلى الصفقة">
      <div className="wa-root" dir="rtl">
        <LiveFlow lang="ar" />
      </div>
    </AppShell>
  );
}
