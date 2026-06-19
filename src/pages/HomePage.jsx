import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Send, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import Hero from "../components/Hero";
import FeaturedCards from "../components/FeaturedCards";
import HomeVideo from "../components/HomeVideo";
import ProductImage from "../components/ProductImage";
import mascot from "../assets/mascot.png";

function ProductCarousel({ title, items }) {
  const { selectCard, addToCart } = useApp();

  if (!items.length) return null;

  return (
    <section className="py-12 sm:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
            {title}
          </h2>

          <Link
            to="/shop"
            className="text-sm font-bold text-[#dc2626] hover:text-[#c9a227] flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
          {items.map((product, index) => (
            <article
              key={product.id}
              onClick={() => selectCard(product)}
              className="snap-start shrink-0 w-[190px] sm:w-[230px] cursor-pointer group animate-fade-up"
              style={{ animationDelay: `${Math.min(index * 55, 400)}ms` }}
            >
              <div className="relative aspect-square rounded-[1.35rem] bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden group-hover:border-[#c9a227] transition-all duration-300 shadow-sm group-hover:shadow-[0_18px_45px_rgba(201,162,39,0.22)]">
                <ProductImage
                  product={product}
                  className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[linear-gradient(105deg,transparent_20%,rgba(201,162,39,0.18)_48%,transparent_76%)]" />

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

export default function HomePage() {
  const { cards, productsLoading } = useApp();

  const shopifyProducts = useMemo(
    () =>
      cards.filter(
        (product) =>
          product.source === "shopify" &&
          product.status === "active" &&
          product.stock > 0
      ),
    [cards]
  );

  const featured = useMemo(
    () =>
      shopifyProducts
        .filter((product) =>
          (product.tags || []).some(
            (tag) => String(tag).toLowerCase() === "featured"
          )
        )
        .slice(0, 10),
    [shopifyProducts]
  );

  const newArrivals = useMemo(
    () => shopifyProducts.slice(0, 10),
    [shopifyProducts]
  );

  const mysteryProducts = useMemo(
    () =>
      shopifyProducts
        .filter((product) =>
          (product.tags || []).some(
            (tag) => String(tag).toLowerCase() === "mystery"
          )
        )
        .slice(0, 10),
    [shopifyProducts]
  );

  const collections = useMemo(() => {
    const skip = new Set(["featured", "mystery"]);
    const tagMap = new Map();

    shopifyProducts.forEach((product) => {
      const productImage =
        product.image ||
        product.thumb ||
        product.images?.[0] ||
        product.imageGallery?.[0] ||
        "";

      if (!productImage) return;

      (product.tags || []).forEach((rawTag) => {
        const tag = String(rawTag).trim();

        if (!tag || skip.has(tag.toLowerCase())) return;

        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            name: tag,
            image: productImage,
            count: 1,
          });
        } else {
          tagMap.set(tag, {
            ...tagMap.get(tag),
            count: tagMap.get(tag).count + 1,
          });
        }
      });
    });

    return Array.from(tagMap.values()).slice(0, 8);
  }, [shopifyProducts]);

  return (
    <main className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white animate-page-enter overflow-hidden">
      <Hero />

      {productsLoading && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="aspect-square skeleton-loader rounded-3xl" />
              ))}
            </div>
          </div>
        </section>
      )}

      {!productsLoading && (
        <>
          <FeaturedCards />

          <section className="py-12 border-y border-[#fca5a5]/40 dark:border-[#5f1111]/50 bg-gradient-to-b from-[#fff1f2] via-white to-[#fff1f2] dark:from-[#1a0404] dark:via-zinc-950 dark:to-[#1a0404]">
            <div className="max-w-3xl mx-auto px-6 text-center animate-fade-up">
              <h2 className="font-display text-2xl sm:text-3xl font-black mb-2">
                Help &amp; Contact
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Selling a collection? Have questions?
              </p>

              <Link
                to="/sell"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-display font-bold text-sm bg-gradient-to-r from-[#dc2626] to-[#c9a227] text-white hover:scale-105 transition-transform shadow-lg"
              >
                <Send className="w-4 h-4" />
                SEND A MESSAGE
              </Link>

              <div className="mt-8 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className="text-[#c9a227] text-lg">
                    ★
                  </span>
                ))}
                <span className="ml-2 font-black">4.9/5</span>
                <span className="ml-2 text-sm text-zinc-500">
                  verified customer rating
                </span>
              </div>
            </div>
          </section>

          <ProductCarousel title="New Arrivals" items={newArrivals} />

          {mysteryProducts.length > 0 && (
            <ProductCarousel title="RJS Mystery Products" items={mysteryProducts} />
          )}

          <section className="py-16 sm:py-24 bg-gradient-to-b from-[#fef2f2] to-white dark:from-zinc-950 dark:to-[#0f0202] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.15),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(185,28,28,0.18),transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(127,29,29,0.25),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(69,10,10,0.3),transparent_40%)]" />

            <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
              <img
                src={mascot}
                alt="RJS mascot illustration"
                className="max-h-[380px] object-contain mx-auto drop-shadow-2xl animate-float"
                loading="lazy"
              />

              <div className="animate-fade-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dc2626]/10 text-[#dc2626] text-xs font-black uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified by RJS
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-black mb-4">
                  Authenticity Guaranteed
                </h2>

                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Every pack is inspected before it ships — backed by our
                  authenticity-first buying process.
                </p>
              </div>
            </div>
          </section>

          {collections.length > 0 && (
            <section className="py-16 bg-gradient-to-b from-white via-[#fff1f2] to-white dark:from-zinc-950 dark:via-[#1a0404] dark:to-zinc-950">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="font-display text-2xl sm:text-3xl font-black mb-8">
                  Browse Collections
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {collections.map((collection, index) => (
                    <Link
                      key={collection.name}
                      to={`/shop?tag=${encodeURIComponent(collection.name)}`}
                      className="group relative rounded-[1.5rem] overflow-hidden bg-gradient-to-b from-[#dc2626] via-[#991b1b] to-[#450a0a] dark:from-[#7f1d1d] dark:via-[#5f1111] dark:to-[#1a0404] p-4 aspect-[4/5] flex flex-col items-center justify-end text-center hover:scale-[1.025] transition-all duration-300 shadow-lg hover:shadow-[0_20px_50px_rgba(220,38,38,0.35)] animate-fade-up"
                      style={{ animationDelay: `${Math.min(index * 65, 450)}ms` }}
                    >
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="absolute inset-0 m-auto w-[82%] h-[82%] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2"
                        loading="lazy"
                        decoding="async"
                      />

                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950/70" />

                      <div className="relative z-10 bg-zinc-950/80 backdrop-blur px-3 py-1 rounded-full mb-2">
                        <span className="text-[10px] font-display font-black text-[#c9a227] tracking-widest">
                          {collection.count} ITEMS
                        </span>
                      </div>

                      <h3 className="relative z-10 font-display font-black text-white text-sm sm:text-base drop-shadow">
                        {collection.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <HomeVideo />

          <section className="relative bg-gradient-to-b from-[#5f1111] via-[#7f1d1d] to-[#7f1d1d] dark:from-[#1a0404] dark:via-[#2a0606] dark:to-[#2a0606] py-14 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,168,42,0.10),transparent_70%)] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              {[
                { n: "RJS", l: "Collectibles" },
                { n: "100%", l: "Authenticity Focus" },
                { n: "Fast", l: "Checkout" },
                { n: "Fresh", l: "Shopify Inventory" },
                { n: "Global", l: "Collector Market" },
              ].map((stat, i) => (
                <div
                  key={stat.l}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="font-display text-2xl sm:text-3xl font-black text-white">
                    {stat.n}
                  </div>
                  <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#d4a82a]">
                    {stat.l}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
