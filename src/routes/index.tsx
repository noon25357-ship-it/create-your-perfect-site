import { createFileRoute } from "@tanstack/react-router";
import LeadFlow from "@/components/LeadFlow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مسار — منصة واتساب ذكية لتحويل المحادثات إلى عملاء ومبيعات" },
      { name: "description", content: "مسار — منصة واتساب ذكية لتحويل المحادثات إلى عملاء ومبيعات." },
      { property: "og:title", content: "مسار — منصة واتساب ذكية لتحويل المحادثات إلى عملاء ومبيعات" },
      { property: "og:description", content: "مسار — منصة واتساب ذكية لتحويل المحادثات إلى عملاء ومبيعات." },
    ],
  }),
  component: LeadFlow,
});
