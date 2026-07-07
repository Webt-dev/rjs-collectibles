import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import ProductImage from "./ProductImage";

export default function FeaturedCards() {
  const { cards, addToCart, selectCard } = useApp();

  const featured = cards.filter(
    (product) =>
      product.source === "shopify" &&
      product.status === "active" &&
      product.stock > 0 &&
      (product.tags || []).some((tag) => String(tag).toLowerCase() === "featured")
  );

  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll(".fc-item");

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

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [featured]);

  if (featured.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 section-glow-red overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a227] mb-1">
              Hand-picked
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
              Featured This Week
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-sm font-bold text-[#dc2626] hover:text-[#c9a227] flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          ref={gridRef}
          className="flex gap-3 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 pl-4 pr-6 scrollbar-hide scroll-pl-4"
        >
          {featured.slice(0, 10).map((product) => (
            <article
              key={product.id}
              onClick={() => selectCard(product)}
              className="fc-item scroll-reveal snap-start shrink-0 w-[155px] sm:w-[230px] cursor-pointer group"
            >
              <div className="relative aspect-square rounded-[1.35rem] bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden group-hover:border-[#c9a227] transition-all duration-300 shadow-sm group-hover:shadow-[0_18px_45px_rgba(201,162,39,0.22)]">
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#dc2626] to-[#c9a227] text-white text-[9px] font-black uppercase tracking-wider">
                  ★ Featured
                </div>

                <ProductImage
                  product={product}
                  className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,rgba(201,162,39,0.16),transparent_55%)]" />

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

                {product.stock <= 3 && product.stock > 0 && (
                  <p className="text-[10px] text-amber-600 font-bold mt-0.5 animate-badge-pulse">
                    Only {product.stock} left
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
