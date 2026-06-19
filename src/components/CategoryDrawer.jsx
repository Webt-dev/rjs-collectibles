import React, { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function CategoryDrawer({ open, onClose }) {
  const { cards } = useApp();

  const tags = useMemo(() => {
    const counts = new Map();
    cards.forEach((c) => {
      (c.tags || []).forEach((raw) => {
        const tag = String(raw).trim();
        if (!tag) return;
        const low = tag.toLowerCase();
        if (low === "featured" || low === "mystery") return;
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [cards]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm animate-backdrop-fade-in"
      />

      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 left-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl animate-slide-from-left flex flex-col"
      >
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white">
          <div>
            <p className="text-[10px] font-display font-black uppercase tracking-[0.22em] text-[#d4a82a]">
              Browse
            </p>
            <h2 className="font-display text-xl font-black">Shop by Category</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 grid place-items-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {tags.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-zinc-500">
              Waiting for Shopify… tags will appear here automatically.
            </div>
          )}

          {tags.map(([tag, count], i) => (
            <Link
              key={tag}
              to={`/shop?tag=${encodeURIComponent(tag)}`}
              onClick={onClose}
              className="group flex items-center justify-between px-6 py-3.5 text-sm border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/70 transition-colors animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 35, 600)}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-zinc-900 dark:text-white group-hover:text-[#dc2626] transition-colors">
                  {tag}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500">
                  {count}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-[#dc2626] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
          <Link
            to="/sell"
            onClick={onClose}
            className="block w-full text-center px-5 py-3 rounded-xl font-display font-black text-sm text-white bg-gradient-to-r from-[#dc2626] to-[#b8901f] hover:scale-[1.02] transition-transform shadow-md"
          >
            Sell Your Collection →
          </Link>
        </div>
      </aside>
    </div>
  );
}