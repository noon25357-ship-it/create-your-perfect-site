import { createFileRoute } from "@tanstack/react-router";
import LeadFlow from "@/components/LeadFlow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeadFlow — WhatsApp AI Sales Hub" },
      { name: "description", content: "WhatsApp AI sales and lead management hub." },
      { property: "og:title", content: "LeadFlow — WhatsApp AI Sales Hub" },
      { property: "og:description", content: "WhatsApp AI sales and lead management hub." },
    ],
  }),
  component: LeadFlow,
});
