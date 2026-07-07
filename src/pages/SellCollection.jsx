import React, { useState } from "react";
import { Link } from "react-router-dom";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_SELL_FORM_ENDPOINT || "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SellCollection() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const e = {};
    if (!data.name || data.name.length < 2) e.name = "Please enter your name";
    if (data.name && data.name.length > 80) e.name = "Name too long";
    if (!data.email || !EMAIL_RE.test(data.email)) e.email = "Invalid email";
    if (data.email && data.email.length > 120) e.email = "Email too long";
    if (data.whatsapp && data.whatsapp.length > 30) e.whatsapp = "Too long";
    if (data.details && data.details.length > 2000)
      e.details = "Please keep it under 2000 characters";
    if (data.photos && data.photos.length > 500) e.photos = "URL too long";
    if (!data.consent) e.consent = "Consent is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    // Honeypot — real users never fill this
    if (data.website) {
      setSent(true); // pretend success to fool bots
      return;
    }

    data.consent = !!data.consent;
    const eMap = validate(data);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    if (!GOOGLE_SCRIPT_URL) {
      console.error("VITE_SELL_FORM_ENDPOINT is not configured.");
      alert("Form is temporarily unavailable. Please contact us via WhatsApp.");
      return;
    }

    setLoading(true);
    data.timestamp = new Date().toISOString();
    data.source = "rjs-website";
    data.page = window.location.href;

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("Error sending. Please try WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 grid place-items-center text-2xl text-emerald-600 mb-6">
          ✓
        </div>
        <h2 className="font-display font-black text-3xl text-zinc-950 dark:text-white">
          Received!
        </h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          We'll review your collection and reply within 24h with an offer.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30 focus:border-[#dc2626]";
  const errCls = "mt-1 text-xs text-red-600";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 dark:text-white">
        Sell Your Collection
      </h1>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        Tell us about your cards. We respond within 24h with a fair offer.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex="-1"
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div>
          <label htmlFor="name" className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
            Name *
          </label>
          <input id="name" name="name" maxLength={80} required className={inputCls} />
          {errors.name && <p className={errCls}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
            Email *
          </label>
          <input id="email" name="email" type="email" maxLength={120} required className={inputCls} />
          {errors.email && <p className={errCls}>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
            WhatsApp
          </label>
          <input id="whatsapp" name="whatsapp" maxLength={30} className={inputCls} />
          {errors.whatsapp && <p className={errCls}>{errors.whatsapp}</p>}
        </div>

        <div>
          <label htmlFor="type" className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
            Collection Type
          </label>
          <select id="type" name="type" className={inputCls}>
            <option>Pokémon</option>
            <option>Magic: The Gathering</option>
            <option>Yu-Gi-Oh!</option>
            <option>Sports Cards</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
            Estimated Quantity
          </label>
          <input id="quantity" name="quantity" type="number" min="0" max="999999" className={inputCls} />
        </div>

        <div>
          <label htmlFor="condition" className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
            Condition
          </label>
          <select id="condition" name="condition" className={inputCls}>
            <option>Mint / Near Mint</option>
            <option>Light Play</option>
            <option>Played</option>
            <option>Mixed</option>
          </select>
        </div>

        <div>
          <label htmlFor="photos" className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
            Photos Link (Drive, Imgur)
          </label>
          <input id="photos" name="photos" type="url" maxLength={500} className={inputCls} />
          {errors.photos && <p className={errCls}>{errors.photos}</p>}
        </div>

        <div>
          <label htmlFor="details" className="block text-xs font-bold mb-1 text-zinc-700 dark:text-zinc-300">
            Tell us more
          </label>
          <textarea id="details" name="details" rows={4} maxLength={2000} className={inputCls} />
          {errors.details && <p className={errCls}>{errors.details}</p>}
        </div>

        <label className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" name="consent" required className="mt-0.5" />
          <span>
            I agree to be contacted about my collection and accept the{" "}
            <Link to="/privacy" className="underline text-[#dc2626] font-bold">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && <p className={errCls}>{errors.consent}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white font-display font-black text-sm hover:scale-[1.01] active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send My Collection"}
        </button>

        <p className="text-center text-[11px] text-zinc-500">
          Your info goes directly to our Google Sheet – no spam.
        </p>
      </form>
    </div>
  );
}