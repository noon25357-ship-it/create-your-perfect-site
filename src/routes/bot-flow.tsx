import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/bot-flow")({
  component: () => <Navigate to="/bot-tree" replace />,
});
