import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Send, Check } from "lucide-react";

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (d) => {
    const e = {};
    if (!d.name || d.name.length < 2) e.name = "Please enter your name";
    if (d.name && d.name.length > 80) e.name = "Name too long";
    if (!d.email || !EMAIL_RE.test(d.email)) e.email = "Invalid email";
    if (!d.subject || d.subject.length < 2) e.subject = "Subject required";
    if (d.subject && d.subject.length > 120) e.subject = "Subject too long";
    if (!d.message || d.message.length < 5) e.message = "Message too short";
    if (d.message && d.message.length > 3000) e.message = "Message too long";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    // Honeypot
    if (data.website) {
      setSent(true);
      return;
    }

    const eMap = validate(data);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    if (!CONTACT_ENDPOINT) {
      console.error("VITE_CONTACT_ENDPOINT is not configured.");
      alert(
        "Form is temporarily unavailable. Please email hello@rjscollectibles.com directly."
      );
      return;
    }

    setLoading(true);
    try {
      await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          ...data,
          formType: "contact", // routes to handleContact() in Apps Script
          timestamp: new Date().toISOString(),
          page: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("Could not send. Please email hello@rjscollectibles.com directly.");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { Icon: Mail, label: "Email", value: "hello@rjscollectibles.com" },
    { Icon: MessageCircle, label: "Chat", value: "Instagram DM @rjscollectibles" },
    { Icon: MapPin, label: "Shipping", value: "Worldwide from RJS HQ" },
  ];

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30 focus:border-[#dc2626]";
  const errCls = "mt-1 text-xs text-red-600";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-widest text-[#dc2626] bg-red-50 dark:bg-red-950/30">
        Get In Touch
      </span>
      <h1 className="mt-4 font-display font-black text-3xl sm:text-4xl text-zinc-950 dark:text-white">
        Contact Us
      </h1>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        We reply within 24 hours.
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        {cards.map(({ Icon, label, value }, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
          >
            <Icon className="w-5 h-5 text-[#dc2626]" aria-hidden="true" />
            <p className="mt-2 text-[11px] uppercase tracking-widest text-zinc-500">
              {label}
            </p>
            <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-white">
              {value}
            </p>
          </div>
        ))}
      </div>

      {sent ? (
        <div className="mt-10 p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-center">
          <Check className="w-8 h-8 mx-auto text-emerald-600" />
          <h3 className="mt-3 font-display font-black text-xl text-zinc-950 dark:text-white">
            Message Sent
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            We'll reply within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-8 space-y-4">
          <input
            type="text"
            name="website"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div>
            <label htmlFor="c-name" className="block text-xs font-bold mb-1">Name</label>
            <input id="c-name" name="name" maxLength={80} required className={inputCls} />
            {errors.name && <p className={errCls}>{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="c-email" className="block text-xs font-bold mb-1">Email</label>
            <input id="c-email" name="email" type="email" maxLength={120} required className={inputCls} />
            {errors.email && <p className={errCls}>{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="c-subject" className="block text-xs font-bold mb-1">Subject</label>
            <input id="c-subject" name="subject" maxLength={120} required className={inputCls} />
            {errors.subject && <p className={errCls}>{errors.subject}</p>}
          </div>

          <div>
            <label htmlFor="c-message" className="block text-xs font-bold mb-1">Message</label>
            <textarea id="c-message" name="message" rows={5} maxLength={3000} required className={inputCls} />
            {errors.message && <p className={errCls}>{errors.message}</p>}
          </div>

          <p className="text-xs text-zinc-500">
            By submitting, you accept our{" "}
            <Link to="/privacy" className="underline text-[#dc2626] font-bold">
              Privacy Policy
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white font-display font-black text-sm hover:scale-[1.01] active:scale-95 transition-transform disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}