import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useApp } from "../context/AppContext";
import ProductImage from "../components/ProductImage";

export default function ShopPage() {
  const { cards, selectCard, addToCart, productsLoading } = useApp();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [sort, setSort] = useState("newest");

  const shopifyProducts = useMemo(
    () => cards.filter(p => p.source === "shopify" && p.status === "active"),
    [cards]
  );

  const allTags = useMemo(() => {
    const tags = new Set();
    shopifyProducts.forEach(p =>
      (p.tags || []).forEach(t => {
        const tag = String(t).trim();
        // <-- take "featured" out of shop filters
        if (tag.toLowerCase() === "featured") return;
        tags.add(tag);
      })
    );
    const priority = ["Booster Box", "Booster Pack", "2010", "2013", "2016", "2020"];
    const sorted = Array.from(tags).sort((a, b) => {
      const ia = priority.indexOf(a);
      const ib = priority.indexOf(b);
      if (ia!== -1 && ib!== -1) return ia - ib;
      if (ia!== -1) return -1;
      if (ib!== -1) return 1;
      return a.localeCompare(b);
    });
    return ["All",...sorted];
  }, [shopifyProducts]);

  const filtered = useMemo(() => {
    let list = shopifyProducts;
    if (activeTag!== "All") {
      list = list.filter(p => (p.tags || []).some(t => String(t).trim().toLowerCase() === activeTag.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (p.tags || []).some(t => String(t).toLowerCase().includes(q))
      );
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "newest") list = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list;
  }, [shopifyProducts, activeTag, search, sort]);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* SEARCH - NOW WHITE IN LIGHT MODE */}
      <section className="relative border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/20 focus:border-zinc-400 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-zinc-500 hidden sm:block" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-[42px] px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400/20"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
            {allTags.slice(0, 12).map(tag => {
              const active = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active
                    ? "bg-[#dc2626] text-white shadow-md"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {productsLoading? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0? (
          <div className="text-center py-20">
            <p className="text-zinc-500">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <article key={product.id} onClick={() => selectCard(product)} className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 group-hover:border-[#c9a227] group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
                  <ProductImage
                    product={product}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.stock <= 3 && product.stock > 0 && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-zinc-900/85 text-white backdrop-blur-sm shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
                      Only {product.stock}
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    disabled={product.stock === 0}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 grid place-items-center text-[#dc2626] shadow-lg hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Add to cart"
                  >
                    +
                  </button>
                </div>
                <div className="mt-2.5 px-0.5">
                  <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-white line-clamp-2 leading-snug min-h-[34px]">
                    {product.name}
                  </h3>
                  <p className="text-[15px] font-black text-[#dc2626] mt-1">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
