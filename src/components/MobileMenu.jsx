import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ChevronRight, X } from "lucide-react";
import logo from "../assets/rjs-logo.png";

export default function MobileMenu() {
  const { toggleMobileMenu, cards } = useApp();

  // ONLY real Shopify tags - no mocks, no 'featured'
  const tags = useMemo(() => {
    const set = new Set();
    cards.forEach(c => {
      (c.tags || []).forEach(t => {
        const tag = String(t).trim();
        if (!tag) return;
        if (tag.toLowerCase() === "featured") return;
        set.add(tag);
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [cards]);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={toggleMobileMenu}
        style={{ animation: "fadeIn 200ms ease-out" }}
      />

      {/* LEFT drawer - your brand colors */}
      <aside
        className="absolute left-0 top-0 h-full w-[340px] max-w-[88vw] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{
          animation: "slideInLeft 300ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          willChange: "transform"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="RJS" className="h-8 w-auto" />
            <div>
              <div className="text-[17px] font-display font-bold text-zinc-900 dark:text-white leading-none">
                RJS <span className="text-[#dc2626]">Collectibles</span>
              </div>
              <div className="text-[12px] text-zinc-500 dark:text-zinc-400 -mt-0.5">Shop by category</div>
            </div>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tags */}
        <nav className="flex-1 overflow-y-auto">
          {tags.length === 0? (
            <div className="px-6 py-16 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse" />
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Waiting for Shopify</span>
              </div>
              <p className="text-[13px] text-zinc-500">Add tags in Shopify and they appear here automatically.</p>
            </div>
          ) : (
            tags.map(tag => (
              <Link
                key={tag}
                to={`/shop?tag=${encodeURIComponent(tag)}`}
                onClick={toggleMobileMenu}
                className="group flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <span className="text-[15px] text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white">
                  {tag}
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-[#dc2626] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))
          )}
        </nav>

        {/* NEW: Sell Your Collection - bottom of mobile menu */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <Link
            to="/sell"
            onClick={toggleMobileMenu}
            className="btn-primary w-full justify-center"
            style={{ background: 'linear-gradient(90deg, #dc2626, #c9a227)' }}
          >
            Sell Your Collection
          </Link>
          <p className="text-[11px] text-center text-zinc-500 dark:text-zinc-500 mt-2">
            Get a quote in 24h
          </p>
        </div>

        <div className="h-[2px] w-full bg-[#dc2626]" />
      </aside>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInLeft { from { transform: translateX(-100%) } to { transform: translateX(0) } }
      `}</style>
    </div>
  );
}
