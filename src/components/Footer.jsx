import React, { useState, useMemo } from "react";
import { Instagram, Youtube, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logo from "../assets/rjs-logo.png";

export default function Footer() {
  const { cards } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const shopCategories = useMemo(() => {
    const counts = new Map();
    cards.forEach((c) => {
      (c.tags || []).forEach((raw) => {
        const tag = String(raw).trim();
        if (!tag) return;
        const low = tag.toLowerCase();
        if (low === "featured" || low === "mystery") return;
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [cards]);

  return (
    <footer className="relative overflow-hidden text-zinc-100
                       bg-gradient-to-b from-[#7f1d1d] via-[#5f1111] to-[#3a0a0a]
                       dark:from-[#2a0606] dark:via-[#1a0404] dark:to-[#0f0202]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,168,42,0.10),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* BRAND + NEWSLETTER */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src={logo}
              alt="RJS Collectibles"
              className="w-9 h-9 object-contain"
            />
            <span className="font-display font-black text-lg">
              RJS <span className="text-[#d4a82a]">Collectibles</span>
            </span>
          </div>

          <p className="text-sm text-zinc-300/90 mb-4">
            New inventory, discounts &amp; restock updates — join our newsletter.
          </p>

          {sent ? (
            <p className="text-sm font-bold text-[#d4a82a]">✓ Thanks for subscribing!</p>
          ) : (
            <form onSubmit={submit} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full px-4 py-3 pr-12 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#d4a82a] focus:ring-2 focus:ring-[#d4a82a]/30 transition-all"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 top-1.5 w-9 h-9 rounded-full bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white grid place-items-center hover:scale-105 transition-transform shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="flex items-center gap-3 mt-5">
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/10 text-[#d4a82a] grid place-items-center hover:bg-[#dc2626] hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full bg-white/10 text-[#d4a82a] grid place-items-center hover:bg-[#dc2626] hover:text-white transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* SHOP — Shopify driven */}
        <div>
          <h4 className="font-display font-black uppercase text-[11px] tracking-[0.22em] text-[#d4a82a] mb-4">
            Shop
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/shop" className="text-zinc-300 hover:text-white transition-colors">
                All Products
              </Link>
            </li>
            {shopCategories.map((tag) => (
              <li key={tag}>
                <Link
                  to={`/shop?tag=${encodeURIComponent(tag)}`}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h4 className="font-display font-black uppercase text-[11px] tracking-[0.22em] text-[#d4a82a] mb-4">
            Help
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sell" className="text-zinc-300 hover:text-white transition-colors">Sell Your Collection</Link></li>
            <li><Link to="/faq" className="text-zinc-300 hover:text-white transition-colors">FAQ</Link></li>
            <li><Link to="/contact" className="text-zinc-300 hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/contact" className="text-zinc-300 hover:text-white transition-colors">Shipping &amp; Returns</Link></li>
          </ul>
        </div>

        {/* ABOUT */}
        <div>
          <h4 className="font-display font-black uppercase text-[11px] tracking-[0.22em] text-[#d4a82a] mb-4">
            About
          </h4>
          <p className="text-sm text-zinc-300/90 leading-relaxed">
            Worldwide shipping.<br/>
            Backed by our 100% authenticity guarantee.
          </p>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <p>© 2026 RJS Collectibles. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map((p) => (
              <span key={p} className="px-2 py-1 rounded bg-white/5 border border-white/10 font-bold text-[10px]">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}