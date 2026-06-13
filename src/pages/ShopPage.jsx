import React,{useState,useMemo}from"react";
import{Search}from"lucide-react";
import{useApp}from"../context/AppContext";
import{SETS,RARITIES,CONDITIONS}from"../data/mockCards";
import CardGrid from"../components/CardGrid";
export default function ShopPage(){
const{cards}=useApp();
const[q,setQ]=useState("");const[set,setSet]=useState("");const[rar,setRar]=useState("");const[cond,setCond]=useState("");
const filtered=useMemo(()=>cards.filter(c=>{
if(q&&!c.name.toLowerCase().includes(q.toLowerCase()))return false;
if(set&&c.set!==set)return false;if(rar&&c.rarity!==rar)return false;if(cond&&c.condition!==cond)return false;return c.status==="active";
}),[cards,q,set,rar,cond]);
return(<div className="min-h-screen bg-[#fcfbf8] dark:bg-zinc-950"><section className="py-12 px-4 max-w-7xl mx-auto">
<h1 className="text-3xl font-display font-bold mb-2 text-zinc-900 dark:text-white">Shop Cards</h1>
<p className="text-zinc-500 dark:text-zinc-400 mb-8">Browse our <span className="text-brand-500 dark:text-brand-400">{filtered.length}</span> verified cards</p>
<div className="flex flex-wrap gap-3 mb-8">
<div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400"/><input className="w-full h-10 pl-10 pr-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" placeholder="Search cards..." value={q} onChange={e=>setQ(e.target.value)}/></div>
<select className="h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 w-auto min-w-[150px]" value={set} onChange={e=>setSet(e.target.value)}><option value="">All Sets</option>{SETS.map(s=><option key={s}>{s}</option>)}</select>
<select className="h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 w-auto min-w-[140px]" value={rar} onChange={e=>setRar(e.target.value)}><option value="">All Rarities</option>{RARITIES.map(r=><option key={r}>{r}</option>)}</select>
<select className="h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 w-auto min-w-[140px]" value={cond} onChange={e=>setCond(e.target.value)}><option value="">All Conditions</option>{CONDITIONS.map(c=><option key={c}>{c}</option>)}</select>
</div>
<CardGrid cards={filtered}/>
{filtered.length===0&&<p className="text-center text-zinc-500 dark:text-zinc-400 py-20">No cards match your filters.</p>}
</section></div>);}
