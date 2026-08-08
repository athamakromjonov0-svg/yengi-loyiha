import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateRoute from './components/PrivateRoute';

// Pages
import MainWebsite from './pages/MainWebsite';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import SiteLoginPage from './pages/SiteLoginPage';
import UserProfilePage from './pages/UserProfilePage';
import SearchResults from './pages/SearchResults';
import CategoryPage from './pages/CategoryPage';
import WishlistPage from './pages/WishlistPage';
import DiscountsPage from './pages/DiscountsPage';
import CheckoutPage from './pages/CheckoutPage';
import ComparePage from './pages/ComparePage';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col select-none">
      {/* Saytning yuqori qismi */}
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* ASOSIY SAHIFA */}
          <Route path="/" element={<MainWebsite />} />

          {/* ADMIN LOGIN SAHIFASI (Admin Dashboard uchun) */}
          <Route path="/login" element={<LoginPage />} />

          {/* SAYT LOGIN SAHIFASI (Google/Firebase bilan) */}
          <Route path="/sayt/kirish" element={<SiteLoginPage />} />

          {/* SAYT PROFIL SAHIFASI (Private - faqat tizimga kirganlar uchun) */}
          <Route 
            path="/sayt/profil" 
            element={
              <PrivateRoute>
                <UserProfilePage />
              </PrivateRoute>
            } 
          />

          {/* MAHSULOT BATAFSIL SAHIFASI */}
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* QIDIRUV NATIJALARI SAHIFASI */}
          <Route path="/qidiruv" element={<SearchResults />} />

          {/* KATEGORIYA SAHIFASI */}
          <Route path="/kategoriya/:slug" element={<CategoryPage />} />

          {/* SEVIMLILAR SAHIFASI */}
          <Route path="/sevimlilar" element={<WishlistPage />} />

          {/* CHEGIRMALAR SAHIFASI */}
          <Route path="/chegirmalar" element={<DiscountsPage />} />

          {/* SAVAT SAHIFASI */}
          <Route path="/savat" element={<CartPage />} />

          {/* BUYURTMA RASMIYLASHTIRISH SAHIFASI */}
          <Route path="/buyurtma" element={<CheckoutPage />} />

          {/* SOLISHTIRISH SAHIFASI */}
          <Route path="/solishtirish" element={<ComparePage />} />

          {/* ADMIN PANELI (Yopiq Route) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* XATO SAHIFA (404) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* Saytning quyi qismi */}
      <Footer />
      
      {/* Global bildirishnomalar */}
      <Toast />
    </div>
  );
}

export default App;