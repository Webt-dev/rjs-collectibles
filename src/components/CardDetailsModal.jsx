import React, { useState, useEffect } from "react";
import { X, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function CardDetailsModal({ card, onClose }) {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!card) return null;

  const market = card.marketPrices || {
    tcgplayer: card.price * 1.01,
    cardmarket: card.price * 0.95,
    ebay: card.price * 0.97,
  };

  const handleAdd = () => {
    addToCart(card, 1);
    onClose();
  };

  const handleTagClick = (tag) => {
    onClose();
    navigate(`/shop?tag=${encodeURIComponent(tag)}`);
  };

  const visibleTags = (card.tags || []).filter(t => t.toLowerCase()!== 'featured');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-900">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white truncate pr-4">
            {card.name}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="grid md:grid-cols-2">
          {/* LEFT: Image */}
          <div className="p-8 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/50">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-amber-200/50 blur-2xl" />
              <div className="relative bg-white p-2 rounded-xl shadow-xl">
                <img
                  src={imgErr? "https://via.placeholder.com/400x560/facc15/000?text=RJS" : card.image}
                  alt={card.name}
                  className="w-full max-w- aspect-[3/4] object-contain"
                  onError={() => setImgErr(true)}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="p-8 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {card.rarity && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200">
                  {card.rarity}
                </span>
              )}
              {card.condition && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                  {card.condition}
                </span>
              )}
            </div>

            {/* TAGS - featured hidden, clickable */}
            {visibleTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {visibleTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-2.5 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-[#dc2626] hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              <p className="font-medium text-zinc-900 dark:text-white">
                {card.set || "Crown Zenith"} · {card.number || card.sku || "GG30/GG70"}
              </p>
              {card.variant && <p>Variant: {card.variant}</p>}
              <p className="text-zinc-500 leading-relaxed">
                {card.description || `${card.name} from the ${card.set || "Galarian Gallery"}.`}
              </p>
            </div>

            <div className="text-3xl font-bold text-[#dc2626] mb-5">
              ${Number(card.price).toFixed(2)}
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Market Prices</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-100">
                  <span className="text-sm font-medium text-sky-600">TCGPlayer</span>
                  <span className="font-semibold">${market.tcgplayer.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100">
                  <span className="text-sm font-medium text-orange-600">Cardmarket</span>
                  <span className="font-semibold">${market.cardmarket.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100">
                  <span className="text-sm font-medium text-red-600">eBay Sold</span>
                  <span className="font-semibold">${market.ebay.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className={`text-sm ${card.stock <= 3? "text-amber-600 font-medium" : "text-zinc-600 dark:text-zinc-400"}`}>
                Stock: {card.stock} available
              </span>
              {card.stock <= 3 && card.stock > 0 && (
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 animate-pulse">
                  Low stock
                </span>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={card.stock === 0}
              className="w-full h-12 rounded-xl font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
              style={{ background: 'linear-gradient(90deg, #dc2626 0%, #c9a227 100%)' }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}