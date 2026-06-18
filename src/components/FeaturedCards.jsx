import React, { useRef, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturedCards() {
  const { cards, addToCart, selectCard } = useApp();
  const featured = cards.filter(c => 
    (c.tags || []).some(t => t.toLowerCase() === 'featured') && 
    c.status === "active" && 
    c.stock > 0
  );
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".fc-item");
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); observer.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [featured]);

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

  if (featured.length === 0) return null;

  const gradient = "conic-gradient(from 0deg, #dc2626, #ea580c, #f59e0b, #c9a227, #dc2626)";

  return (
    <section id="featured" className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-[#dc2626] mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-[13px] font-semibold tracking-wide uppercase">Hand-picked</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-white">Featured This Week</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Curated by our team</p>
          </div>
          <Link to="/shop" className="btn-secondary text-sm">View all &rarr;</Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
          {featured.slice(0, 10).map((c, i) => (
            <div key={c.id} className="fc-item scroll-reveal h-full" style={{ transitionDelay: `${i * 50}ms` }}>
              <div className="shop-card cursor-pointer h-full rounded-2xl overflow-visible group" onClick={() => selectCard(c)}>
                <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", padding: "4px", height: "100%" }}>
                  <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: gradient, animation: `spin 3s linear infinite` }} />
                  <div className="relative bg-white dark:bg-zinc-950 h-full flex flex-col" style={{ borderRadius: "14px", overflow: "hidden" }}>
                    <div className="card-image-shimmer aspect-[4/5] bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
                      <img src={c.image || c.thumb} alt={c.name} className="w-full h-full object-contain p-2" draggable={false} loading="lazy" />
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <div className="text-[13px] font-medium text-zinc-900 dark:text-white truncate leading-tight" title={c.name}>{c.name}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{c.set}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="price-tag text-[15px] font-semibold text-[#dc2626]">${Number(c.price).toFixed(2)}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleRipple(e); addToCart(c); }}
                          className="ripple-btn w-7 h-7 bg-gradient-to-r from-[#dc2626] to-[#ea580c] hover:from-red-600 hover:to-orange-500 text-white rounded-lg flex items-center justify-center shadow-sm transition-all hover:scale-110 active:scale-95"
                          aria-label="Add to cart"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="min-h-[18px] mt-1.5">
                        {c.stock <= 3 && c.stock > 0 && (
                          <span className="animate-badge-pulse text-[11px] font-medium text-[#dc2626]">Only {c.stock} left</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
