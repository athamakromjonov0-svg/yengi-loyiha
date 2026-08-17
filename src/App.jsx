import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateRoute from './components/PrivateRoute';
import SiteSidebar from './components/SiteSidebar';

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
import CatalogPage from './pages/CatalogPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import OrdersPage from './pages/OrdersPage';
import LoyaltyPage from './pages/LoyaltyPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import DeliveryPage from './pages/DeliveryPage';
import PaymentPage from './pages/PaymentPage';
import ReturnsPage from './pages/ReturnsPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import LegalPage from './pages/LegalPage';

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin va login sahifalarida o'ng sidebar yashiriladi (o'z layoutlari bor)
  const hideShell = location.pathname === '/login'
    || location.pathname === '/sayt/kirish'
    || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col select-none">
      {/* Saytning yuqori qismi — o'ng sidebar uchun joy ajratiladi */}
      <div className={`flex flex-col flex-1 ${hideShell ? '' : 'xl:pr-64'}`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

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

          {/* KATALOG — BARCHA MAHSULOTLAR */}
          <Route path="/katalog" element={<CatalogPage />} />

          {/* YANGI KELGANLAR */}
          <Route path="/yangi-kelganlar" element={<NewArrivalsPage />} />

          {/* BUYURTMALARIM */}
          <Route path="/buyurtmalarim" element={<OrdersPage />} />

          {/* BONUS DASTURI */}
          <Route path="/bonus-dasturi" element={<LoyaltyPage />} />

          {/* ALOQA */}
          <Route path="/aloqa" element={<ContactPage />} />

          {/* FAQ */}
          <Route path="/faq" element={<FaqPage />} />

          {/* YETKAZIB BERISH */}
          <Route path="/yetkazib-berish" element={<DeliveryPage />} />

          {/* TO'LOV USULLARI */}
          <Route path="/tolov-usullari" element={<PaymentPage />} />

          {/* QAYTARISH */}
          <Route path="/qaytarish" element={<ReturnsPage />} />

          {/* BLOG */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />

          {/* HUQUQIY SAHIFALAR */}
          <Route path="/maxfiylik" element={<LegalPage />} />
          <Route path="/shartlar" element={<LegalPage />} />
          <Route path="/ommaviy-oferta" element={<LegalPage />} />

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
      </div>

      {/* O'NG TOMON SIDEBAR — barcha sahifalar */}
      {!hideShell && (
        <SiteSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      
      {/* Global bildirishnomalar */}
      <Toast />
    </div>
  );
}

export default App;