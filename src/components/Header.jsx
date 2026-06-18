import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Sun, Moon } from "lucide-react";
import { useApp } from "../context/AppContext";
import logo from "../assets/rjs-logo.png";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src={logo} alt="RJS" className="h-8 w-auto" />
      <span className="font-display font-bold text-lg text-zinc-900 dark:text-white">
        Collectibles
      </span>
    </Link>
  );
}

export default function Header() {
  const { cart, isAdmin, toggleCart, toggleMobileMenu, mobileMenuOpen, theme, toggleTheme } = useApp();
  const loc = useLocation();
  const count = cart.reduce((a, i) => a + (i.qty || 1), 0);
  const prevCount = useRef(count);
  const [cartBounce, setCartBounce] = useState(false);

  useEffect(() => {
    if (count > prevCount.current) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(timer);
    }
    prevCount.current = count;
  }, [count]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
   ...(isAdmin? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <>
      {/* Sell banner on top */}
      <div className="sticky top-0 z-[60] w-full bg-gradient-to-r from-[#dc2626] to-[#c9a227] text-white">
        <div className="max-w-7xl mx-auto px-4 h-[28px] flex items-center justify-center">
          <Link to="/sell" className="text-[12px] font-medium tracking-wide hover:underline">
            Sell Your Collection – Get a fast quote →
          </Link>
        </div>
      </div>

      <header className="sticky top-[28px] z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleMobileMenu} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400" aria-label="Open categories">
              {mobileMenuOpen? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Logo />
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = loc.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 rounded-lg text-[14px] font-medium transition-colors duration-200 ${
                    isActive
                     ? "text-[#dc2626] bg-red-50 dark:bg-red-950/30"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/sell"
              className={`px-3 py-1.5 rounded-lg text-[14px] font-medium ${
                loc.pathname === '/sell'
                 ? "text-[#dc2626] bg-red-50 dark:bg-red-950/30"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-[#dc2626]"
              }`}
            >
              Sell
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
              {theme === "light"? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            {/* ADMIN BUTTON REMOVED */}
            <button onClick={toggleCart} className={`relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 ${cartBounce? "animate-cart-bounce" : ""}`}>
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-[#dc2626] text-white text-[11px] font-bold">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
