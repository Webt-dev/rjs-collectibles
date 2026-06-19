import React, { useRef, useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Sun, Moon, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import logo from "../assets/rjs-logo.png";

const ANNOUNCEMENTS = [
  "FREE SHIPPING ON ORDERS OVER $250",
  "NEW ARRIVALS EVERY WEEK",
  "AUTHENTICITY GUARANTEED",
];

export default function Header() {
  const { cart, toggleCart, theme, toggleTheme, toggleMobileMenu, mobileMenuOpen, cards } = useApp();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const count = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
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

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return (cards || [])
      .filter(p => p.source === "shopify" && p.status === "active")
      .filter(p => p.name?.toLowerCase().includes(q) || (p.tags || []).some(t => String(t).toLowerCase().includes(q)))
      .slice(0, 8);
  }, [searchQuery, cards]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(true);
  };

  const selectSuggestion = (product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    setDesktopSearchOpen(false);
    setMobileSearchOpen(false);
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/sell", label: "Sell" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-[#fff1f2] via-[#fefce8] to-[#fff1f2] dark:from-[#1a0404] dark:via-[#2a0606] dark:to-[#1a0404] text-[#dc2626] dark:text-[#d4a82a] overflow-hidden border-b border-[#fca5a5]/30 dark:border-[#1a0404]">
        <div className="flex animate-marquee py-2 whitespace-nowrap font-display font-bold text-[11px] tracking-[0.18em] uppercase">
          {[...ANNOUNCEMENTS,...ANNOUNCEMENTS,...ANNOUNCEMENTS].map((text, i) => (
            <span key={i} className="mx-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] dark:bg-[#d4a82a]" />
              {text}
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <div className="flex items-center gap-1">
            <button onClick={toggleMobileMenu} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors" aria-label="Open menu">
              {mobileMenuOpen? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="RJS Collectibles" className="w-9 h-9 object-contain" />
              <span className="hidden sm:inline font-display font-black text-lg tracking-tight text-zinc-950 dark:text-white">
                RJS <span className="text-[#dc2626]">Collectibles</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link key={item.to} to={item.to} className={`relative px-3 py-2 rounded-xl text-sm font-display font-bold transition-colors ${active ? "text-[#dc2626]" : "text-zinc-700 dark:text-zinc-300 hover:text-[#dc2626] dark:hover:text-[#b8901f]"}`}>
                    {item.label}
                    {active && <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#dc2626] to-[#b8901f]" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            {/* Desktop search - click to open */}
            <div className="relative hidden lg:block">
              {!desktopSearchOpen ? (
                <button onClick={() => setDesktopSearchOpen(true)} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors" aria-label="Search">
                  <Search className="w-5 h-5" />
                </button>
              ) : (
                <div className="relative">
                  <form onSubmit={handleSearch}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400 pointer-events-none z-10" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => { setShowSuggestions(false); setDesktopSearchOpen(false); }, 200)}
                      placeholder="Search for Shopify products..."
                      autoFocus
                      className="w-64 xl:w-72 pl-9 pr-9 py-2 rounded-xl bg-white dark:bg-zinc-800 border-2 border-[#dc2626]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40 shadow-lg"
                    />
                    <button type="button" onClick={() => { setDesktopSearchOpen(false); setSearchQuery(""); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700">
                      <X className="w-3.5 h-3.5 text-zinc-500" />
                    </button>
                  </form>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Shopify Products</p>
                      </div>
                      {suggestions.map((product) => (
                        <button key={product.id} onClick={() => selectSuggestion(product)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left">
                          <img src={product.image || product.thumb} alt="" className="w-12 h-12 object-contain rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{product.name}</p>
                            <p className="text-xs text-zinc-500">{(product.tags || []).slice(0,2).join(" • ")}</p>
                          </div>
                          <p className="text-sm font-black text-[#dc2626]">${Number(product.price).toFixed(2)}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile search button */}
            <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>

            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors" aria-label="Toggle theme">
              {theme === "light"? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button onClick={toggleCart} className={`relative p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors ${cartBounce? "animate-cart-bounce" : ""}`} aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center text-[10px] font-black rounded-full bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white shadow-md">{count}</span>}
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 px-4 py-3 bg-white dark:bg-zinc-950 animate-in slide-in-from-top-2">
            <div className="relative">
              <form onSubmit={handleSearch}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10" />
                <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} placeholder="Search for Shopify products..." autoFocus className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-[#dc2626]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40" />
                <button type="button" onClick={() => setMobileSearchOpen(false)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700">
                  <X className="w-4 h-4" />
                </button>
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                  {suggestions.map((product) => (
                    <button key={product.id} onClick={() => selectSuggestion(product)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left border-b last:border-0">
                      <img src={product.image || product.thumb} alt="" className="w-12 h-12 object-contain rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1" />
                      <div className="flex-1">
                        <p className="text-sm font-bold">{product.name}</p>
                        <p className="text-xs text-[#dc2626] font-black">${Number(product.price).toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
