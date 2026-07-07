import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Sun, Moon, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import logo from "../assets/rjs-logo.png";

const ANNOUNCEMENTS = [
  "FREE SHIPPING ON ORDERS OVER $250",
  "NEW ARRIVALS EVERY WEEK",
  "AUTHENTICITY GUARANTEED",
];

export default function Header() {
  const {
    cart,
    toggleCart,
    theme,
    toggleTheme,
    toggleMobileMenu,
    mobileMenuOpen,
    cards,
    selectCard,
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const count = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
  const prevCount = useRef(count);
  const [cartBounce, setCartBounce] = useState(false);

  // hide on scroll down / show on scroll up
  const [isVisible, setIsVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (count > prevCount.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 400);
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const diff = y - lastY.current;
      if (Math.abs(diff) < 5) {
        ticking.current = false;
        return;
      }
      if (y < 10) setIsVisible(true);
      else if (diff > 0) setIsVisible(false);
      else setIsVisible(true);
      lastY.current = y;
      ticking.current = false;
    };
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return (cards || [])
      .filter((p) => p.source === "shopify" && p.status === "active")
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => String(t).toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [searchQuery, cards]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setDesktopSearchOpen(false);
      setMobileSearchOpen(false);
    }
  };

  const selectSuggestion = (p) => {
    setSearchQuery("");
    setShowSuggestions(false);
    setDesktopSearchOpen(false);
    setMobileSearchOpen(false);
    selectCard(p);
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
      {/* Everything slides together */}
      <div
        className={`fixed top-0 inset-x-0 z-40 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Announcement */}
        <div className="bg-gradient-to-r from-[#fff1f2] via-[#fefce8] to-[#fff1f2] dark:from-[#1a0404] dark:via-[#2a0606] dark:to-[#1a0404] text-[#dc2626] dark:text-[#d4a82a] overflow-hidden border-b border-[#fca5a5]/30 dark:border-[#1a0404]">
          <div className="flex animate-marquee py-2 whitespace-nowrap font-display font-bold text-[11px] tracking-[0.18em] uppercase">
            {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((t, i) => (
              <span key={i} className="mx-8 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] dark:bg-[#d4a82a]" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Header */}
        <header className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] grid grid-cols-[auto_1fr_auto] items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
              <Link
                to="/"
                aria-label="RJS Collectibles home"
                className="flex items-center gap-2"
              >
                <img
                  src={logo}
                  alt="RJS Collectibles"
                  className="w-9 h-9 object-contain"
                />
                <span className="hidden sm:inline font-display font-black text-lg tracking-tight text-zinc-950 dark:text-white">
                  RJS <span className="text-[#dc2626]">Collectibles</span>
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <nav aria-label="Main" className="flex items-center gap-1">
                {navItems.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      aria-current={active ? "page" : undefined}
                      className={`relative px-3 py-2 rounded-xl text-sm font-display font-bold ${
                        active
                          ? "text-[#dc2626]"
                          : "text-zinc-700 dark:text-zinc-300 hover:text-[#dc2626]"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#dc2626] to-[#b8901f]" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-1.5 justify-end">
              <div className="relative hidden lg:block">
                {!desktopSearchOpen ? (
                  <button
                    onClick={() => setDesktopSearchOpen(true)}
                    aria-label="Open search"
                    className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    <Search className="w-5 h-5" aria-hidden="true" />
                  </button>
                ) : (
                  <div className="relative">
                    <form onSubmit={handleSearch} role="search">
                      <label htmlFor="desktop-search" className="sr-only">
                        Search products
                      </label>
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="desktop-search"
                        value={searchQuery}
                        maxLength={120}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => {
                          // Close after suggestion click has time to fire
                          setTimeout(() => {
                            setShowSuggestions(false);
                            setDesktopSearchOpen(false);
                          }, 150);
                        }}
                        placeholder="Search for Shopify products..."
                        autoFocus
                        autoComplete="off"
                        aria-autocomplete="list"
                        aria-controls="desktop-suggestions"
                        className="w-64 xl:w-72 pl-9 pr-9 py-2 rounded-xl bg-white dark:bg-zinc-800 border-2 border-[#dc2626]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40"
                      />
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setDesktopSearchOpen(false);
                          setSearchQuery("");
                        }}
                        aria-label="Close search"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-100"
                      >
                        <X className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
                      </button>
                    </form>
                    {showSuggestions && suggestions.length > 0 && (
                      <div
                        id="desktop-suggestions"
                        role="listbox"
                        className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        {suggestions.map((p) => (
                          <button
                            key={p.id}
                            role="option"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(p);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left"
                          >
                            <img
                              src={p.image || p.thumb}
                              alt={p.name}
                              className="w-12 h-12 object-contain rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate text-zinc-900 dark:text-white">
                                {p.name}
                              </p>
                              <p className="text-xs text-zinc-500 truncate">
                                {(p.tags || []).slice(0, 2).join(" • ")}
                              </p>
                            </div>
                            <p className="text-sm font-black text-[#dc2626]">
                              ${Number(p.price).toFixed(2)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Toggle search"
                aria-expanded={mobileSearchOpen}
                className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                onClick={toggleTheme}
                aria-label={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Sun className="w-4 h-4" aria-hidden="true" />
                )}
              </button>

              <button
                onClick={toggleCart}
                aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
                className={`relative p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 ${
                  cartBounce ? "animate-cart-bounce" : ""
                }`}
              >
                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                {count > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center text-[10px] font-black rounded-full bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white"
                  >
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          {mobileSearchOpen && (
            <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3">
              <form onSubmit={handleSearch} role="search" className="relative">
                <label htmlFor="mobile-search" className="sr-only">
                  Search products
                </label>
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                  aria-hidden="true"
                />
                <input
                  id="mobile-search"
                  value={searchQuery}
                  maxLength={120}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Search products..."
                  autoComplete="off"
                  aria-autocomplete="list"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40"
                />
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <div
                  role="listbox"
                  className="mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
                >
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      role="option"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectSuggestion(p);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left"
                    >
                      <img
                        src={p.image || p.thumb}
                        alt={p.name}
                        className="w-10 h-10 object-contain rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-zinc-900 dark:text-white">
                          {p.name}
                        </p>
                      </div>
                      <p className="text-sm font-black text-[#dc2626]">
                        ${Number(p.price).toFixed(2)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </header>
      </div>

      {/* spacer so content doesn't jump */}
      <div className="h-[104px] sm:h-[108px]" />
    </>
  );
}