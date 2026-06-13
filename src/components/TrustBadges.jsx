import React from"react";
import{ShieldCheck,DollarSign,Zap,BarChart3}from"lucide-react";
const badges=[{icon:ShieldCheck,title:"Hand-Verified",desc:"Every card inspected for condition accuracy"},{icon:DollarSign,title:"Human Pricing",desc:"Prices set by our team — fair, transparent, no bots."},{icon:Zap,title:"Fast Fulfillment",desc:"Quick processing and careful packaging"},{icon:BarChart3,title:"Market-Referenced",desc:"Prices from TCGPlayer, Cardmarket & eBay"}];
export default function TrustBadges(){return(<section className="py-16 px-4 max-w-7xl mx-auto">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
{badges.map((b,i)=>{const Icon=b.icon;return(
<div key={i} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_0_1px_rgba(220,38,38,0.05)] hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_0_1px_rgba(201,162,39,0.08)] transition-shadow">
<Icon className="w-8 h-8 mx-auto mb-3 text-brand-500 dark:text-brand-400"/>
<h4 className="font-display font-semibold mb-1 text-zinc-900 dark:text-white">{b.title}</h4>
<p className="text-sm text-zinc-500 dark:text-zinc-400">{b.desc}</p>
</div>);})}
</div>
</section>);}
