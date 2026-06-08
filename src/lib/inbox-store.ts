import { useSyncExternalStore } from "react";
import { CONVERSATIONS, type PipelineStage, type TimelineItem } from "./demo-data";

type State = {
  stages: Record<string, PipelineStage>;
  timeline: Record<string, TimelineItem[]>;
  notes: Record<string, { id: string; text: string; author: string; time: string }[]>;
  agents: Record<string, string>;
};

const listeners = new Set<() => void>();

const initialState: State = {
  stages: Object.fromEntries(CONVERSATIONS.map(c => [c.id, c.stage])),
  timeline: Object.fromEntries(CONVERSATIONS.map(c => [c.id, c.timeline])),
  notes: Object.fromEntries(CONVERSATIONS.map(c => [c.id, []])),
  agents: Object.fromEntries(CONVERSATIONS.map(c => [c.id, c.agent])),
};

let state: State = initialState;

const emit = () => listeners.forEach(l => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const getSnapshot = () => state;

export const useInboxStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

function nowLabel() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

function addTimeline(convId: string, item: Omit<TimelineItem, "id" | "time"> & { time?: string }) {
  const id = `t-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
  const entry: TimelineItem = { id, time: item.time ?? nowLabel(), ...item };
  state = {
    ...state,
    timeline: { ...state.timeline, [convId]: [entry, ...(state.timeline[convId] ?? [])] },
  };
  emit();
}

export const inboxActions = {
  moveStage(convId: string, stage: PipelineStage, prev: PipelineStage) {
    state = { ...state, stages: { ...state.stages, [convId]: stage } };
    emit();
    addTimeline(convId, { type: "stage", title: `${prev} → ${stage}`, actor: "أنت" });
  },
  scheduleMeeting(convId: string, title: string, when: string) {
    addTimeline(convId, { type: "meeting", title: `اجتماع: ${title}`, detail: when, actor: "أنت" });
  },
  createTicket(convId: string, subject: string, priority: string) {
    const num = 2000 + Math.floor(Math.random() * 999);
    addTimeline(convId, { type: "ticket", title: `تذكرة: ${subject}`, detail: `TKT-${num} · ${priority}`, actor: "أنت" });
  },
  sendFollowup(convId: string, channel: string, when: string) {
    addTimeline(convId, { type: "followup", title: `متابعة عبر ${channel}`, detail: when, actor: "أنت" });
  },
  generateProposal(convId: string, plan: string, amount: string) {
    const num = 3000 + Math.floor(Math.random() * 999);
    addTimeline(convId, { type: "proposal", title: `عرض سعر #PRP-${num}`, detail: `${plan} · ${amount}`, actor: "أنت" });
  },
  assignAgent(convId: string, agent: string) {
    state = { ...state, agents: { ...state.agents, [convId]: agent } };
    emit();
    addTimeline(convId, { type: "note", title: `إسناد المحادثة إلى ${agent}`, actor: "أنت" });
  },
  addNote(convId: string, text: string) {
    const id = `n-${Date.now()}`;
    const note = { id, text, author: "أنت", time: nowLabel() };
    state = {
      ...state,
      notes: { ...state.notes, [convId]: [note, ...(state.notes[convId] ?? [])] },
    };
    emit();
    addTimeline(convId, { type: "note", title: "ملاحظة داخلية", detail: text, actor: "أنت" });
  },
};
