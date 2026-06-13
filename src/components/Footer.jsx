import React from"react";
import{Instagram,Youtube}from"lucide-react";
export default function Footer(){return(<footer className="border-t border-zinc-200 dark:border-zinc-800 py-10 px-4 bg-white dark:bg-zinc-950">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
<div className="flex items-center gap-2"><span className="font-display font-bold text-zinc-900 dark:text-white">RJS</span><span className="text-brand-500 dark:text-brand-400 text-sm">Collectibles</span></div>
<p className="text-xs text-zinc-500 dark:text-zinc-500">Market data from <span className="text-tcgp-light">TCGPlayer</span>, <span className="text-cardmkt-light">Cardmarket</span> & <span className="text-ebay-light">eBay</span></p>
<div className="flex items-center gap-3">
<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"><Instagram className="w-5 h-5"/></a>
<a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"><Youtube className="w-5 h-5"/></a>
</div>
</div>
<p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-6">&copy; 2026 RJS Collectibles. All rights reserved.</p>
</footer>);}
