import React from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { useApp } from "../context/AppContext";

const icons = { success: CheckCircle, error: AlertCircle, info: Info };
const colors = {
  success: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50",
  error: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50",
  info: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50",
};
const iconCls = {
  success: "text-emerald-600 dark:text-emerald-400",
  error: "text-red-600 dark:text-red-400",
  info: "text-amber-600 dark:text-amber-400",
};

const MAX_LEN = 140;
const truncate = (s = "") =>
  s.length > MAX_LEN ? s.slice(0, MAX_LEN - 1) + "…" : s;

export default function Toast() {
  const { toasts } = useApp();

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 max-w-xs sm:max-w-sm"
    >
      {toasts.map((t) => {
        const Ic = icons[t.type] || Info;
        return (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border shadow-lg backdrop-blur-md ${colors[t.type] || colors.info}`}
          >
            <Ic className={`w-4 h-4 shrink-0 mt-0.5 ${iconCls[t.type] || iconCls.info}`} aria-hidden="true" />
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 break-words">
              {truncate(String(t.message ?? ""))}
            </p>
          </div>
        );
      })}
    </div>
  );
}