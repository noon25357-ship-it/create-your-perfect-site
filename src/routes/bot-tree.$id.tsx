import { createFileRoute } from "@tanstack/react-router";
import FlowBuilderView from "@/components/flows/FlowBuilderView";

export const Route = createFileRoute("/bot-tree/$id")({
  head: () => ({ meta: [{ title: "محرر الشجرة — LeadFlow" }] }),
  component: BotTreeBuilderRoute,
});

function BotTreeBuilderRoute() {
  const { id } = Route.useParams();
  return <FlowBuilderView flowId={id} backTo="/bot-tree" />;
}
