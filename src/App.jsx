
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import MainWebsite from './pages/MainWebsite';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col select-none">
      {/* Saytning yuqori qismi */}
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* ASOSIY SAHIFA */}
          <Route path="/" element={<MainWebsite />} />

          {/* LOGIN SAHIFASI */}
          <Route path="/login" element={<LoginPage />} />

          {/* MAHSULOT BATAFSIL SAHIFASI */}
          <Route path="/product/:id" element={<ProductDetail />} />

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