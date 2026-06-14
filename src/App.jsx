import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import CartDrawer from "./components/CartDrawer";
import CardDetailsModal from "./components/CardDetailsModal";
import MobileMenu from "./components/MobileMenu";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import AdminPage from "./pages/AdminPage";
import { useApp } from "./context/AppContext";

export default function App() {
  const { selectedCard, selectCard, showCartDrawer, mobileMenuOpen } = useApp();

  // LOCK SCROLL WHEN MENU OR CART IS OPEN
  useEffect(() => {
    const isLocked = mobileMenuOpen || showCartDrawer;

    if (isLocked) {
      // save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
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
    <div className="min-h-screen flex flex-col w-full max-w-[100vw] overflow-x-hidden bg-[#fcfbf8] dark:bg-[#050507]">
      <Header />
      {mobileMenuOpen && <MobileMenu />}
      <main className="flex-1 w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
      {selectedCard && <CardDetailsModal card={selectedCard} onClose={() => selectCard(null)} />}
      {showCartDrawer && <CartDrawer />}
      <Toast />
    </div>
  );
}
