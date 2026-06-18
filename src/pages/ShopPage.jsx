import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="skeleton-loader aspect-[4/5]" />
      <div className="p-3 space-y-2">
        <div className="skeleton-loader h-4 w-3/4 rounded" />
        <div className="skeleton-loader h-3 w-1/2 rounded" />
        <div className="flex justify-between mt-2">
          <div className="skeleton-loader h-5 w-16 rounded" />
          <div className="skeleton-loader h-7 w-7 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { addToCart, selectCard, cards: contextCards } = useApp();
  const [cards, setCards] = useState([]);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const debounceTimer = useRef(null);
  const gridRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (contextCards.length) {
      setCards(contextCards);
      setLoading(false);
    }
  }, [contextCards]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTagFilter(params.get('tag') || "");
  }, [location.search]);

  // BUILD TAG LIST FROM SHOPIFY - like sidebar
  const allTags = useMemo(() => {
    const counts = {};
    cards.forEach(c => {
      (c.tags || []).forEach(t => {
        const tag = t.trim();
        if (!tag || tag.toLowerCase() === 'featured') return;
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
     .sort((a, b) => b[1] - a[1])
     .map(([tag]) => tag);
  }, [cards]);

  useEffect(() => {
    if (!gridRef.current || loading) return;
    const items = gridRef.current.querySelectorAll(".shop-item");
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); } }),
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [cards, loading, debouncedQ, tagFilter]);

  const handleSearch = useCallback((value) => {
    setQ(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => { setDebouncedQ(value); }, 300);
  }, []);

  useEffect(() => { return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); }; }, []);

  const handleRipple = useCallback((e) => {
    const btn = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    ripple.className = "ripple-effect";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  const filtered = cards.filter((c) => {
    if (debouncedQ &&!c.name.toLowerCase().includes(debouncedQ.toLowerCase())) return false;
    if (tagFilter) {
      const tags = (c.tags || []).filter(t => t.toLowerCase()!== 'featured');
      const hasTag = tags.some(t => t.toLowerCase() === tagFilter.toLowerCase());
      const matchesType = c.productType?.toLowerCase() === tagFilter.toLowerCase();
      const matchesName = c.name.toLowerCase().includes(tagFilter.toLowerCase());
      if (!hasTag &&!matchesType &&!matchesName) return false;
    }
    return true;
  });

  const gradient = "conic-gradient(from 0deg, #dc2626, #ea580c, #f59e0b, #c9a227, #dc2626)";

  return (
    <div className="animate-page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white">Shop Sealed</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-6">
            {tagFilter && (
              <span className="inline-flex items-center gap-1.5 mr-2">
                <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/40 text-[#dc2626] text-[11px] font-medium border border-red-200 dark:border-red-900">
                  {tagFilter}
                </span>
                •
              </span>
            )}
            {filtered.length} products
          </p>
        </div>
        {tagFilter && (
          <button onClick={() => navigate('/shop')} className="text-xs px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input className="search-glow input pl-10" placeholder="Search sealed products..." value={q} onChange={(e) => handleSearch(e.target.value)} />
        </div>

        {/* LIVE SHOPIFY TAGS DROPDOWN */}
        <select
          className="input w-auto min-w-[160px] cursor-pointer"
          value={tagFilter}
          onChange={(e) => navigate(e.target.value? `/shop?tag=${encodeURIComponent(e.target.value)}` : '/shop')}
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>
              {tag} ({cards.filter(c => (c.tags||[]).includes(tag)).length})
            </option>
          ))}
        </select>
      </div>

      {/* QUICK TAG PILLS - like sidebar */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          <button
            onClick={() => navigate('/shop')}
            className={`px-2.5 py-1 text-[11px] rounded-full border transition-colors ${
             !tagFilter
               ? 'bg-[#dc2626] text-white border-[#dc2626]'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-red-300'
            }`}
          >
            All
          </button>
          {allTags.slice(0, 12).map(tag => (
            <button
              key={tag}
              onClick={() => navigate(`/shop?tag=${encodeURIComponent(tag)}`)}
              className={`px-2.5 py-1 text-[11px] rounded-full border transition-colors ${
                tagFilter === tag
                 ? 'bg-[#dc2626] text-white border-[#dc2626]'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-red-50 hover:text-[#dc2626] hover:border-red-200 dark:hover:bg-red-950/30'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && (
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
          {filtered.map((product, index) => {
            const visibleTags = (product.tags || []).filter(t => t.toLowerCase()!== 'featured');
            return (
            <div key={product.id} className="shop-item scroll-reveal h-full" style={{ transitionDelay: `${index * 30}ms` }}>
              <div className="shop-card h-full rounded-2xl overflow-visible group">
                <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", padding: "4px", height: "100%" }}>
                  <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: gradient, animation: `spin 3s linear infinite` }} />
                  <div className="relative bg-white dark:bg-zinc-950 h-full flex flex-col" style={{ borderRadius: "14px", overflow: "hidden" }}>
                    <div className="card-image-shimmer overflow-hidden cursor-pointer bg-zinc-50 dark:bg-zinc-900" onClick={() => selectCard(product)}>
                      <img src={product.image || product.thumb} alt={product.name} className="w-full aspect-[4/5] object-contain p-2 card-image" draggable={false} loading="lazy" />
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <h4 className="text-[13px] font-medium text-zinc-900 dark:text-white truncate cursor-pointer hover:text-[#dc2626] transition-colors leading-tight" onClick={() => selectCard(product)} title={product.name}>{product.name}</h4>
                      {visibleTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {visibleTags.slice(0,2).map(tag => (
                            <button key={tag} onClick={(e) => { e.stopPropagation(); navigate(`/shop?tag=${encodeURIComponent(tag)}`); }}
                              className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-red-50 hover:text-[#dc2626] dark:hover:bg-red-950/30">
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{product.productType}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="price-tag text-[15px]">${Number(product.price).toFixed(2)}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleRipple(e); addToCart(product); }}
                          className="ripple-btn w-7 h-7 bg-gradient-to-r from-[#dc2626] to-[#ea580c] hover:from-red-600 hover:to-orange-500 text-white rounded-lg flex items-center justify-center shadow-sm transition-all hover:scale-110 active:scale-95"
                          aria-label="Add to cart"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="min-h-[18px] mt-1.5">
                        {product.stock <= 3 && product.stock > 0 && (
                          <span className="animate-badge-pulse text-[11px] font-medium text-[#dc2626]">Only {product.stock} left</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-zinc-400 mb-2">No products found{tagFilter? ` for "${tagFilter}"` : ''}</div>
          <button onClick={() => navigate('/shop')} className="text-sm text-[#dc2626] hover:underline">Clear all filters</button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
