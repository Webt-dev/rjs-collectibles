import Hero from "../components/Hero";
import FeaturedCards from "../components/FeaturedCards";
import { useApp } from "../context/AppContext";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const VIDEO_ID = "o-58ZaFNTjo";

export default function HomePage() {
  const { cards, selectCard } = useApp();
  const isLoading = cards.length === 0;

  const pageRef = useRef(null);

  useEffect(() => {
    const sections = pageRef.current?.querySelectorAll(".fade-in-section");
    if (!sections?.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [cards]);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfbf8] dark:bg-[#050507] animate-pulse">
        <div className="h-[500px] bg-zinc-100 dark:bg-zinc-900" />
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_,i) => (
            <div key={i} className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="animate-page-enter">
      <Hero />

      {/* PREMIUM LIVE CAROUSEL */}
      {cards.length > 0 && (
        <section className="relative overflow-hidden border-y border-zinc-200/70 dark:border-zinc-800/70">
          {/* soft background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[#fcfbf8] dark:bg-[#050507]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,38,38,0.08),_transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(201,162,39,0.06),_transparent_50%)]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#dc2626]"></span>
                </span>
                <h3 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400">
                  Live From Our Shelves
                </h3>
              </div>
              <Link to="/shop" className="text-[12px] font-medium text-zinc-500 hover:text-[#dc2626] transition-colors">
                Browse all →
              </Link>
            </div>
          </div>

          {/* fade edges */}
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#fcfbf8] dark:from-[#050507] via-[#fcfbf8]/80 dark:via-[#050507]/80 to-transparent z-20" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#fcfbf8] dark:from-[#050507] via-[#fcfbf8]/80 dark:via-[#050507]/80 to-transparent z-20" />

            <div className="flex gap-4 py-4 animate-marquee hover:[animation-play-state:paused] will-change-transform">
              {cards.slice(0, 12).concat(cards.slice(0, 12)).map((c, i) => (
                <button
                  key={`${c.id}-${i}`}
                  onClick={() => selectCard(c)}
                  className="group flex-shrink-0 text-left"
                >
                  <div className="relative w-[110px] h-[148px] sm:w-[132px] sm:h-[176px]">
                    {/* glow */}
                    <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-b from-[#dc2626]/0 via-[#dc2626]/0 to-[#c9a227]/0 group-hover:from-[#dc2626]/20 group-hover:via-[#ea580c]/15 group-hover:to-[#c9a227]/20 blur-xl transition-all duration-500" />

                    {/* card */}
                    <div className="relative h-full w-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_24px_rgba(220,38,38,0.15)] group-hover:-translate-y-1 group-hover:border-red-200/50 dark:group-hover:border-red-900/50 transition-all duration-300 overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(220,38,38,0.1) 10px, rgba(220,38,38,0.1) 11px)`
                      }}/>
                      <img
                        src={c.image || c.thumb}
                        alt={c.name}
                        className="relative w-full h-full object-contain p-3 sm:p-3.5 group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                        draggable={false}
                      />
                      <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-gradient-to-t from-black/80 to-transparent pt-6 pb-2 px-2">
                          <p className="text-[10px] text-white/90 truncate font-medium">{c.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="fade-in-section">
        <FeaturedCards />
      </div>

      <div className="fade-in-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-xl font-display font-bold text-zinc-900 dark:text-white mb-4">Latest Opening</h3>
        <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${VIDEO_ID}`}
            title="Latest Opening"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
