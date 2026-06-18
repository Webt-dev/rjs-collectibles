import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function TagMenu() {
  const [open, setOpen] = useState(false);
  const { cards } = useApp();

  const tags = useMemo(() => {
    const set = new Set();
    cards.forEach(c => {
      (c.tags || []).forEach(t => {
        const tag = t.trim();
        if (!tag) return;
        if (tag.toLowerCase() === "featured") return; // exclude featured
        set.add(tag);
      });
    });

    // fallback so you see the design before Shopify loads
    if (set.size === 0) {
      ["New Arrivals","Mystery Products","Booster Boxes","Sealed Cases","Booster Packs","Blisters & Sleeves","Tins & Theme Decks","Collection Boxes","Elite Trainer Boxes","Booster Bundles","Japanese Products","Miscellaneous","Help & Support","Sell Your Collection"].forEach(t => set.add(t));
    }
    return Array.from(set); // keeps Shopify order
  }, [cards]);

  return (
    <>
      {/* Hamburger button - put this where your old mobile menu was */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:p-2.5"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Drawer - works on mobile and desktop */}
      {open && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-[88%] max-w-[340px] bg-[#0f172a] text-slate-300 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-14 border-b border-slate-800">
              <span className="text-[15px] font-medium tracking-wide">Shop</span>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="overflow-y-auto flex-1">
              {tags.map(tag => (
                <Link
                  key={tag}
                  to={`/shop?tag=${encodeURIComponent(tag)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-[15px] border-b border-slate-800/70 hover:bg-[#1e293b] hover:text-white transition-colors"
                >
                  <span>{tag}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
