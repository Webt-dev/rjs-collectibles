import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import CartDrawer from "./components/CartDrawer";
import ProductDetailsModal from "./components/ProductDetailsModal";
import MobileMenu from "./components/MobileMenu";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import SellCollection from "./pages/SellCollection";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";


export default function App() {
  const { selectedCard, selectCard, showCartDrawer, mobileMenuOpen } = useApp();

  useEffect(() => {
    const isLocked = mobileMenuOpen || showCartDrawer;
    if (isLocked) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen, showCartDrawer]);

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-[#fcfbf8] dark:bg-[#0b1120] text-zinc-900 dark:text-white">
      <Header />
      {mobileMenuOpen && <MobileMenu />}
      <main className="flex-1 w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/sell" element={<SellCollection />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />

        </Routes>
      </main>
      <Footer />
      {selectedCard && <ProductDetailsModal product={selectedCard} onClose={() => selectCard(null)} />}
      {showCartDrawer && <CartDrawer />}
      <Toast />
    </div>
  );
}

// NOTE: useApp is imported from context - add this import if your linter complains
import { useApp } from "./context/AppContext";
