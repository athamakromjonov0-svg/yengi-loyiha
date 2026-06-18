import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Star, 
  Users, 
  Flame, 
  Award, 
  ShoppingCart, 
  TrendingUp, 
  Layers, 
  Package 
} from 'lucide-react';

/**
 * Premium Kiber-Futuristik HeroBanner Komponenti
 * Saytning birinchi ekranida foydalanuvchini jalb qiluvchi marketing markazi.
 */
export default function HeroBanner() {
  // Jonli xaridorlar va buyurtmalar holati (Social Proof uchun)
  const [activeUsers, setActiveUsers] = useState(142);
  const [todayOrders, setTodayOrders] = useState(89);
  
  // Eksklyuziv taklif uchun jonli hisoblagich (Taymer)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 24, seconds: 45 });

  // Jonli ma'lumotlar simulyatsiyasi (Efektlar)
  useEffect(() => {
    const userInterval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);

    const orderInterval = setInterval(() => {
      setTodayOrders(prev => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 7000);

    return () => {
      clearInterval(userInterval);
      clearInterval(orderInterval);
    };
  }, []);

  // Flash-sale taymer hisoblagichi
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Katalog bo'limiga silliq o'tish
  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('mahsulotlar');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 800, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 rounded-3xl mx-4 my-8 sm:mx-8 shadow-2xl border border-slate-900/80 font-sans select-none">
      
      {/* 1-QISM: CHUQQUR FON EFFEKTLARI (Kiber-Grafika) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 -mt-20 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[130px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 -mb-20 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] bg-gradient-to-r from-emerald-500/5 to-violet-500/5 blur-[100px]" />
        
        {/* Yuqori texnologiyali kiber-to'r paneli (Tech Grid Pattern) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] opacity-20" />
      </div>

      {/* 2-QISM: ASOSIY MARKAZIY MA'LUMOTLAR */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8 lg:py-36 flex flex-col items-center text-center">
        
        {/* Yuqori Neon Bildirishnoma Vidjeti */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
          <span>Yangi Premium Avlod Ekotizimi v5.0 Jonli Tizimda</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
        </div>

        {/* Katta va Shaffof Futuristik Sarlavha */}
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl md:text-7xl max-w-5xl mx-auto leading-[1.1] mb-8">
          Kelajak Texnologiyasi Endi <br />
          <span className="bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            O\`zbekistonda Premium
          </span> formatda
        </h1>

        {/* Sarlavha osti marketing tavsifi */}
        <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-slate-400 max-w-3xl mx-auto mb-10 font-normal">
          Mikro-muhandislik asosida yaratilgan eksklyuziv gadjetlar, aqlli elektronika komponentlari va noodatiy kiber-aksessuarlar platformasi. Haqiqiy natija egalari uchun mo\`ljallangan oliy darajadagi muhandislik namunalari.
        </p>

        {/* Tezkor marketing hisoblagichi (Flash Offer Widget) */}
        <div className="flex flex-wrap items-center justify-center gap-4 border border-slate-900 bg-slate-950/60 backdrop-blur-md rounded-2xl p-4 mb-12 max-w-xl w-full">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <TrendingUp className="h-4 w-4 animate-bounce" /> Eksklyuziv Partiya:
          </div>
          <div className="flex items-center gap-1.5 text-sm font-mono text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-500 font-sans text-[10px] uppercase mr-1">Vaqt:</span>
            <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
            <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Package className="h-3.5 w-3.5 text-emerald-400" />
            <span>Omborda faqat <strong className="text-slate-200">14 dona</strong> qoldi</span>
          </div>
        </div>

        {/* Interaktiv Harakat Tugmalari */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12 relative z-20">
          <button 
            onClick={handleScrollToProducts}
            className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-emerald-400 px-8 py-4 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/10 hover:bg-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>KATALOGGA O\`TISH</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          
          <a 
            href="#kafolat"
            className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm px-8 py-4 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>SIFAT KAFOLATI ATTESTACIYASI</span>
          </a>
        </div>

        {/* JONLI STATISTIKA INTEGRACIYASI (Social Proof) */}
        <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-900/20 border border-slate-900/60 px-6 py-2.5 rounded-full text-xs text-slate-400 mb-16 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 border-r border-slate-900 pr-4 last:border-0">
            <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
            <span>Aktiv xaridorlar: <strong className="text-white font-mono font-bold">{activeUsers}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-blue-400" />
            <span>Bugungi muvaffaqiyatli yetkazishlar: <strong className="text-white font-mono font-bold">{todayOrders}</strong></span>
          </div>
        </div>

        {/* 3-QISM: JONLI GLOW-METRIKALAR VIDJETI */}
        <div className="w-full border-t border-slate-900/60 pt-12">
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 items-center justify-center text-center">
            
            {/* Metrika 1 */}
            <div className="px-4 border-r border-slate-900/60 last:border-0">
              <div className="flex items-center justify-center text-emerald-400 mb-2.5 mx-auto bg-emerald-500/5 h-10 w-10 rounded-xl border border-emerald-500/10">
                <Zap className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black tracking-tight text-white sm:text-3xl font-mono">100%</p>
              <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest font-bold">Original Kafolat</p>
            </div>

            {/* Metrika 2 */}
            <div className="px-4 sm:border-r border-slate-900/60 last:border-0">
              <div className="flex items-center justify-center text-amber-400 mb-2.5 mx-auto bg-amber-500/5 h-10 w-10 rounded-xl border border-amber-500/10">
                <Star className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black tracking-tight text-white sm:text-3xl font-mono">4.9 / 5</p>
              <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest font-bold">Mijozlar Bahosi</p>
            </div>

            {/* Metrika 3 */}
            <div className="px-4 border-r border-slate-900/60 last:border-0">
              <div className="flex items-center justify-center text-indigo-400 mb-2.5 mx-auto bg-indigo-500/5 h-10 w-10 rounded-xl border border-indigo-500/10">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black tracking-tight text-white sm:text-3xl font-mono">14K+</p>
              <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest font-bold">Doimiy Mualliflar</p>
            </div>

            {/* Metrika 4 */}
            <div className="px-4 last:border-0">
              <div className="flex items-center justify-center text-blue-400 mb-2.5 mx-auto bg-blue-500/5 h-10 w-10 rounded-xl border border-blue-400/10">
                <Award className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black tracking-tight text-white sm:text-3xl font-mono">24/7</p>
              <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest font-bold">Muhandislik Yordami</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}