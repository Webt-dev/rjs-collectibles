import React from"react";
export default function StatsCard({icon:Icon,label,value,alert}){return(<div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_0_1px_rgba(220,38,38,0.05)]">
<Icon className={`w-5 h-5 mb-2 ${alert?"text-brand-500 dark:text-brand-400":"text-zinc-400 dark:text-zinc-500"}`}/>
<p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
<p className={`text-2xl font-display font-bold ${alert?"text-brand-500 dark:text-brand-400":"text-zinc-900 dark:text-white"}`}>{value}</p>
</div>);}
