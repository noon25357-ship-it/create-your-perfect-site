import { createFileRoute } from "@tanstack/react-router";
import FlowBuilderView from "@/components/flows/FlowBuilderView";

export const Route = createFileRoute("/flow-builder/$id")({
  head: () => ({ meta: [{ title: "Flow Builder — LeadFlow" }] }),
  component: FlowBuilderRoute,
});

function FlowBuilderRoute() {
  const { id } = Route.useParams();
  return <FlowBuilderView flowId={id} backTo="/bot-tree" />;
}
