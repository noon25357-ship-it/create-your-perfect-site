import { createFileRoute } from "@tanstack/react-router";
import FlowsListView from "@/components/flows/FlowsListView";

export const Route = createFileRoute("/bot-tree")({
  head: () => ({ meta: [{ title: "شجرة البوت — LeadFlow" }] }),
  component: () => <FlowsListView title="شجرة البوت" subtitle="كل WhatsApp Flows داخل لوحة LeadFlow" basePath="/bot-tree" />,
});
