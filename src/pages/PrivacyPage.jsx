import React from "react";
import { Link } from "react-router-dom";
import { Shield, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#dc2626]/10 to-[#b8901f]/10 grid place-items-center">
          <Shield className="w-6 h-6 text-[#dc2626]" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Last updated: June 2026
          </p>
          <h1 className="font-display font-black text-3xl text-zinc-950 dark:text-white">
            Privacy Policy
          </h1>
        </div>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <p>
          RJS Collectibles ("we", "our", "us") respects your privacy. This page
          explains what data we collect, why, and your rights under the
          Brazilian LGPD and the EU GDPR.
        </p>

        <section>
          <h2 className="font-display font-black text-lg text-zinc-950 dark:text-white">
            1. What we collect
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Order data</strong>: name, shipping address, email,
              payment confirmation — processed by Shopify.
            </li>
            <li>
              <strong>Sell-your-collection form</strong>: name, email, WhatsApp,
              and any details you choose to share about your cards.
            </li>
            <li>
              <strong>Contact form</strong>: name, email, message content.
            </li>
            <li>
              <strong>Newsletter</strong>: email address only.
            </li>
            <li>
              <strong>Essential cookies</strong>: cart state, theme preference,
              consent choice. These never leave your browser.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-black text-lg text-zinc-950 dark:text-white">
            2. Why we collect it
          </h2>
          <p>
            To process orders, reply to your messages, evaluate collections you
            offer to sell, and (with consent) send occasional restock and
            promotion emails. We never sell your data.
          </p>
        </section>

        <section>
          <h2 className="font-display font-black text-lg text-zinc-950 dark:text-white">
            3. Who processes it
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Shopify</strong> — checkout, payments, order fulfillment.
            </li>
            <li>
              <strong>Vercel</strong> — website hosting.
            </li>
            <li>
              <strong>Google (Apps Script + Sheets)</strong> — temporary storage
              of sell-collection submissions.
            </li>
            <li>
              <strong>YouTube</strong> — embedded videos on the homepage.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-black text-lg text-zinc-950 dark:text-white">
            4. Retention
          </h2>
          <p>
            Order data is kept for the legal minimum (typically 5 years in
            Brazil for tax purposes). Sell-form and contact submissions are kept
            for up to 12 months unless they become active negotiations or
            orders.
          </p>
        </section>

        <section>
          <h2 className="font-display font-black text-lg text-zinc-950 dark:text-white">
            5. Your rights
          </h2>
          <p>
            Under LGPD/GDPR you may request access, correction, deletion,
            portability, or withdrawal of consent at any time. Email us at{" "}
            <a
              href="mailto:hello@rjscollectibles.com"
              className="underline text-[#dc2626] font-bold"
            >
              hello@rjscollectibles.com
            </a>
            . We respond within 15 days.
          </p>
        </section>

        <section>
          <h2 className="font-display font-black text-lg text-zinc-950 dark:text-white">
            6. Cookies
          </h2>
          <p>
            We use only essential cookies by default. You can manage your choice
            anytime by clearing site data in your browser, which will re-show
            the consent banner.
          </p>
        </section>

        <section>
          <h2 className="font-display font-black text-lg text-zinc-950 dark:text-white">
            7. Contact
          </h2>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#dc2626]" />
            <a
              href="mailto:hello@rjscollectibles.com"
              className="underline font-bold"
            >
              hello@rjscollectibles.com
            </a>
          </div>
        </section>
      </div>

      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-display font-bold text-[#dc2626] hover:text-[#b8901f]"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}