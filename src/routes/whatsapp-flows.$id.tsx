import { createFileRoute } from "@tanstack/react-router";
import FlowBuilderView from "@/components/flows/FlowBuilderView";

export const Route = createFileRoute("/whatsapp-flows/$id")({
  head: () => ({ meta: [{ title: "Flow Builder — LeadFlow" }] }),
  component: WaFlowBuilderRoute,
});

function WaFlowBuilderRoute() {
  const { id } = Route.useParams();
  return <FlowBuilderView flowId={id} backTo="/whatsapp-flows" />;
}
