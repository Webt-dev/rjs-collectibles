import React from"react";
import{CheckCircle,AlertCircle,Info}from"lucide-react";
import{useApp}from"../context/AppContext";
const icons={success:CheckCircle,error:AlertCircle,info:Info};
const colors={success:"border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50",error:"border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50",info:"border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50"};
const iconCls={success:"text-emerald-600 dark:text-emerald-400",error:"text-red-600 dark:text-red-400",info:"text-amber-600 dark:text-amber-400"};
export default function Toast(){const{toasts}=useApp();
return(<div className="fixed bottom-4 right-4 z-50 space-y-2">{toasts.map(t=>{const Ic=icons[t.type]||Info;
return<div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl animate-slide-right shadow-lg ${colors[t.type]||colors.info}`}><Ic className={`w-4 h-4 ${iconCls[t.type]||iconCls.info}`}/><span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{t.message}</span></div>;
})}</div>);}
