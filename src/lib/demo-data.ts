export type Lead = {
  id: string;
  name: string;
  phone: string;
  source: "WhatsApp" | "Instagram" | "Website" | "Referral" | "Ads";
  stage: "New" | "Contacted" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";
  score: number;
  intent: "High" | "Medium" | "Low";
  value: number;
  owner: string;
  lastMessage: string;
  lastActivity: string;
  tags: string[];
  city: string;
};

const owners = ["محمد العتيبي", "سارة الحربي", "خالد الزهراني", "ليان القحطاني"];
const cities = ["الرياض", "جدة", "الدمام", "مكة", "المدينة", "أبها"];
const sources: Lead["source"][] = ["WhatsApp", "Instagram", "Website", "Referral", "Ads"];
const stages: Lead["stage"][] = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
const names = [
  "أحمد المالكي", "نوره الشمري", "فهد العنزي", "ريم الدوسري", "بدر السبيعي",
  "هيا الغامدي", "سلطان الرشيد", "منى البلوي", "ياسر السهلي", "دانه العسيري",
  "تركي الفيفي", "جوري الحارثي", "ماجد الزيد", "روان النعيمي", "ناصر القرني",
  "لمى الجهني", "عبدالعزيز السيف", "أمل المطيري", "زياد البقمي", "غلا الشهري",
];
const messages = [
  "ودي أعرف العرض الجديد، متى يبدأ؟",
  "ممكن أحجز موعد تجربة؟",
  "السعر شامل الضريبة؟",
  "أبغى أعرف فروقات الباقات",
  "ممكن خصم لو اشتركت سنوي؟",
  "هل يوجد دعم 24/7؟",
  "أبي ربط مع نظامي الحالي",
  "متى يوصل الطلب؟",
];

function seeded(i: number, mod: number) { return (i * 9301 + 49297) % mod; }

export const LEADS: Lead[] = Array.from({ length: 48 }).map((_, i) => {
  const stage = stages[seeded(i, 7)];
  return {
    id: `LD-${1000 + i}`,
    name: names[i % names.length],
    phone: `+9665${(10000000 + seeded(i, 89999999)).toString().slice(0, 8)}`,
    source: sources[seeded(i, 5)],
    stage,
    score: 35 + seeded(i + 3, 65),
    intent: (["High", "Medium", "Low"] as const)[seeded(i + 1, 3)],
    value: (5 + seeded(i + 2, 95)) * 1000,
    owner: owners[i % owners.length],
    lastMessage: messages[i % messages.length],
    lastActivity: `قبل ${1 + seeded(i + 5, 48)} ساعة`,
    tags: ["VIP", "B2B", "متابعة", "عاجل", "متردد"].filter((_, t) => seeded(i + t, 3) === 0),
    city: cities[i % cities.length],
  };
});

export const PIPELINE_STAGES: Lead["stage"][] = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won"];

export const REVENUE_TREND = [
  { m: "يناير", v: 42 }, { m: "فبراير", v: 51 }, { m: "مارس", v: 47 },
  { m: "أبريل", v: 63 }, { m: "مايو", v: 72 }, { m: "يونيو", v: 81 },
  { m: "يوليو", v: 95 }, { m: "أغسطس", v: 102 },
];

