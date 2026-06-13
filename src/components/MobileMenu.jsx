import React from"react";
import{Link}from"react-router-dom";
import{useApp}from"../context/AppContext";
import{X,Home,ShoppingBag,Shield,ChevronRight,Sparkles}from"lucide-react";
export default function MobileMenu(){
const{toggleMobileMenu,isAdmin,cards}=useApp();
const active=cards.filter(c=>c.status==="active").length;
const items=[{to:"/",label:"Home",desc:"Back to start",icon:Home},{to:"/shop",label:"Shop",desc:`${active} cards available`,icon:ShoppingBag,hl:true},...(isAdmin?[{to:"/admin",label:"Admin",desc:"Manage inventory",icon:Shield}]:[])];
return(<div className="fixed inset-0 z-40 bg-[#fcfbf8]/95 dark:bg-[#050507]/95 backdrop-blur-xl flex flex-col p-6 pt-6">
<div className="flex items-center justify-center mb-6">
  <img src="/images/icon.png" alt="RJS Collectibles" className="h-10 w-auto" />
</div>
<div className="space-y-3">
{items.map((it,i)=>{const Ic=it.icon;return(
<Link key={i} to={it.to} onClick={toggleMobileMenu} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-md transition-shadow">
<Ic className="w-5 h-5 text-zinc-500 dark:text-zinc-400"/>
<div className="flex-1"><div className="font-display font-semibold text-zinc-900 dark:text-white">{it.label}{it.hl&&<span className="ml-2 text-[10px] px-1.5 py-0.5 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-full font-medium">Live</span>}</div>
<div className="text-xs text-zinc-500 dark:text-zinc-400">{it.desc}</div></div>
<ChevronRight className="w-4 h-4 text-zinc-400"/>
</Link>);})}
</div>
<div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
<h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-3">Quick Stats</h4>
<div className="grid grid-cols-3 gap-3">
{[{l:"In Stock",v:active},{l:"Verified",v:"100%"},{l:"Graded",v:cards.filter(c=>c.grading).length}].map((s,i)=>(
<div key={i} className="text-center"><div className="text-lg font-display font-bold text-zinc-900 dark:text-white">{s.v}</div><div className="text-[10px] text-zinc-500 dark:text-zinc-400">{s.l}</div></div>
))}
</div>
</div>
</div>);}
