import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Settings, Menu, X, Sun, Moon } from "lucide-react";
import { useApp } from "../context/AppContext";

function Logo() {
  return (
    <div className="relative w-8 h-6 sm:w-9 sm:h-7">
      <svg width="32" height="26" viewBox="0 0 36 28" className="overflow-visible sm:w-9 sm:h-7">
        <defs>
          <style>{`
            @keyframes shuffle-left {
              0%, 100% { transform: rotate(-15deg) translateX(0); }
              25% { transform: rotate(-22deg) translateX(-2px) translateY(-1px); }
              50% { transform: rotate(-8deg) translateX(1px); }
              75% { transform: rotate(-18deg) translateX(-1px); }
            }
            @keyframes shuffle-center {
              0%, 100% { transform: translateY(0); }
              33% { transform: translateY(-1.5px); }
              66% { transform: translateY(0.5px); }
            }
            @keyframes shuffle-right {
              0%, 100% { transform: rotate(15deg) translateX(0); }
              25% { transform: rotate(8deg) translateX(-1px); }
              50% { transform: rotate(22deg) translateX(2px) translateY(-1px); }
              75% { transform: rotate(18deg) translateX(1px); }
            }
          .card-left { animation: shuffle-left 3s ease-in-out infinite; transform-origin: 11px 12px; }
          .card-center { animation: shuffle-center 3s ease-in-out infinite; transform-origin: center; }
          .card-right { animation: shuffle-right 3s ease-in-out infinite; transform-origin: 25px 12px; }
          .logo-group:hover .card-left,
          .logo-group:hover .card-center,
          .logo-group:hover .card-right { animation-duration: 0.8s; }
          `}</style>
        </defs>
        <g className="logo-group">
          <rect x="4" y="2" width="14" height="20" rx="3" fill="#dc2626" opacity="0.5" className="card-left" />
          <rect x="11" y="2" width="14" height="20" rx="3" fill="#dc2626" opacity="0.9" className="card-center" />
          <rect x="18" y="2" width="14" height="20" rx="3" fill="#dc2626" opacity="0.5" className="card-right" />
        </g>
      </svg>
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
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : [])
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
          <Logo />
          <div className="flex items-baseline gap-1 sm:gap-1.5 min-w-0">
            <span className="font-display font-bold text-[16px] sm:text-[18px] tracking-tight text-zinc-900 dark:text-white truncate">RJS</span>
            <span className="text-[#dc2626] text-[11px] sm:text-[13px] font-medium hidden xs:inline sm:inline">Collectibles</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = loc.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-3.5 py-2 text-[14px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group"
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-[2px] bg-[#dc2626] origin-center transition-all duration-200 ease-out
                    ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center hover:border-amber-400 transition-all"
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
          </button>

          <button
            onClick={toggleAdmin}
            className={`hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-[12px] font-medium transition-all items-center ${
              isAdmin ? "bg-[#dc2626] text-white" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">{isAdmin ? "Admin" : "User"}</span>
          </button>

          <button onClick={toggleCart} className="relative p-1.5 sm:p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
            <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-zinc-600 dark:text-zinc-400" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#dc2626] text-white text-[9px] sm:text-[10px] font-bold min-w-[16px] sm:min-w-[18px] h-4 sm:h-[18px] rounded-full flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </button>

          <button onClick={toggleMobileMenu} className="md:hidden p-1.5 sm:p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
