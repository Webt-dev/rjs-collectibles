import React,{useState,useEffect}from"react";
import{X,ShoppingCart}from"lucide-react";
import{useApp}from"../context/AppContext";
import{getPlaceholderImage}from"../data/mockCards";
import{getMarketData}from"../services/pokemonApi";
export default function CardDetailsModal({card,onClose}){
const{addToCart,showToast}=useApp();const[err,setErr]=useState(false);const[market,setMarket]=useState(null);
useEffect(()=>{getMarketData(card.id).then(setMarket);},[card.id]);
const bCls={"Ultra Rare":"bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800","Secret Rare":"bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800","Rare Holo":"bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"};
const cCls={"Mint":"bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800","Near Mint":"bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800","Light Play":"bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"};
return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose}>
<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 animate-fade-up shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(220,38,38,0.08)]" onClick={e=>e.stopPropagation()}>
<div className="flex justify-between items-start mb-4"><h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white">{card.name}</h2><button onClick={onClose} className="btn-ghost p-1"><X className="w-5 h-5"/></button></div>
<div className="grid md:grid-cols-2 gap-6">
<div className="aspect-[2.5/3.5] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800"><img src={err?getPlaceholderImage(card.name):card.image||card.thumb} alt={card.name} className="w-full h-full object-contain" onError={()=>setErr(true)}/></div>
<div>
<div className="flex flex-wrap gap-2 mb-4"><span className={`badge border ${bCls[card.rarity]||"bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"}`}>{card.rarity}</span><span className={`badge border ${cCls[card.condition]||"bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"}`}>{card.condition}</span></div>
<p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{card.set} &middot; {card.number}</p>
<p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Variant: {card.variant}</p>
<p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{card.description}</p>
<div className="price-tag text-3xl mb-4">${card.price.toFixed?card.price.toFixed(2):card.price}</div>
{market&&<div className="space-y-2 mb-6">
<p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase font-semibold mb-1">Market Prices</p>
<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30"><span className="text-tcgp-light text-xs font-semibold">TCGPlayer</span><span className="ml-auto text-sm font-mono text-zinc-700 dark:text-zinc-300">${market.tcgplayer}</span></div>
<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-800/30"><span className="text-cardmkt-light text-xs font-semibold">Cardmarket</span><span className="ml-auto text-sm font-mono text-zinc-700 dark:text-zinc-300">${market.cardmarket}</span></div>
<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30"><span className="text-ebay-light text-xs font-semibold">eBay Sold</span><span className="ml-auto text-sm font-mono text-zinc-700 dark:text-zinc-300">${market.ebaySold}</span></div>
</div>}
<p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Stock: <span className={card.stock<=2?"text-brand-500 dark:text-brand-400 font-semibold":"text-zinc-700 dark:text-zinc-300"}>{card.stock} available</span></p>
<button onClick={()=>{addToCart(card);showToast(`${card.name} added`);onClose();}} className="btn-primary w-full"><ShoppingCart className="w-4 h-4"/>Add to Cart</button>
</div></div></div></div>);}
