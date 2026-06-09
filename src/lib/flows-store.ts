// Shared store for WhatsApp Flows / Bot Trees. In-memory + simple subscribe.
import { useEffect, useSyncExternalStore } from "react";

export type FlowStatus = "Draft" | "Published" | "Deprecated" | "Blocked";
export type FlowType = "Inbound" | "Outbound";
export type NodeKind = "start" | "question" | "collect" | "ai" | "crm" | "ticket" | "handover" | "end";

export type FlowNode = {
  id: string; kind: NodeKind; title: string; body: string;
  options?: string[]; crmField?: string; x: number; y: number;
};
export type FlowEdge = { from: string; to: string; label?: string };

export type Flow = {
  id: string;
  name: string;
  status: FlowStatus;
  type: FlowType;
  category: string;
  runs: number;
  modifiedAt: string;
  language: "ar" | "en" | "ar-en";
  triggerType: "keyword" | "webhook" | "campaign" | "manual";
  nodes: FlowNode[];
  edges: FlowEdge[];
};

const DEFAULT_NODES: FlowNode[] = [
  { id: "start", kind: "start", title: "Start", body: "أول رسالة واردة من العميل", x: 360, y: 24 },
  { id: "lang", kind: "question", title: "اختيار اللغة", body: "اختر اللغة المناسبة", options: ["العربية", "English"], x: 360, y: 180 },
  { id: "menu-ar", kind: "question", title: "الخدمة المطلوبة", body: "ما الخدمة التي تريدها؟", options: ["شراء عقار", "إيجار", "تمويل", "موظف"], x: 40, y: 360 },
  { id: "menu-en", kind: "question", title: "Service Menu", body: "Buy, Rent, Finance or Agent", options: ["Buy", "Rent", "Finance", "Agent"], x: 720, y: 360 },
  { id: "city", kind: "collect", title: "اسأل المدينة", body: "في أي مدينة تبحث؟", crmField: "City", x: 40, y: 560 },
  { id: "budget", kind: "collect", title: "اسأل الميزانية", body: "كم ميزانيتك؟", crmField: "Budget", x: 40, y: 720 },
  { id: "property", kind: "collect", title: "نوع العقار", body: "شقة، فيلا، أرض؟", crmField: "Property Type", x: 40, y: 880 },
  { id: "crm", kind: "crm", title: "Update CRM", body: "حفظ العميل وتحديث Lead Score", x: 40, y: 1040 },
  { id: "end", kind: "end", title: "End", body: "شكراً، سيتم التواصل معك", x: 40, y: 1200 },
  { id: "ai", kind: "ai", title: "AI Takeover", body: "يتدخل إذا خرج العميل عن المسار", x: 720, y: 560 },
];
const DEFAULT_EDGES: FlowEdge[] = [
  { from: "start", to: "lang" },
  { from: "lang", to: "menu-ar", label: "العربية" },
  { from: "lang", to: "menu-en", label: "English" },
  { from: "menu-ar", to: "city", label: "شراء عقار" },
  { from: "city", to: "budget" }, { from: "budget", to: "property" },
  { from: "property", to: "crm" }, { from: "crm", to: "end" },
  { from: "menu-en", to: "ai", label: "Out of flow" },
];

function seedFlow(partial: Partial<Flow> & { id: string; name: string }): Flow {
  return {
    status: "Draft", type: "Inbound", category: "General", runs: 0,
    modifiedAt: new Date().toISOString().slice(0, 10),
    language: "ar", triggerType: "keyword",
    nodes: DEFAULT_NODES, edges: DEFAULT_EDGES,
    ...partial,
  };
}

let flows: Flow[] = [
  seedFlow({ id: "rent-my-car", name: "Rent My Car", status: "Published", category: "Real Estate", runs: 1240, modifiedAt: "2026-06-07" }),
  seedFlow({ id: "real-estate-buy", name: "بوت شراء عقار", status: "Published", category: "Real Estate", runs: 864, modifiedAt: "2026-05-29" }),
  seedFlow({ id: "support-tickets", name: "Support Tickets Bot", status: "Draft", category: "Support", runs: 0, modifiedAt: "2026-05-21" }),
  seedFlow({ id: "ramadan-promo", name: "Ramadan Promo Flow", status: "Deprecated", type: "Outbound", category: "Marketing", runs: 3520, modifiedAt: "2026-04-12" }),
  seedFlow({ id: "lead-qualify", name: "Lead Qualification", status: "Published", category: "Sales", runs: 2106, modifiedAt: "2026-04-02" }),
  seedFlow({ id: "feedback-nps", name: "NPS Feedback", status: "Draft", type: "Outbound", category: "Feedback", runs: 0, modifiedAt: "2026-03-18" }),
  seedFlow({ id: "abandoned-cart", name: "Abandoned Cart Reminder", status: "Blocked", type: "Outbound", category: "E-commerce", runs: 412, modifiedAt: "2026-02-27" }),
];

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

export function getFlows(): Flow[] { return flows; }
export function getFlow(id: string): Flow | undefined { return flows.find((f) => f.id === id); }
export function createFlow(name = "New Flow"): Flow {
  const id = `flow-${Date.now().toString(36)}`;
  const f = seedFlow({ id, name, status: "Draft" });
  flows = [f, ...flows];
  emit();
  return f;
}
export function updateFlow(id: string, patch: Partial<Flow>) {
  flows = flows.map((f) => (f.id === id ? { ...f, ...patch, modifiedAt: new Date().toISOString().slice(0, 10) } : f));
  emit();
}
export function deleteFlow(id: string) {
  flows = flows.filter((f) => f.id !== id);
  emit();
}
function subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }

export function useFlows(): Flow[] {
  return useSyncExternalStore(subscribe, getFlows, getFlows);
}
export function useFlow(id: string): Flow | undefined {
  const all = useFlows();
  return all.find((f) => f.id === id);
}

// Hydration-safe noop (kept for future persistence)
export function useFlowsHydration() { useEffect(() => { /* placeholder */ }, []); }
