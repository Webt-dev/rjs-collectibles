import React, { useState, useEffect } from "react";
import { X, ShoppingCart, Minus, Plus, Package, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProductDetailsModal({ product, onClose }) {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const maxQty = Math.min(product?.stock || 99, 10);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, qty);
    onClose();
  };

  const handleTagClick = (tag) => {
    onClose();
    navigate(`/shop?tag=${encodeURIComponent(tag)}`);
  };

  const visibleTags = (product.tags || []).filter(t => t.toLowerCase()!== 'featured');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-[24px] shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-900">
          <h2 className="text-[22px] font-bold truncate pr-4">{product.name}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>

        {/* FIXED HEIGHT GRID - same height every time */}
        <div className="grid md:grid-cols-2 md:min-h-[500px]">
          {/* LEFT - image always centered */}
          <div className="p-8 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/50">
            <img
              src={imgError? "https://via.placeholder.com/400x500" : product.image}
              alt={product.name}
              className="max-h-[420px] w-auto object-contain"
              onError={() => setImgError(true)}
            />
          </div>

          {/* RIGHT - flex column with consistent spacing */}
          <div className="p-8 flex flex-col h-full">
            {/* TAGS ROW - all balloons together like VERIFIED */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-[28px] items-center">
              {product.productType && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                  {product.productType}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </span>
              {visibleTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 hover:text-[#dc2626] hover:border-red-200 dark:hover:bg-red-950/30 dark:hover:border-red-900 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* CONTENT AREA - flex-1 keeps button at bottom */}
            <div className="flex-1 flex flex-col">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 min-h-[40px] leading-relaxed">
                {product.description || " "}
              </p>

              <div className="text-[32px] font-bold text-[#dc2626] mb-3 leading-none">
                ${Number(product.price).toFixed(2)}
              </div>

              <div className="flex items-center gap-2 mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                <Package className="w-4 h-4" />
                <span>Stock: {product.stock}</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm">Quantity</span>
                <div className="flex border border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-9 h-9 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center leading-9 text-sm font-medium border-x border-zinc-300 dark:border-zinc-700">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(maxQty, q+1))} className="w-9 h-9 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* BUTTON ALWAYS AT BOTTOM */}
            <button
              onClick={handleAdd}
              className="w-full h-12 rounded-xl text-white font-semibold shadow-lg shadow-red-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all mt-auto"
              style={{ background: 'linear-gradient(90deg, #dc2626, #ea580c)' }}
            >
              <ShoppingCart className="inline w-4 h-4 mr-2" />Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
