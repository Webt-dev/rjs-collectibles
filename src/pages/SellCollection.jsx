import React, { useState } from "react";

const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

export default function SellCollection() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    data.timestamp = new Date().toISOString();
    data.source = "rjs-website";

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSent(true);
    } catch (err) {
      alert("Error sending. Please try WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <section className="bg-[#fcfbf8] dark:bg-zinc-950 min-h-[70vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="panel p-10">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Received!</h1>
            <p className="text-zinc-600 dark:text-zinc-400">We’ll review your collection and reply within 24h with an offer.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-900 bg-[#fcfbf8] dark:bg-zinc-950">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,38,38,0.12),_transparent_60%)]" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 py-12 lg:py-16">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-[clamp(1.8rem,4vw,2.5rem)] text-zinc-900 dark:text-white">
            Sell Your <span className="text-[#dc2626]">Collection</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">Tell us about your cards. We respond within 24h with a fair offer.</p>
        </div>

        <form onSubmit={handleSubmit} className="panel p-6 sm:p-8 space-y-4">
          {/* Row 1 */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] text-zinc-500">Name*</label>
              <input name="name" required className="input mt-1" placeholder="Arthur Mateus" />
            </div>
            <div>
              <label className="text-[12px] text-zinc-500">Email*</label>
              <input name="email" type="email" required className="input mt-1" placeholder="you@email.com" />
            </div>
          </div>

          {/* Row 2 - THIS WAS MISSING ITS CLOSING TAG */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] text-zinc-500">WhatsApp</label>
              <input name="phone" className="input mt-1" placeholder="+55 21..." />
            </div>
            <div>
              <label className="text-[12px] text-zinc-500">Collection Type</label>
              <select name="type" className="input mt-1" defaultValue="Pokémon">
                <option>Pokémon</option>
                <option>Magic: The Gathering</option>
                <option>Yu-Gi-Oh!</option>
                <option>Sports Cards</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] text-zinc-500">Estimated Quantity</label>
              <input name="quantity" className="input mt-1" placeholder="e.g., 300 cards" />
            </div>
            <div>
              <label className="text-[12px] text-zinc-500">Condition</label>
              <select name="condition" className="input mt-1" defaultValue="Mint / Near Mint">
                <option>Mint / Near Mint</option>
                <option>Light Play</option>
                <option>Played</option>
                <option>Mixed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[12px] text-zinc-500">Photos Link (Drive, Imgur)</label>
            <input name="photos" className="input mt-1" placeholder="https://" />
          </div>

          <div>
            <label className="text-[12px] text-zinc-500">Tell us more</label>
            <textarea name="notes" rows="4" className="input mt-1" placeholder="Key cards, sets, year, graded?" />
          </div>

          <label className="flex items-center gap-2 text-[12px] text-zinc-600 dark:text-zinc-400">
            <input type="checkbox" name="consent" required /> I agree to be contacted about my collection
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full h-12 text-[15px]"
            style={{background: 'linear-gradient(90deg, #dc2626, #c9a227)'}}
          >
            {loading? "Sending..." : "Send My Collection"}
          </button>

          <p className="text-[11px] text-center text-zinc-500">Your info goes directly to our Google Sheet – no spam.</p>
        </form>
      </div>
    </section>
  );
}
