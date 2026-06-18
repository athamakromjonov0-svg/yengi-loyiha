import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Github, 
  Globe, 
  ShieldCheck, 
  Mail, 
  Phone, 
  FileText, 
  Send, 
  Clock, 
  MapPin, 
  Instagram, 
  Twitter, 
  Cpu 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Premium Futuristik Footer Komponenti
 * Loyihaning eng pastki qismida professional ma'lumotlar tizimini taqdim etadi.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { showToast } = useApp();
  const [email, setEmail] = useState('');

  // Yangiliklarga obuna bo'lish funksiyasi
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Iltimos, elektron pochtangizni kiriting!", "warning");
      return;
    }
    
    // Email validatsiyasini tekshirish
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Noto'g'ri elektron pochta formati!", "error");
      return;
    }

    showToast("VORTEX bülteniga muvaffaqiyatli obuna bo'ldingiz!", "success");
    setEmail('');
  };

  return (
    <footer className="relative border-t border-slate-900 bg-slate-950/90 backdrop-blur-xl text-slate-400 font-sans mt-auto overflow-hidden">
      
      {/* Orqa fondagi neon dizayn elementlari */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 1-QISM: EMAIL YANGILIKLARIGA OBUNA BO'LISH (NEWSLETTER) */}
      <div className="border-b border-slate-900/60 bg-slate-950/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400 animate-pulse" /> Maxfiy Chegirmalar Tizimi
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-light">
              Yangi premium kiber-mahsulotlar va eksklyuziv takliflardan birinchilardan bo'lib xabardor bo'ling.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="w-full max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Elektron pochta manzilingiz..."
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-slate-950 hover:bg-emerald-400 hover:text-slate-950 active:scale-95 transition-all duration-200 shadow-md shadow-white/5"
            >
              <span>Obuna bo'lish</span>
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      </div>

      {/* 2-QISM: ASOSIY MATRITSA LINKLARI */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Blok 1: Brend va Maqsad */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-white to-slate-200 text-slate-950 font-black shadow-lg">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-lg font-black tracking-widest text-white uppercase">
                VORTEX<span className="text-emerald-400 font-normal">.uz</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-light max-w-sm">
              Premium elektronika, kiber-texnikalar va yuqori texnologiyali gadjetlar olami. Biz faqat eng sara va xalqaro standartlarga javob beradigan kiber-uskunalarni jamlaymiz.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 bg-slate-900/10 rounded-lg">
              <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Har kuni: 09:00 - 22:00 (Dam olish kunlarisiz)</span>
            </div>
          </div>

          {/* Blok 2: Do'kon Navigatsiyasi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-emerald-400 pl-2">
              Tizim Xaritasi
            </h4>
            <ul className="space-y-2.5 text-xs font-normal">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5">
                  Bosh Sahifa
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors duration-200">
                  Mahsulotlar Katalogi
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors duration-200">
                  Root Avtorizatsiya
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors duration-200">
                  Biz Haqimizda
                </a>
              </li>
            </ul>
          </div>

          {/* Blok 3: Kiber Aloqa Operatori */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-emerald-400 pl-2">
              Aloqa Markazi
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> 
                <span className="text-slate-300 font-semibold">+998 (90) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> 
                <span className="hover:text-white transition-colors">info@vortex.uz</span>
              </li>
              <li className="flex items-start gap-2 text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 42-bino</span>
              </li>
            </ul>
          </div>

          {/* Blok 4: Huquqiy va Xavfsizlik Himoyasi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-emerald-400 pl-2">
              Kiber Xavfsizlik
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-slate-500 hover:text-slate-400 transition-colors cursor-pointer">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Maxfiylik Siyosati
              </li>
              <li className="flex items-center gap-2 text-slate-500 hover:text-slate-400 transition-colors cursor-pointer">
                <FileText className="h-3.5 w-3.5 text-emerald-500" /> Foydalanish Shartlari
              </li>
              <li className="flex items-center gap-2 text-slate-500 hover:text-slate-400 transition-colors cursor-pointer">
                <Globe className="h-3.5 w-3.5 text-emerald-500" /> Ommaviy Oferta
              </li>
            </ul>
          </div>

        </div>

        {/* 3-QISM: TERMINAL PASTKI METRIKALARI */}
        <div className="border-t border-slate-900/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p>&copy; {currentYear} VORTEX.uz. Barcha huquqlar qat'iy himoyalangan.</p>
            <span className="hidden sm:inline text-slate-800">|</span>
            <p className="text-[10px] font-mono tracking-widest text-slate-700">VERSION 2.0.26_PROD</p>
          </div>
          
          {/* Ijtimoiy tarmoq kiber-tugmalari */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg bg-slate-900/40 border border-slate-900 text-slate-500 hover:text-white hover:bg-slate-900 hover:border-slate-800 transition-all duration-200"
              aria-label="GitHub terminal"
            >
              <Github className="h-4 w-4" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg bg-slate-900/40 border border-slate-900 text-slate-500 hover:text-emerald-400 hover:bg-slate-900 hover:border-slate-800 transition-all duration-200"
              aria-label="Instagram profil"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg bg-slate-900/40 border border-slate-900 text-slate-500 hover:text-blue-400 hover:bg-slate-900 hover:border-slate-800 transition-all duration-200"
              aria-label="Twitter aloqa"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}