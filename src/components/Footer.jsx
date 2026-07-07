import React, { useState, useMemo } from "react";
import { Instagram, Youtube, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logo from "../assets/rjs-logo.png";

const NEWSLETTER_ENDPOINT = import.meta.env.VITE_NEWSLETTER_ENDPOINT || "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const { cards } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (email.length > 120) {
      setError("Email is too long");
      return;
    }

    setLoading(true);
    try {
      if (NEWSLETTER_ENDPOINT) {
        await fetch(NEWSLETTER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            ts: new Date().toISOString(),
            source: "rjs-footer",
          }),
        });
      }
      setSent(true);
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Could not subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
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
    <footer className="bg-gradient-to-b from-zinc-950 to-black text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* BRAND + NEWSLETTER */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="RJS Collectibles"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display font-black text-lg text-white">
                RJS <span className="text-[#dc2626]">Collectibles</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-zinc-400 max-w-sm">
              New inventory, discounts & restock updates — join our newsletter.
            </p>

            {sent ? (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-sm font-bold">
                ✓ Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-4 max-w-sm">
                <div className="relative">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address for newsletter
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    maxLength={120}
                    aria-label="Email address for newsletter"
                    aria-invalid={!!error}
                    className="w-full px-4 py-3 pr-12 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#d4a82a] focus:ring-2 focus:ring-[#d4a82a]/30 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white grid place-items-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-xs text-red-400" role="alert">
                    {error}
                  </p>
                )}
                <p className="mt-2 text-[10px] text-zinc-500">
                  By subscribing you accept our{" "}
                  <Link
                    to="/privacy"
                    className="underline hover:text-[#d4a82a]"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            )}

            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.instagram.com/rjs.collectibles/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RJS Collectibles on Instagram"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 grid place-items-center hover:bg-[#dc2626] hover:border-[#dc2626] transition-colors"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCFsYCjNu2e6WasAVHXh3X1w"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RJS Collectibles on YouTube"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 grid place-items-center hover:bg-[#dc2626] hover:border-[#dc2626] transition-colors"
              >
                <Youtube className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* SHOP — Shopify driven */}
          <div>
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-white mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="hover:text-[#d4a82a] transition-colors">
                  All Products
                </Link>
              </li>
              {shopCategories.map((tag) => (
                <li key={tag}>
                  <Link
                    to={`/shop?tag=${encodeURIComponent(tag)}`}
                    className="hover:text-[#d4a82a] transition-colors"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-white mb-4">
              Help
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sell" className="hover:text-[#d4a82a] transition-colors">
                  Sell Your Collection
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#d4a82a] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#d4a82a] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#d4a82a] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-[#d4a82a] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-white mb-2">
              About
            </h4>
            <p className="text-xs text-zinc-500 max-w-md">
              Worldwide shipping. Backed by our 100% authenticity guarantee.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-zinc-500">
            <span>© 2026 RJS Collectibles. All rights reserved.</span>
            <Link
              to="/privacy"
              className="hover:text-[#d4a82a] transition-colors underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map((p) => (
            <span
              key={p}
              className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}