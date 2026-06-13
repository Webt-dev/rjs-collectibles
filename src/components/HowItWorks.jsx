import React from "react";
import { Search, ShieldCheck, Package } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Browse & Search",
    desc: "Explore verified inventory with filters for set, rarity, and condition."
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Verified Quality",
    desc: "Every card is hand-checked, authenticated, and condition-graded by us."
  },
  {
    num: "03",
    icon: Package,
    title: "Secure Delivery",
    desc: "Carefully packaged, tracked shipping, and delivered to your door."
  }
];

export default function HowItWorks() {
  return (
    <section className="relative py-16 border-t border-zinc-200 dark:border-zinc-900/60 bg-[#fcfbf8] dark:bg-zinc-950">
      {/* subtle red glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-red-600/5 dark:bg-red-600/[0.04] blur-[80px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-white">How It Works</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Three simple steps, no surprises</p>
        </div>

        <div className="relative">
          {/* connecting line - desktop only */}
          <div className="hidden md:block absolute top-[32px] left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-800 to-transparent" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative group">
                  {/* step circle */}
                  <div className="flex justify-center mb-5">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 group-hover:border-red-300 dark:group-hover:border-red-900/50 flex items-center justify-center transition-colors shadow-sm dark:shadow-none">
                        <Icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900/50 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400">{step.num}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-1.5">{step.title}</h3>
                    <p className="text-[13px] text-zinc-600 dark:text-zinc-500 leading-snug max-w-[240px] mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
