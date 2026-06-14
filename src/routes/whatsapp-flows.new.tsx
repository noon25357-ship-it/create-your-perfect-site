import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { createFlow } from "@/lib/flows-store";
import AppShell, { Card } from "@/components/app/AppShell";

export const Route = createFileRoute("/whatsapp-flows/new")({
  head: () => ({ meta: [{ title: "إنشاء Flow — مسار" }] }),
  component: NewFlowRoute,
});

function NewFlowRoute() {
  const navigate = useNavigate();
  const created = useRef(false);
  useEffect(() => {
    if (created.current) return;
    created.current = true;
    const f = createFlow("شجرة جديدة");
    navigate({ to: "/whatsapp-flows/$id", params: { id: f.id }, replace: true });
  }, [navigate]);
  return (
    <AppShell title="إنشاء Flow">
      <Card className="grid place-items-center py-16 text-sm text-slate-400">جاري إنشاء شجرة جديدة...</Card>
    </AppShell>
  );
}
