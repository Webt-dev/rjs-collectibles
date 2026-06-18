import React, { useState, useMemo, useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingCart, Loader2, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { createShopifyCart } from "../services/shopify";

export default function CartDrawer() {
  const { cart, cards, showCartDrawer, toggleCart, addToCart, removeFromCart, updateCartQty, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);

  const recommended = useMemo(() => {
    if (!showCartDrawer || cards.length === 0) return [];
    const available = cards.filter(c => !cart.some(i => i.id === c.id) && c.stock > 0);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [showCartDrawer, cart, cards]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const shopifyCart = await createShopifyCart(cart);
      if (shopifyCart?.checkoutUrl) { window.location.href = shopifyCart.checkoutUrl; }
      else { showToast("Checkout error", "error"); }
    } catch (e) { showToast("Failed to create checkout", "error"); }
    setLoading(false);
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") toggleCart(); };
    if (showCartDrawer) { document.addEventListener("keydown", handleEsc); }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showCartDrawer, toggleCart]);

  if (!showCartDrawer) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={toggleCart}>
      {/* Backdrop with blur */}
      <div className="absolute inset-0 animate-backdrop-fade-in" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }} />

      {/* Drawer panel — slides from right */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-slide-from-right" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Cart ({cart.reduce((a, i) => a + i.qty, 0)})
          </h3>
          <button onClick={toggleCart} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"><X className="w-5 h-5 text-zinc-500" /></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 && <div className="text-center py-12 text-zinc-400 text-sm">Your cart is empty</div>}

          {cart.map(item => (
            <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
              <img src={item.image || item.thumb} alt={item.name} className="w-14 h-14 rounded-lg object-contain bg-white dark:bg-zinc-900" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-zinc-900 dark:text-white truncate">{item.name}</div>
                <div className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">${(item.price * item.qty).toFixed(2)}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={() => item.qty > 1 ? updateCartQty(item.id, item.qty - 1) : removeFromCart(item.id)} className="p-1 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300"><Minus className="w-3 h-3" /></button>
                  <span className="text-[13px] font-medium w-6 text-center">{item.qty}</span>
                  <button onClick={() => item.qty < item.stock ? updateCartQty(item.id, item.qty + 1) : showToast(`Only ${item.stock} in stock`, "error")} disabled={item.qty >= item.stock} className="p-1 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 disabled:opacity-30"><Plus className="w-3 h-3" /></button>
                  <button onClick={() => { removeFromCart(item.id); showToast("Removed", "error"); }} className="ml-auto text-zinc-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
                {item.qty >= item.stock && <div className="text-[10px] text-amber-600 mt-1">Max stock reached</div>}
              </div>
            </div>
          ))}

          {/* Recommended */}
          {cart.length > 0 && recommended.length > 0 && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="text-[13px] font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c9a227]" /> You might also like
              </h4>
              <div className="space-y-2">
                {recommended.map(rec => (
                  <div key={rec.id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/30">
                    <img src={rec.image || rec.thumb} alt={rec.name} className="w-10 h-10 rounded object-contain" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-zinc-900 dark:text-white truncate">{rec.name}</div>
                      <div className="text-[12px] font-semibold text-zinc-600 dark:text-zinc-400">${rec.price.toFixed(2)}</div>
                      {rec.stock <= 3 && <div className="animate-badge-pulse text-[10px] text-[#dc2626] font-medium">Only {rec.stock} left</div>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(rec, 1); }} disabled={rec.stock === 0}
                      className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-gradient-to-r from-[#dc2626] to-[#c9a227] text-white hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all">+ Add</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Checkout footer */}
        {cart.length > 0 && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total</span>
              <span className="text-lg font-display font-bold text-zinc-900 dark:text-white">${total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} disabled={loading} className="w-full btn-primary py-3 text-[15px]">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Checkout"}
            </button>
            <p className="text-[11px] text-center text-zinc-400">Card • PayPal • Shipping calculated at checkout</p>
          </div>
        )}
      </div>
    </div>
  );
}
