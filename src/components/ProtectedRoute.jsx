import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading: appLoading } = useApp();
  const [internalLoading, setInternalLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const verifySecurityToken = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
      } catch (error) {
        console.error("Kiber-xavfsizlik tekshiruvida kritik xatolik:", error);
      } finally {
        if (isMounted) setInternalLoading(false);
      }
    };

    if (!appLoading) {
      verifySecurityToken();
    }
    return () => { isMounted = false; };
  }, [appLoading]);

  // 1-BOSQICH: Yuklanish Holati (Neon Matrix uslubi)
  if (appLoading || internalLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 font-sans select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="relative flex flex-col items-center gap-5 z-10">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 shadow-2xl shadow-emerald-500/10">
            <ShoppingBag className="h-7 w-7 animate-pulse" />
            <Loader2 className="absolute -inset-2 h-20 w-20 text-emerald-500 animate-spin opacity-40" />
          </div>

          <div className="text-center">
            <h2 className="text-sm font-black tracking-widest text-white uppercase font-mono">
              GRAND<span className="text-amber-400 font-normal">DECOR</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 font-mono animate-pulse">
              SECURE_GATEWAY_CHECKING...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2-BOSQICH: Avtorizatsiyadan o'tmagan bo'lsa
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3-BOSQICH: Ruxsat darajasini tekshirish (Access Control)
  const userRole = user?.role || 'user';
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-slate-950 text-center px-4 font-sans select-none relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-550/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-md w-full p-8 rounded-3xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl shadow-2xl relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-6 border border-rose-500/20 shadow-lg shadow-rose-500/5">
            <ShieldAlert className="h-6 w-6 animate-bounce" />
          </div>

          <h1 className="text-base font-black text-white mb-2 tracking-widest uppercase font-mono">
            ACCESS_DENIED // RUXSAT YO'Q
          </h1>

          <p className="text-xs text-slate-400 leading-relaxed mb-6 font-light">
            Ushbu terminal segmentiga ruxsat darajangiz etarli emas. Sahifa faqat tasdiqlangan tizim operatorlari uchun ochiq.
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition duration-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Bosh sahifaga qaytish
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full inline-flex items-center justify-center rounded-xl bg-transparent px-5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-400 transition duration-150"
            >
              Ortga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}