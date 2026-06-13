import React from"react";
import{Routes,Route}from"react-router-dom";
import Header from"./components/Header";
import Footer from"./components/Footer";
import Toast from"./components/Toast";
import CartDrawer from"./components/CartDrawer";
import CardDetailsModal from"./components/CardDetailsModal";
import MobileMenu from"./components/MobileMenu";
import HomePage from"./pages/HomePage";
import ShopPage from"./pages/ShopPage";
import AdminPage from"./pages/AdminPage";
import{useApp}from"./context/AppContext";
export default function App(){
  const{selectedCard,selectCard,showCartDrawer,mobileMenuOpen}=useApp();
  return(<div className="min-h-screen flex flex-col bg-surface-950">
    <Header/>
    {mobileMenuOpen&&<MobileMenu/>}
    <main className="flex-1"><Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/shop" element={<ShopPage/>}/>
      <Route path="/admin" element={<AdminPage/>}/>
    </Routes></main>
    <Footer/>
    {selectedCard&&<CardDetailsModal card={selectedCard} onClose={()=>selectCard(null)}/>}
    {showCartDrawer&&<CartDrawer/>}
    <Toast/>
  </div>);
}
