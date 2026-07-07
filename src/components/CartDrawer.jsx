import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { createShopifyCart } from "../services/shopify";

export default function CartDrawer() {
  const {
    cart,
    cards,
    showCartDrawer,
    toggleCart,
    addToCart,
    removeFromCart,
    updateCartQty,
    showToast,
  } = useApp();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);

  // Stable, deterministic recommendations — newest in-stock first
  const recommended = useMemo(() => {
    if (!showCartDrawer || cards.length === 0) return [];
    const available = cards.filter(
      (c) =>
        !cart.some((i) => i.id === c.id) &&
        c.stock > 0 &&
        c.source === "shopify" &&
        c.status === "active"
    );
    return [...available]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.publishedAt || 0) -
          new Date(a.createdAt || a.publishedAt || 0)
      )
      .slice(0, 3);
  }, [showCartDrawer, cart, cards]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const shopifyCart = await createShopifyCart(cart);
      if (shopifyCart?.checkoutUrl) {
        window.location.href = shopifyCart.checkoutUrl;
      } else {
        showToast("Checkout error", "error");
      }
    } catch (e) {
      showToast("Failed to create checkout", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") toggleCart();
    };
    if (showCartDrawer) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showCartDrawer, toggleCart]);

  if (!showCartDrawer) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={toggleCart}
      />

      {/* Drawer panel — slides from right */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative ml-auto h-full w-full sm:w-[440px] bg-white dark:bg-zinc-950 shadow-2xl flex flex-col animate-slide-from-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-display font-black text-lg text-zinc-950 dark:text-white">
            Cart ({cart.reduce((a, i) => a + i.qty, 0)})
          </h3>
          <button
            onClick={toggleCart}
            aria-label="Close cart"
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-40" aria-hidden="true" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
            >
              <img
                src={item.image || item.thumb}
                alt={item.name}
                className="w-16 h-16 object-contain rounded-lg bg-white dark:bg-zinc-800 p-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2">
                  {item.name}
                </p>
                <p className="mt-0.5 text-sm font-black text-[#dc2626]">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() =>
                      item.qty > 1
                        ? updateCartQty(item.id, item.qty - 1)
                        : removeFromCart(item.id)
                    }
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="p-1 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold min-w-[20px] text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() =>
                      item.qty < item.stock
                        ? updateCartQty(item.id, item.qty + 1)
                        : showToast(`Only ${item.stock} in stock`, "error")
                    }
                    disabled={item.qty >= item.stock}
                    aria-label={`Increase quantity of ${item.name}`}
                    className="p-1 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      showToast("Removed", "error");
                    }}
                    aria-label={`Remove ${item.name} from cart`}
                    className="ml-auto text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {item.qty >= item.stock && (
                  <p className="mt-1 text-[10px] text-amber-600 font-bold">
                    Max stock reached
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Recommended */}
          {cart.length > 0 && recommended.length > 0 && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="flex items-center gap-1.5 font-display font-black text-xs uppercase tracking-widest text-zinc-500 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#d4a82a]" aria-hidden="true" />
                You might also like
              </h4>
              <div className="space-y-2">
                {recommended.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <img
                      src={rec.image || rec.thumb}
                      alt={rec.name}
                      className="w-12 h-12 object-contain rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {rec.name}
                      </p>
                      <p className="text-xs font-black text-[#dc2626]">
                        ${rec.price.toFixed(2)}
                      </p>
                      {rec.stock <= 3 && (
                        <p className="text-[10px] text-amber-600 font-bold">
                          Only {rec.stock} left
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(rec, 1);
                      }}
                      disabled={rec.stock === 0}
                      aria-label={`Add ${rec.name} to cart`}
                      className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-gradient-to-r from-[#dc2626] to-[#c9a227] text-white hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Checkout footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Total
              </span>
              <span className="font-display font-black text-2xl text-zinc-950 dark:text-white">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              aria-label="Proceed to checkout"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white font-display font-black text-sm hover:scale-[1.01] active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                "Checkout"
              )}
            </button>
            <p className="mt-2 text-center text-[10px] text-zinc-500">
              Card • PayPal • Shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}