import React, { useState } from "react";
import { Mail, MapPin, MessageCircle, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  const cards = [
    { Icon: Mail, label: "Email", value: "hello@rjscollectibles.com" },
    { Icon: MessageCircle, label: "Chat", value: "Instagram DM @rjscollectibles" },
    { Icon: MapPin, label: "Shipping", value: "Worldwide from RJS HQ" },
  ];

  return (
    <main className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white animate-page-enter overflow-hidden">
      <section className="relative border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/40 dark:to-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(220,38,38,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_50%_100%,rgba(184,144,31,0.10),transparent_70%)]" />

        <div className="relative max-w-3xl mx-auto px-6 py-16 sm:py-20 text-center animate-fade-up">
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.22em] text-[#b8901f] mb-2">
            Get In Touch
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black mb-3">
            Contact <span className="bg-gradient-to-r from-[#dc2626] to-[#b8901f] bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            We reply within 24 hours.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        {cards.map(({ Icon, label, value }, i) => (
          <div
            key={label}
            className="animate-fade-up p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-[#b8901f] transition-colors group"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dc2626] to-[#b8901f] grid place-items-center text-white mb-3 group-hover:scale-110 transition-transform">
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
            <p className="text-sm font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div
          className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-10 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          {sent ? (
            <div className="text-center py-10 animate-fade-up">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#dc2626] to-[#b8901f] grid place-items-center text-white mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl font-black mb-2">Message Sent</h2>
              <p className="text-sm text-zinc-500">We'll reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30 focus:border-[#dc2626] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30 focus:border-[#dc2626] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30 focus:border-[#dc2626] transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  name="message"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30 focus:border-[#dc2626] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-display font-black text-sm bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white hover:scale-[1.02] active:scale-95 transition-transform shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}