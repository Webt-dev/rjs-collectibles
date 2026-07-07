import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck, Star } from "lucide-react";
import logo from "../assets/rjs-logo.png";
import heroDesktop from "../assets/hero-desktop.jpg"; // the wide version I made
import heroMobile from "../assets/hero-mobile.jpg"; // the tall version

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* --- HERO IMAGE --- */}
      <div className="relative h-[50vh] sm:h-[58vh] min-h-[360px] max-h-[520px] w-full overflow-hidden">
        {/* responsive art-directed image - no transform, so nothing spills */}
        <picture className="absolute inset-0">
          <source media="(max-width: 640px)" srcSet={heroMobile} />
          <img
            src={heroDesktop}
            alt="RJS Collectibles"
            className="w-full h-full object-cover object-[center_28%]"
            loading="eager"
          />
        </picture>

        {/* light gradient for text - fades to transparent, not to solid black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/10" />

        {/* content */}
        <div className="relative z-10 h-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center">
          <img src={logo} alt="RJS" className="w-14 h-14 sm:w-16 sm:h-16 mb-4 object-contain drop-shadow-xl" />
          <h1 className="font-display text-[30px] sm:text-[42px] md:text-[50px] font-extrabold text-white tracking-tight leading-none mb-2">
            RJS <span className="bg-gradient-to-r from-[#dc2626] to-[#c9a227] bg-clip-text text-transparent">Collectibles</span>
          </h1>
          <p className="text-[13px] sm:text-[15px] text-zinc-100/90 max-w-[520px] mb-5">
            Sealed, vintage & rare Pokémon — direct from collectors worldwide.
          </p>
          <Link to="/shop" className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full font-bold text-[13px] text-white bg-gradient-to-r from-[#dc2626] to-[#c9a227] shadow-lg hover:scale-105 transition-transform">
            ALL PRODUCTS <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* bottom fade - this is what stops the hard cut you saw in your screenshot */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white dark:to-zinc-950 pointer-events-none" />
      </div>

      {/* --- TRUST BAR --- stays fully visible now --- */}
      <div className="border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
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