export type Conversation = {
  id: string;
  name: string;
  phone: string;
  unread: number;
  last: string;
  time: string;
  agent: string;
  status: "open" | "closed";
  priority: "high" | "medium" | "low";
  score: number;
  intent: "High" | "Medium" | "Low";
  summary: string;
  nextAction: string;
  source: Lead["source"];
  city: string;
  value: number;
  messages: { from: "lead" | "agent" | "ai"; text: string; time: string }[];
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1", name: "أحمد المالكي", phone: "+966550012233", unread: 3,
    last: "تمام، أرسل لي العقد", time: "الآن", agent: "محمد العتيبي",
    status: "open", priority: "high",
    score: 92, intent: "High",
    summary: "عميل مهتم بباقة Pro، استجاب إيجابياً لخصم 15% وطلب العقد. مؤشر إغلاق عالي خلال 24 ساعة.",
    nextAction: "إرسال العقد + متابعة هاتفية خلال ساعة",
    source: "WhatsApp", city: "الرياض", value: 42000,
    messages: [
      { from: "lead", text: "السلام عليكم، أبي أعرف العرض", time: "10:02" },
      { from: "agent", text: "وعليكم السلام، أهلاً بك أحمد 👋", time: "10:03" },
      { from: "ai", text: "اقتراح: قدم باقة Pro مع خصم 15% (ميول شراء 87%)", time: "10:03" },
      { from: "agent", text: "نقدر نوفر لك Pro بخصم 15% هذا الشهر", time: "10:05" },
      { from: "lead", text: "تمام، أرسل لي العقد", time: "10:07" },
    ],
  },
  {
    id: "c2", name: "نوره الشمري", phone: "+966551122334", unread: 0,
    last: "شكراً، راح أراجع وأرد عليك", time: "قبل 12د", agent: "سارة الحربي",
    status: "open", priority: "medium",
    score: 64, intent: "Medium",
    summary: "العميلة طلبت تفاصيل الباقات الثلاث، أبدت اهتمام متوسط وتحتاج وقت للقرار.",
    nextAction: "متابعة بعد 48 ساعة بعرض مقارنة الباقات",
    source: "Instagram", city: "جدة", value: 18000,
    messages: [
      { from: "lead", text: "ممكن تفاصيل الباقات؟", time: "09:40" },
      { from: "agent", text: "بكل تأكيد، عندنا 3 باقات...", time: "09:42" },
      { from: "lead", text: "شكراً، راح أراجع وأرد عليك", time: "09:50" },
    ],
  },
  {
    id: "c3", name: "فهد العنزي", phone: "+966552233445", unread: 1,
    last: "السعر مرتفع شوي", time: "قبل ساعة", agent: "خالد الزهراني",
    status: "open", priority: "high",
    score: 38, intent: "Low",
    summary: "اعتراض سعري واضح. مؤشر فقدان 62% — يحتاج تدخل فوري بعرض مخصص.",
    nextAction: "اتصال شخصي + تقديم خصم 10% مع تقسيط",
    source: "Ads", city: "الدمام", value: 24000,
    messages: [
      { from: "lead", text: "السعر مرتفع شوي", time: "08:30" },
      { from: "ai", text: "تنبيه: مؤشر فقدان مرتفع (62%). اقترح خصم 10%", time: "08:30" },
    ],
  },
  {
    id: "c4", name: "ريم الدوسري", phone: "+966553344556", unread: 0,
    last: "تم الدفع ✅", time: "قبل 3س", agent: "ليان القحطاني",
    status: "closed", priority: "low",
    score: 100, intent: "High",
    summary: "صفقة مغلقة بنجاح. تم الدفع وتفعيل الاشتراك السنوي.",
    nextAction: "Onboarding خلال 24 ساعة + طلب تقييم",
    source: "Website", city: "مكة", value: 36000,
    messages: [
      { from: "lead", text: "تم الدفع ✅", time: "أمس" },
    ],
  },
];

// Auto-create CRM contacts from every conversation (Inbox ↔ CRM sync)
export type Contact = {
  id: string;
  name: string;
  phone: string;
  source: Lead["source"];
  score: number;
  intent: "High" | "Medium" | "Low";
  summary: string;
  nextAction: string;
  owner: string;
  city: string;
  value: number;
  lastMessage: string;
  lastActivity: string;
  conversationId: string;
  stage: Lead["stage"];
};

export const CONTACTS: Contact[] = CONVERSATIONS.map((c) => ({
  id: `CT-${c.id}`,
  name: c.name,
  phone: c.phone,
  source: c.source,
  score: c.score,
  intent: c.intent,
  summary: c.summary,
  nextAction: c.nextAction,
  owner: c.agent,
  city: c.city,
  value: c.value,
  lastMessage: c.last,
  lastActivity: c.time,
  conversationId: c.id,
  stage: c.status === "closed" ? "Won" : c.score >= 80 ? "Negotiation" : c.score >= 55 ? "Qualified" : "Contacted",
}));

export function getContactByConversation(convId: string) {
  return CONTACTS.find((c) => c.conversationId === convId);
}

export const CAMPAIGN_TEMPLATES = [
  { id: "t1", name: "إطلاق منتج جديد", goal: "Awareness", channel: "WhatsApp", est: "ROI 3.2x" },
  { id: "t2", name: "استرجاع عملاء خاملين", goal: "Re-engagement", channel: "WhatsApp + Email", est: "Reactivation 22%" },
  { id: "t3", name: "عرض الجمعة البيضاء", goal: "Conversion", channel: "WhatsApp", est: "CVR 14%" },
  { id: "t4", name: "تذكير تجديد اشتراك", goal: "Retention", channel: "WhatsApp", est: "Renewal 71%" },
];
