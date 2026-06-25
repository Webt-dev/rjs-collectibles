import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import ProductImage from "./ProductImage";

export default function NewArrivals({ items }) {
  const { addToCart, selectCard } = useApp();
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const elements = gridRef.current.querySelectorAll(".na-item");

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  if (!items?.length) return null;

  const scroll = (dir) => {
    if (gridRef.current) {
      const amount = window.innerWidth < 640? 170 : 250;
      gridRef.current.scrollBy({ left: dir * amount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.22em] text-[#dc2626] mb-1">
              Just dropped
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
              New Arrivals
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-1">
              <button
                onClick={() => scroll(-1)}
                aria-label="Previous"
                className="w-8 h-8 grid place-items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-[#dc2626] hover:border-[#dc2626] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll(1)}
                aria-label="Next"
                className="w-8 h-8 grid place-items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-[#dc2626] hover:border-[#dc2626] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <Link
              to="/shop"
              className="text-sm font-bold text-[#dc2626] hover:text-[#c9a227] flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div
          ref={gridRef}
          className="flex gap-3 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 pl-4 pr-6 scrollbar-hide scroll-pl-4"
        >
          {items.slice(0, 10).map((product) => (
            <article
              key={product.id}
              onClick={() => selectCard(product)}
              className="na-item scroll-reveal snap-start shrink-0 w-[155px] sm:w-[230px] cursor-pointer group"
            >
              <div className="relative aspect-square rounded-[1.35rem] bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden group-hover:border-[#dc2626] transition-all duration-300 shadow-sm group-hover:shadow-[0_18px_45px_rgba(220,38,38,0.18)]">
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#dc2626] to-[#c9a227] text-white text-[9px] font-black uppercase tracking-wider">
                  NEW
                </div>

                <ProductImage
                  product={product}
                  className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,rgba(220,38,38,0.14),transparent_55%)]" />

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    addToCart(product);
                  }}
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 grid place-items-center text-[#dc2626] hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] shadow-lg transition-all hover:scale-110 active:scale-95"
                  aria-label="Add to cart"
                >
                  +
                </button>
              </div>

              <div className="mt-3 text-center">
                <h3 className="text-sm font-display font-bold text-zinc-950 dark:text-white truncate">
                  {product.name}
                </h3>
                <p className="text-sm font-black text-[#dc2626]">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
