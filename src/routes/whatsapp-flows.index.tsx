import { createFileRoute } from "@tanstack/react-router";
import FlowsListView from "@/components/flows/FlowsListView";

export const Route = createFileRoute("/whatsapp-flows/")({
  head: () => ({ meta: [{ title: "WhatsApp Flows — مسار" }] }),
  component: () => <FlowsListView title="WhatsApp Flows" basePath="/whatsapp-flows" />,
});
