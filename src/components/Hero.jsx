import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck, Star } from "lucide-react";
import logo from "../assets/rjs-logo.png";
import heroBanner from "../assets/hero-banner.jpg";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* TOP FADE - ensures no grey at top in light mode */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white dark:from-zinc-950 to-transparent z-20 pointer-events-none" />

      <div
        className="relative h-[46vh] min-h-[340px] max-h-[480px] w-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.85) 100%), url(${heroBanner})`,
          backgroundPosition: `center ${50 + scrollY * 0.03}%`,
        }}
      >
        <div className="relative z-10 h-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <img src={logo} alt="RJS" className="w-14 h-14 sm:w-16 sm:h-16 mb-4 object-contain drop-shadow-xl" />
          <h1 className="font-display text-[28px] sm:text-[40px] md:text-[48px] font-extrabold text-white tracking-tight leading-none mb-2">
            RJS <span className="bg-gradient-to-r from-[#dc2626] to-[#c9a227] bg-clip-text text-transparent">Collectibles</span>
          </h1>
          <p className="text-[13px] sm:text-[15px] text-zinc-200/85 max-w-[520px] mb-6">
            Sealed, vintage &amp; rare Pokémon — direct from collectors worldwide.
          </p>
          <Link to="/shop" className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full font-bold text-[13px] text-white bg-gradient-to-r from-[#dc2626] to-[#c9a227] shadow-lg hover:scale-105 transition-all">
            ALL PRODUCTS <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* BOTTOM FADE - white in light, black in dark */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white dark:to-black pointer-events-none" />
      </div>

      {/* TRUST BAR */}
      <div className="border-y border-zinc-200 dark:border-zinc-900 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6 py-3 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Shield, label: "Authenticity Guaranteed" },
            { icon: Truck, label: "Worldwide Shipping" },
            { icon: Star, label: "4.9/5 from 1,000+" },
          ].map((it, i) => (
            <div key={i} className="flex items-center justify-center gap-1.5 text-[12px] text-zinc-600 dark:text-zinc-300">
              <it.icon className="w-3.5 h-3.5 text-[#c9a227]" />
              <span>{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
