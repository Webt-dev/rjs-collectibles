import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Send, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import Hero from "../components/Hero";
import FeaturedCards from "../components/FeaturedCards";
import NewArrivals from "../components/NewArrivals";
import HomeVideo from "../components/HomeVideo";
import ProductImage from "../components/ProductImage";
import mascot from "../assets/mascot.png";

function ProductCarousel({ title, items }) {
  const { selectCard, addToCart } = useApp();
  if (!items.length) return null;
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 dark:text-white">
            {title}
          </h2>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-display font-bold text-[#dc2626] hover:text-[#b8901f]"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 pl-4 pr-6 sm:mx-0 sm:px-0 scrollbar-hide scroll-pl-4">
          {items.map((product, index) => (
            <div
              key={product.id}
              onClick={() => selectCard(product)}
              className="snap-start shrink-0 w-[155px] sm:w-[230px] cursor-pointer group animate-fade-up"
              style={{ animationDelay: `${Math.min(index * 55, 400)}ms` }}
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <ProductImage
                  product={product}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    addToCart(product);
                  }}
                  aria-label={`Add ${product.name} to cart`}
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 grid place-items-center text-[#dc2626] hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] shadow-lg transition-all hover:scale-110 active:scale-95"
                >
                  +
                </button>
              </div>
              <h3 className="mt-3 text-sm font-display font-bold text-zinc-900 dark:text-white line-clamp-2">
                {product.name}
              </h3>
              <p className="mt-1 text-sm font-black text-[#dc2626]">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
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

  // Truly "newest" — sorted by createdAt DESC, stable across reloads
  const newArrivals = useMemo(
    () =>
      [...shopifyProducts]
       .sort(
          (a, b) =>
            new Date(b.createdAt || b.publishedAt || 0) -
            new Date(a.createdAt || a.publishedAt || 0)
        )
       .slice(0, 10),
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
          tagMap.set(tag, { name: tag, image: productImage, count: 1 });
        } else {
          const prev = tagMap.get(tag);
          tagMap.set(tag, {...prev, count: prev.count + 1 });
        }
      });
    });
    // Stable alphabetical order — same on every render
    return Array.from(tagMap.values())
     .sort((a, b) => a.name.localeCompare(b.name))
     .slice(0, 8);
  }, [shopifyProducts]);

  return (
    <div className="bg-white dark:bg-zinc-950">
      <Hero />

      {productsLoading && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
              />
            ))}
          </div>
        </section>
      )}

      {!productsLoading && (
        <>
          <FeaturedCards />

          <NewArrivals items={newArrivals} />

          <section className="py-12 sm:py-16 bg-zinc-50 dark:bg-zinc-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-widest text-[#dc2626] bg-red-50 dark:bg-red-950/30">
                Help & Contact
              </span>
              <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl text-zinc-950 dark:text-white">
                Selling a collection? Have questions?
              </h2>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white font-display font-black text-sm hover:scale-[1.02] active:scale-95 transition-transform shadow-lg"
              >
                <Send className="w-4 h-4" />
                SEND A MESSAGE
              </Link>
              <div className="mt-6 flex items-center justify-center gap-1 text-xs text-zinc-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className="text-[#d4a82a]">
                    ★
                  </span>
                ))}
                <span className="ml-2 font-bold">4.9/5</span>
                <span>verified customer rating</span>
              </div>
            </div>
          </section>

          {mysteryProducts.length > 0 && (
            <ProductCarousel title="Mystery Products" items={mysteryProducts} />
          )}

          <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
              <img
                src={mascot}
                alt="RJS mascot illustration"
                className="w-full max-w-sm mx-auto"
              />
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest text-[#dc2626] bg-red-50 dark:bg-red-950/30">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  Verified by RJS
                </span>
                <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl text-zinc-950 dark:text-white">
                  Authenticity Guaranteed
                </h2>
                <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                  Every pack is inspected before it ships — backed by our
                  authenticity-first buying process.
                </p>
              </div>
            </div>
          </section>

          {collections.length > 0 && (
            <section className="py-12 sm:py-16 bg-zinc-50 dark:bg-zinc-900/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 dark:text-white mb-6">
                  Browse Collections
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {collections.map((collection, index) => (
                    <Link
                      key={collection.name}
                      to={`/shop?tag=${encodeURIComponent(collection.name)}`}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-fade-up"
                      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
                    >
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-[10px] font-bold tracking-widest text-[#d4a82a]">
                          {collection.count} ITEMS
                        </p>
                        <h3 className="mt-1 font-display font-black text-lg text-white line-clamp-2">
                          {collection.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <HomeVideo />

          <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-5 gap-6 text-center">
              {[
                { n: "RJS", l: "Collectibles" },
                { n: "100%", l: "Authenticity Focus" },
                { n: "Fast", l: "Checkout" },
                { n: "Fresh", l: "Shopify Inventory" },
                { n: "Global", l: "Collector Market" },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="font-display font-black text-2xl sm:text-3xl bg-gradient-to-br from-[#dc2626] to-[#b8901f] bg-clip-text text-transparent">
                    {stat.n}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-widest text-zinc-500">
                    {stat.l}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
