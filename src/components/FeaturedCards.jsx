import React from"react";
import{useApp}from"../context/AppContext";
import{Sparkles}from"lucide-react";
import{Link}from"react-router-dom";
import CardItem from"./CardItem";
export default function FeaturedCards(){
const{cards}=useApp();const featured=cards.filter(c=>c.featured&&c.status==="active"&&c.stock>0);
if(featured.length===0)return null;
return(<section id="featured" className="py-16 px-4 section-glow-gold">
<div className="max-w-7xl mx-auto">
<div className="flex items-center justify-between mb-8">
<div><div className="inline-flex items-center gap-2 text-brand-500 dark:text-brand-400 text-sm font-semibold mb-1"><Sparkles className="w-4 h-4"/>Hand-picked</div>
<h2 className="text-3xl font-display font-bold text-zinc-900 dark:text-white">Featured This Week</h2>
<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Curated by our team</p></div>
<Link to="/shop" className="btn-secondary text-sm hidden sm:flex">View all &rarr;</Link>
</div>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
{featured.slice(0,10).map(c=><CardItem key={c.id} card={c}/>)}
</div>
</div>
</section>);}
