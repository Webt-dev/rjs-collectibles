import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Settings, Menu, X, Sun, Moon } from "lucide-react";
import { useApp } from "../context/AppContext";
import logo from "../assets/rjs-logo.png";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={logo}
        alt="RJS"
        className="h-20 w-auto sm:h-21 md:h-21 object-contain" // <-- was h-7/h-8
      />
      <span className="font-semibold text-zinc-600 dark:text-zinc-300">Collectibles</span>
    </div>
  );
}

export default function Header() {
  const { cart, isAdmin, toggleAdmin, toggleCart, toggleMobileMenu, mobileMenuOpen, theme, toggleTheme } = useApp();
  const loc = useLocation();
  const count = cart.reduce((a, i) => a + (i.qty || 1), 0);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
  ...(isAdmin? [{ to: "/admin", label: "Admin" }] : [])
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-black/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-900">
      {/* taller header: h-16 instead of h-14 */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center min-w-0 shrink">
          <Logo />
        </Link>

        {/* rest of your nav/buttons — unchanged */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = loc.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className="relative px-3.5 py-2 text-[14px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group">
                {item.label}
                <span className={`absolute bottom-0 left-3 right-3 h-[2px] bg-[#dc2626] origin-center transition-all duration-200 ease-out ${isActive? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={toggleTheme} className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors" title={theme === "light"? "Dark mode" : "Light mode"}>
            {theme === "light"? <Moon className="w-3.5 h-3.5 text-zinc-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
          </button>
          <button onClick={toggleAdmin} className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all ${isAdmin? "bg-[#dc2626] text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}>
            <Settings className="w-3 h-3" />
            <span>{isAdmin? "Admin" : "User"}</span>
          </button>
          <button onClick={toggleCart} className="relative w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
            <ShoppingCart className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            {count > 0 && (<span className="absolute -top-1 -right-1 bg-[#dc2626] text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">{count}</span>)}
          </button>
          <button onClick={toggleMobileMenu} className="md:hidden w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
            {mobileMenuOpen? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
