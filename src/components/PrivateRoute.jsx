import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * SAYT UCHUN PRIVATE ROUTER
 * Foydalanuvchi Google/Firebase orqali kirmagan bo'lsa,
 * sayt login sahifasiga ( /sayt/kirish ) yo'naltiradi.
 */
export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { isSiteAuthenticated, siteUser } = useApp();
  const location = useLocation();

  // Firebase auth holati tekshirilayotganda (referesh paytida)
  // Foydalanuvchi ro'yxatdan o'tgan bo'lsa ham qisqa yuklanish ko'rsatiladi

  // 1-BOSQICH: Saytga kirilmagan bo'lsa -> login sahifasiga
  if (!isSiteAuthenticated) {
    return (
      <Navigate 
        to="/sayt/kirish" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // 2-BOSQICH: Ruxsat darajasini tekshirish (ixtiyoriy)
  const userRole = siteUser?.role || 'user';
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-slate-950 text-center px-4 font-sans select-none relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-md w-full p-8 rounded-3xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl shadow-2xl relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-6 border border-rose-500/20 shadow-lg shadow-rose-500/5">
            <ShieldCheck className="h-6 w-6 animate-bounce" />
          </div>

          <h1 className="text-base font-black text-white mb-2 tracking-widest uppercase font-mono">
            ACCESS_DENIED // RUXSAT YO'Q
          </h1>

          <p className="text-xs text-slate-400 leading-relaxed mb-6 font-light">
            Ushbu sahifaga kirish uchun sizga yetarli ruxsat berilmagan.
          </p>

          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition duration-200"
          >
            Ortga qaytish
          </button>
        </div>
      </div>
    );
  }

  return children;
}