import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useApp } from "./context/AppContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import CartDrawer from "./components/CartDrawer";
import ProductDetailsModal from "./components/ProductDetailsModal";
import MobileMenu from "./components/MobileMenu";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivacyNotice from "./components/PrivacyNotice";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import SellCollection from "./pages/SellCollection";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";

export default function App() {
  const { selectedCard, selectCard, showCartDrawer, mobileMenuOpen } = useApp();

  // SINGLE source of truth for scroll lock
  useEffect(() => {
    const isLocked = mobileMenuOpen || showCartDrawer || !!selectedCard;
    if (isLocked) {
      const scrollY = window.scrollY;
      document.body.dataset.scrollY = String(scrollY);
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      const stored = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      delete document.body.dataset.scrollY;
      if (stored) window.scrollTo(0, stored);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenuOpen, showCartDrawer, selectedCard]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
        <Header />
        {mobileMenuOpen && <MobileMenu />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/sell" element={<SellCollection />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </main>
        <Footer />
        <Toast />
        {selectedCard && (
          <ProductDetailsModal
            product={selectedCard}
            onClose={() => selectCard(null)}
          />
        )}
        {showCartDrawer && <CartDrawer />}
        <PrivacyNotice />
      </div>
    </ErrorBoundary>
  );
}