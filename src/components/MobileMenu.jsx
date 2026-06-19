import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { X, ChevronRight, Home, ShoppingBag, Send, HelpCircle, Mail } from "lucide-react";
import { useApp } from "../context/AppContext";
import logo from "../assets/rjs-logo.png";

export default function MobileMenu() {
  const { toggleMobileMenu, cards } = useApp();

  const tags = useMemo(() => {
    const set = new Set();
    cards.forEach((c) => {
      (c.tags || []).forEach((t) => {
        const tag = String(t).trim();
        if (!tag) return;
        const low = tag.toLowerCase();
        if (low === "featured" || low === "mystery") return;
        set.add(tag);
      });
    });
    return Array.from(set).sort();
  }, [cards]);

  const mainLinks = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/shop", label: "Shop", Icon: ShoppingBag },
    { to: "/sell", label: "Sell Your Collection", Icon: Send },
    { to: "/faq", label: "FAQ", Icon: HelpCircle },
    { to: "/contact", label: "Contact", Icon: Mail },
  ];

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        onClick={toggleMobileMenu}
        className="absolute inset-0 bg-zinc-950/75 backdrop-blur-sm animate-backdrop-fade-in"
      />

      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 left-0 h-full w-full sm:w-[380px] bg-white dark:bg-zinc-950 shadow-2xl animate-slide-from-left flex flex-col"
      >
        {/* HEADER */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#7f1d1d] via-[#5f1111] to-[#7f1d1d] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="RJS"
              className="w-8 h-8 object-contain"
            />
            <span className="font-display font-black text-base">
              RJS <span className="text-[#d4a82a]">Collectibles</span>
            </span>
          </div>
          <button
            onClick={toggleMobileMenu}
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 grid place-items-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* MAIN LINKS */}
          <nav className="py-2">
            {mainLinks.map(({ to, label, Icon }, i) => (
              <Link
                key={to}
                to={to}
                onClick={toggleMobileMenu}
                className="group flex items-center justify-between px-6 py-3.5 text-sm border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/70 transition-colors animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#dc2626]" />
                  <span className="font-display font-bold text-zinc-900 dark:text-white group-hover:text-[#dc2626] transition-colors">
                    {label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-[#dc2626] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </nav>

          {/* CATEGORIES */}
          {tags.length > 0 && (
            <div className="px-6 pt-5 pb-3">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#b8901f] mb-2">
                Shop by Category
              </p>
            </div>
          )}
          {tags.map((tag, i) => (
            <Link
              key={tag}
              to={`/shop?tag=${encodeURIComponent(tag)}`}
              onClick={toggleMobileMenu}
              className="group flex items-center justify-between px-6 py-3 text-sm border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/70 transition-colors animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
            >
              <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-[#dc2626] transition-colors">
                {tag}
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-[#dc2626] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
          <Link
            to="/sell"
            onClick={toggleMobileMenu}
            className="block w-full text-center px-5 py-3 rounded-xl font-display font-black text-sm text-white bg-gradient-to-r from-[#dc2626] to-[#b8901f] hover:scale-[1.02] transition-transform shadow-md"
          >
            Sell Your Collection →
          </Link>
        </div>
      </aside>
    </div>
  );
}