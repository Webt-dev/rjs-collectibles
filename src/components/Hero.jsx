import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

const FALLBACK = [
  { id: 'h1', name: 'Charizard ex', set: 'Scarlet & Violet 151', price: 89.99, image: 'https://images.pokemontcg.io/sv3pt5/199_hires.png' },
  { id: 'h2', name: 'Pikachu', set: 'Crown Zenith', price: 42.99, image: 'https://images.pokemontcg.io/swsh12pt5/160_hires.png' },
  { id: 'h3', name: 'Mewtwo', set: 'Pokémon GO', price: 34.50, image: 'https://images.pokemontcg.io/pgo/72_hires.png' }
];

function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = Math.max(-8, Math.min(8, ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 8));
    const y = Math.max(-8, Math.min(8, ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * -8));
    setTilt({ x, y });
  }, []);
  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);
  return (
    <div ref={ref} className={className} style={{...style, perspective: "800px" }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="hero-card-shadow" style={{ transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`, transition: "transform 250ms cubic-bezier(0.2,0.8,0.2,1)", transformStyle: "preserve-3d", willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}

export default function Hero() {
  const { cards } = useApp();
  const activeCount = cards.filter(c => c.status === 'active').length;
  const heroCards = useMemo(() => {
    const active = cards.filter(c => c.status === 'active' && c.stock > 0 && (c.image || c.thumb));
    if (active.length < 3) return FALLBACK;
    const shuffled = [...active].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map(c => ({ id: c.id, name: c.name, set: c.set, price: c.price, image: c.image || c.thumb }));
  }, [cards]);
  const allActiveForPrice = cards.filter(c => c.status === 'active' && c.stock > 0 && typeof c.price === 'number');
  const minPrice = allActiveForPrice.length? Math.min(...allActiveForPrice.map(c => c.price)) : 0;
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => { if (!ticking) { requestAnimationFrame(() => { setScrollY(window.scrollY); ticking = false; }); ticking = true; } };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-900 bg-[#fcfbf8] dark:bg-zinc-950">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,38,38,0.12),_transparent_60%)] dark:opacity-100 opacity-60" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#dc2626]/10 dark:bg-[#dc2626]/5 rounded-full blur-[120px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 mb-6 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
              <span className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300 tracking-wide">LIVE INVENTORY</span>
              <span className="text-[11px] text-zinc-400">•</span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-500">{activeCount} cards available</span>
            </div>
            <h1 className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-zinc-900 dark:text-white">
              Collect with<br />
              <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">confidence.</span><br />
              <span className="text-[#dc2626]">Sell with clarity.</span>
            </h1>
            <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-5 mb-8 max-w-[520px] leading-relaxed">
              Every card at RJS is hand-inspected, photographed, and priced against live TCGPlayer, Cardmarket, and eBay data. No algorithms, no surprises.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className="group relative px-6 py-3 rounded-xl bg-[#dc2626] hover:bg-red-600 text-white text-[14px] font-medium transition-all shadow-lg shadow-red-900/20 hover:shadow-red-900/30">
                <span className="flex items-center gap-2">Browse Inventory<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
              <a href="#featured" className="px-6 py-3 rounded-xl bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-[14px] font-medium transition-colors shadow-sm">Featured Cards</a>
            </div>
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-8 sm:mt-10">
              {[{ icon: ShieldCheck, label: 'Verified Authentic' }, { icon: TrendingUp, label: 'Live Pricing' }, { icon: Sparkles, label: 'Graded Available' }].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/70 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900 backdrop-blur-sm">
                  <item.icon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-500" />
                  <span className="text-[12px] text-zinc-600 dark:text-zinc-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative pb-8">
              <div className="absolute -inset-10 bg-[#dc2626]/10 dark:bg-[#dc2626]/10 blur-[80px] rounded-full" />
              <div className="relative w-[300px] h-[320px] sm:w-[360px] sm:h-[380px] lg:w-[400px] lg:h-[420px]" style={{ transform: `translateY(${-scrollY * 0.15}px)` }}>
                <TiltCard className="absolute left-1/2 top-1/2 w-[200px] sm:w-[220px] lg:w-[240px] -translate-x-[75%] -translate-y-[48%] rotate-[-12deg] z-10 hover:z-30 transition-all duration-500 hover:rotate-[-8deg] hover:-translate-y-[52%] hover:scale-105">
                  <div className="animate-float" style={{ animationDelay: "0s" }}><CardVisual card={heroCards[0]} /></div>
                </TiltCard>
                <TiltCard className="absolute left-1/2 top-1/2 w-[200px] sm:w-[220px] lg:w-[240px] -translate-x-[25%] -translate-y-[48%] rotate-[12deg] z-10 hover:z-30 transition-all duration-500 hover:rotate-[8deg] hover:-translate-y-[52%] hover:scale-105">
                  <div className="animate-float" style={{ animationDelay: "0.5s" }}><CardVisual card={heroCards[2]} /></div>
                </TiltCard>
                <TiltCard className="absolute left-1/2 top-1/2 w-[210px] sm:w-[235px] lg:w-[250px] -translate-x-1/2 -translate-y-1/2 z-20 hover:-translate-y-[52%] transition-all duration-500 hover:scale-105">
                  <div className="animate-float" style={{ animationDelay: "1s" }}><CardVisual card={heroCards[1]} /></div>
                </TiltCard>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl z-30">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wide">Starting at</span>
                  <span className="text-[18px] font-semibold text-zinc-900 dark:text-white">${minPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CardVisual({ card }) {
  const gradient = "conic-gradient(from 0deg, #dc2626, #ea580c, #f59e0b, #c9a227, #dc2626)";
  return (
    <div className="relative group">
      <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", padding: "5px" }}>
        <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: gradient, animation: `spin 3s linear infinite` }} />
        <div className="relative bg-zinc-950" style={{ borderRadius: `21px`, overflow: "hidden" }}>
          <div className="aspect-[4/5] bg-zinc-950 flex items-center justify-center">
            <img src={card.image} alt={card.name} className="w-full h-full object-contain p-1" draggable={false} loading="eager" />
          </div>
          <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
            <div className="text-[13px] sm:text-[14px] font-medium text-white truncate">{card.name}</div>
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-[11px] text-zinc-300 truncate mr-2">{card.set}</span>
              <span className="text-[14px] sm:text-[15px] font-bold text-[#f59e0b]">${card.price}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
