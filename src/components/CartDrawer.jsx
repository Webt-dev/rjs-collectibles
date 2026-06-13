import React from"react";
import{X,Minus,Plus,Trash2,ShoppingCart}from"lucide-react";
import{useApp}from"../context/AppContext";
export default function CartDrawer(){
const{cart,toggleCart,removeFromCart,updateCartQty,clearCart,showToast}=useApp();
const total=cart.reduce((a,i)=>a+i.price*i.qty,0);
return(<div className="fixed inset-0 z-50 flex justify-end" onClick={toggleCart}>
<div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"/>
<div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 h-full flex flex-col animate-slide-right shadow-2xl" onClick={e=>e.stopPropagation()}>
<div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800"><h2 className="font-display font-bold text-lg flex items-center gap-2 text-zinc-900 dark:text-white"><ShoppingCart className="w-5 h-5"/>Cart ({cart.length})</h2><button onClick={toggleCart} className="btn-ghost p-1"><X className="w-5 h-5"/></button></div>
<div className="flex-1 overflow-y-auto p-4 space-y-3">
{cart.length===0&&<p className="text-center text-zinc-500 dark:text-zinc-400 py-10">Your cart is empty</p>}
{cart.map(item=><div key={item.id} className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 flex gap-3">
<div className="w-16 h-20 rounded-lg bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0"><img src={item.thumb||item.image} alt={item.name} className="w-full h-full object-cover"/></div>
<div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate text-zinc-900 dark:text-white">{item.name}</p><p className="text-xs text-zinc-500 dark:text-zinc-400">{item.set}</p><p className="price-tag text-sm mt-1">${(item.price*item.qty).toFixed(2)}</p>
<div className="flex items-center gap-2 mt-1">
<button onClick={()=>item.qty>1?updateCartQty(item.id,item.qty-1):removeFromCart(item.id)} className="p-1 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300"><Minus className="w-3 h-3"/></button>
<span className="text-xs font-mono w-6 text-center text-zinc-900 dark:text-white">{item.qty}</span>
<button onClick={()=>updateCartQty(item.id,item.qty+1)} className="p-1 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300"><Plus className="w-3 h-3"/></button>
<button onClick={()=>{removeFromCart(item.id);showToast("Removed","error");}} className="ml-auto text-zinc-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
</div></div></div>)}
</div>
{cart.length>0&&<div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
<div className="flex justify-between mb-4"><span className="text-zinc-500 dark:text-zinc-400">Total</span><span className="price-tag text-xl">${total.toFixed(2)}</span></div>
<button onClick={()=>{clearCart();toggleCart();showToast("Order placed! 🎉");}} className="btn-primary w-full">Checkout</button>
</div>}
</div></div>);}
