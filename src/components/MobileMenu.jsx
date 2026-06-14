import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Home, ShoppingBag, Shield, ChevronRight, Settings } from "lucide-react";

export default function MobileMenu() {
  const { toggleMobileMenu, isAdmin, toggleAdmin, cards } = useApp();
  const active = cards.filter(c => c.status === "active").length;
  const items = [
    { to: "/", label: "Home", desc: "Back to start", icon: Home },
    { to: "/shop", label: "Shop", desc: `${active} cards available`, icon: ShoppingBag, hl: true },
   ...(isAdmin? [{ to: "/admin", label: "Admin", desc: "Manage inventory", icon: Shield }] : [])
  ];

  return (
    <div className="fixed inset-0 z-40 w-full bg-[#fcfbf8]/95 dark:bg-[#050507]/95 backdrop-blur-xl flex flex-col px-4 pt-6 pb-6 overflow-y-auto overflow-x-hidden">
      <div className="flex items-center justify-center mb-5">
        <img src="/images/icon.png" alt="RJS" className="h-10 w-auto" />
      </div>
      <div className="space-y-2.5 w-full">
        {items.map((it,i)=> {
          const Ic = it.icon;
          return (
            <Link key={i} to={it.to} onClick={toggleMobileMenu} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm w-full overflow-hidden">
              <Ic className="w-5 h-5 text-zinc-500 dark:text-zinc-400 shrink-0"/>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[15px] truncate text-zinc-900 dark:text-white">{it.label}{it.hl && <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-red-50 text-red-600 rounded-full">Live</span>}</div>
                <div className="text-xs text-zinc-500 truncate">{it.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0"/>
            </Link>
          )
        })}
      </div>

      <button onClick={toggleAdmin} className="mt-3 w-full flex items-center p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <Settings className="w-5 h-5 text-zinc-500 shrink-0"/>
        <div className="flex-1 min-w-0 text-left ml-3">
          <div className="font-medium text-[14px] truncate">{isAdmin? 'Admin Mode' : 'Switch to Admin'}</div>
          <div className="text-[11px] text-zinc-500 truncate">Manage inventory & pricing</div>
        </div>
        <div className={`ml-2 shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium ${isAdmin? 'bg-red-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600'}`}>
          {isAdmin? 'ON' : 'OFF'}
        </div>
      </button>
    </div>
  );
}
