import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const FAQS = [
  { q: "Are all your products authentic?", a: "Yes — every product is verified before shipping. We back this with a 100% authenticity guarantee or your money back." },
  { q: "Do you ship internationally?", a: "We ship worldwide. Shipping costs are calculated at checkout based on destination and weight." },
  { q: "How long does shipping take?", a: "Domestic orders ship within 1–2 business days. International orders typically arrive in 7–14 business days." },
  { q: "Can I sell you my collection?", a: "Absolutely. Head to our Sell page, submit a few details, and we'll respond within 24 hours with a fair offer." },
  { q: "Do you accept returns?", a: "Sealed products can be returned within 14 days if unopened. Contact us first to start the return." },
  { q: "Are graded cards available?", a: "Yes — check the Shop and filter for graded items. New arrivals are added weekly." },
];

function Item({ q, a, open, onClick, delay }) {
  return (
    <div
      className="border-b border-zinc-200 dark:border-zinc-800 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left gap-4 group"
      >
        <span className="font-display font-bold text-base group-hover:text-[#dc2626] transition-colors">
          {q}
        </span>
        <span
          className="shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 grid place-items-center text-[#dc2626] transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{ maxHeight: open ? "300px" : "0px", opacity: open ? 1 : 0 }}
      >
        <p className="pb-5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <main className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white animate-page-enter overflow-hidden">
      <section className="relative border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/40 dark:to-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(220,38,38,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_50%_100%,rgba(184,144,31,0.10),transparent_70%)]" />

        <div className="relative max-w-3xl mx-auto px-6 py-16 sm:py-20 text-center animate-fade-up">
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.22em] text-[#b8901f] mb-2">
            Need Help?
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black mb-3">
            Frequently <span className="bg-gradient-to-r from-[#dc2626] to-[#b8901f] bg-clip-text text-transparent">Asked</span>
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Everything you need to know before buying or selling.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        {FAQS.map((item, i) => (
          <Item
            key={i}
            q={item.q}
            a={item.a}
            open={openIdx === i}
            onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            delay={i * 60}
          />
        ))}

        <div
          className="text-center mt-12 animate-fade-up"
          style={{ animationDelay: `${FAQS.length * 60 + 100}ms` }}
        >
          <p className="text-sm text-zinc-500 mb-4">Still have questions?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-display font-bold text-sm bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white hover:scale-105 transition-transform shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}