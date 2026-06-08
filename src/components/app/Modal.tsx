import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, onSubmit, submitLabel = "تأكيد" }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
  onSubmit: () => void; submitLabel?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f141b] shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/5"><X className="h-4 w-4 text-slate-400" /></button>
        </div>
        <div className="p-4 space-y-3">{children}</div>
        <div className="flex justify-end gap-2 p-3 border-t border-white/5">
          <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:bg-white/5">إلغاء</button>
          <button onClick={() => { onSubmit(); onClose(); }} className="rounded-lg bg-[#25D366] text-black px-3 py-1.5 text-xs font-medium hover:brightness-110">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] text-slate-400 block mb-1">{label}</span>
      {children}
    </label>
  );
}

export const inputCls = "w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#25D366]/50";

export function useField(initial = "") {
  return useState(initial);
}
