import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "rjs-cookie-consent-v1";

export default function PrivacyNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const persist = (choice) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, ts: Date.now() })
      );
    } catch {}
    setVisible(false);
    // Fire a custom event so analytics can react if needed
    window.dispatchEvent(
      new CustomEvent("rjs-consent", { detail: { choice } })
    );
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[60] rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dc2626]/10 to-[#b8901f]/10 grid place-items-center shrink-0">
          <Cookie className="w-5 h-5 text-[#dc2626]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-black text-sm text-zinc-950 dark:text-white">
            We use cookies
          </h2>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            We use essential cookies to keep your cart working and optional ones
            to understand what you love. See our{" "}
            <Link
              to="/privacy"
              className="underline font-bold text-[#dc2626] hover:text-[#b8901f]"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => persist("accepted")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white text-xs font-display font-black hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Accept all
            </button>
            <button
              onClick={() => persist("essential")}
              className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-display font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              Essential only
            </button>
          </div>
        </div>
        <button
          onClick={() => persist("essential")}
          aria-label="Close cookie banner"
          className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}