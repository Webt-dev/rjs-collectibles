import React, { useState, useEffect } from "react";
import { X, ShoppingCart, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function CardDetailsModal({ card, onClose }) {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [qty, setQty] = useState(1);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  if (!card) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 240);
  };

  const handleAdd = () => {
    addToCart(card, qty);
    handleClose();
  };

  const handleTagClick = (tag) => {
    handleClose();
    setTimeout(() => navigate(`/shop?tag=${encodeURIComponent(tag)}`), 240);
  };

  const visibleTags = (card.tags || []).filter((t) => t.toLowerCase() !== "featured");
  const maxQty = Math.min(card.stock || 99, 10);

  const imgUrl = card.image || card.thumb || card.images?.[0] || "";

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 ${
        closing ? "animate-backdrop-fade-out" : "animate-backdrop-fade-in"
      }`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-md" />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-[0_30px_80px_rgba(0,0,0,0.4)] ${
          closing ? "animate-modal-pop-out" : "animate-modal-pop"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 grid place-items-center hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] hover:rotate-90 transition-all duration-300 shadow-md"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* LEFT — Image */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[500px] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 p-8 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(220,38,38,0.06),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_50%_50%,rgba(184,144,31,0.10),transparent_70%)]" />

            {imgUrl && !imgErr ? (
              {imgUrl} setImgErr(true)}
              />
            ) : (
              <span className="text-xs uppercase tracking-widest text-zinc-400">
                No image
              </span>
            )}
          </div>

          {/* RIGHT — Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="animate-fade-up">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {card.productType && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white">
                    {card.productType}
                  </span>
                )}
                {visibleTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-black mb-2">
                {card.name}
              </h2>

              {card.set && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  {card.set}
                </p>
              )}

              {card.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {card.description}
                </p>
              )}
            </div>

            {/* Price + Stock */}
            <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800 animate-fade-up" style={{ animationDelay: "120ms" }}>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">Price</p>
                  <p className="text-3xl font-display font-black bg-gradient-to-r from-[#dc2626] to-[#b8901f] bg-clip-text text-transparent">
                    ${Number(card.price).toFixed(2)}
                  </p>
                </div>
                <p className={`text-xs font-bold ${card.stock <= 3 ? "text-amber-600 animate-badge-pulse" : "text-zinc-500"}`}>
                  {card.stock} in stock
                </p>
              </div>

              {/* Qty */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Qty</span>
                <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 grid place-items-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-9 text-center text-sm font-bold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="w-9 h-9 grid place-items-center hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={card.stock <= 0}
                className="w-full py-3.5 rounded-xl font-display font-black text-sm bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-[#dc2626]/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}