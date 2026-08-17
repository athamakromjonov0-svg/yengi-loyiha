import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Cpu, 
  Sparkles,
  ArrowRight,
  Star
} from 'lucide-react';

// ==========================================
// 1. SLAYDER MA'LUMOTLARI VA KONFIGURATSIYA
// ==========================================

const AUTO_PLAY_INTERVAL = 5000; // Slayd almashish vaqti (ms)

const BANNER_SLIDES = [
  {
    id: 1,
    tag: "TOP TAKLIF • 2026",
    title: "Kompyuterlar Bozori",
    highlightTitle: "Noutbuklar & Aksessuarlar",
    description: "Eng so'nggi avlod Intel Core i9 va RTX 4090 grafik kartasiga ega kuchli geyming va ish noutbuklari.",
    badgeText: "Chegirma 20%",
    oldPrice: "$1,499",
    newPrice: "$1,199",
    rating: 4.9,
    categoryBadges: ['Noutbuklar', 'Stol kompyuterlar', 'Monitorlar', 'Aksessuarlar'],
    imgUrl: "/banner/banner1.png",
    gradientBg: "from-[#FFC107] via-[#B08A00] to-[#1A1208]",
    accentColor: "bg-amber-400 text-slate-950",
    glowColor: "rgba(255, 193, 7, 0.4)"
  },
  {
    id: 2,
    tag: "YANGI KELGAN",
    title: "Ultra Ish Stansiyasi",
    highlightTitle: "Monoblok va Monitorlar",
    description: "Professional dizaynerlar hamda dasturchilar uchun 4K Retina mos keluvchi displeylar va kuchli ish stansiyalari.",
    badgeText: "Chegirma 15%",
    oldPrice: "$2,100",
    newPrice: "$1,785",
    rating: 5.0,
    categoryBadges: ['4K Monitorlar', 'Workstation', 'Klaviaturalar', 'Sichqonchalar'],
    imgUrl: "/banner/banner2.png",
    gradientBg: "from-[#8F6E00] via-[#3B2C08] to-[#0D0C0A]",
    accentColor: "bg-amber-400 text-slate-950",
    glowColor: "rgba(150, 120, 26, 0.4)"
  },
  {
    id: 3,
    tag: "GEAYMING PERIFERIYA",
    title: "Kiber Sport To'plami",
    highlightTitle: "Mexanik Aksessuarlar",
    description: "RGB yoritgichli mexanik klaviaturalar, 26,000 DPI sichqonlar va simsiz geyming garnituralari.",
    badgeText: "Chegirma 30%",
    oldPrice: "$350",
    newPrice: "$245",
    rating: 4.8,
    categoryBadges: ['RGB Klaviatura', 'Gaming Mouse', 'Naushnik', 'Mikrofon'],
    imgUrl: "/banner/banner3.png",
    gradientBg: "from-[#E5B20D] via-[#8F6E00] to-[#0A0806]",
    accentColor: "bg-amber-400 text-slate-950",
    glowColor: "rgba(197, 160, 40, 0.4)"
  }
];

// ==========================================
// 2. YORDAMCHI XUSUSIYAT KARDLARI (BADGES)
// ==========================================

const FeatureBadge = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md px-3 py-1.5 border border-white/15 text-xs text-white/90 font-medium transition-all hover:bg-white/20">
    <Icon className="h-3.5 w-3.5 text-amber-300" />
    <span>{text}</span>
  </div>
);

// ==========================================
// 3. ASOSIY HERO BANNER KOMPONENTI
// ==========================================

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' yoki 'prev'

  const totalSlides = BANNER_SLIDES.length;

  // Next Slide
  const handleNext = useCallback(() => {
    setDirection('next');
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Prev Slide
  const handlePrev = useCallback(() => {
    setDirection('prev');
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play Taymer
  useEffect(() => {
    if (isHovered) return; // Sichqoncha banner ustida bo'lsa to'xtatib turadi
    const timer = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [handleNext, isHovered]);

  const slide = useMemo(() => BANNER_SLIDES[currentSlide], [currentSlide]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      {/* Ixcham Banner Konteyneri (Max height: 420px - 480px) 
      */}
      <section 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-r ${slide.gradientBg} shadow-2xl transition-all duration-700 min-h-[380px] sm:min-h-[420px] lg:h-[460px] flex items-center border border-white/15`}
      >
        {/* Visual Noise va Radial Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(255,255,255,0.25),_transparent_35%),radial-gradient(circle_at_80%_70%,_rgba(255,255,255,0.15),_transparent_40%)] pointer-events-none" />
        
        {/* Fon Yorug'ligi (Glow effect) */}
        <div 
          className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-all duration-700 opacity-60"
          style={{ backgroundColor: slide.glowColor }}
        />

        {/* Banner kontent grid strukturasi */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* ========================================== */}
          {/* CHAP TOMON: MATNLAR VA TUGMALAR (7 Cols)  */}
          {/* ========================================== */}
          <div className="lg:col-span-7 flex flex-col items-start justify-center text-white">
            
            {/* Tag Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
                {slide.tag}
              </span>
              <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-300 border border-white/10">
                <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                <span>{slide.rating}</span>
              </div>
            </div>

            {/* Sarlavhalar */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white drop-shadow-sm">
             Parda Aksesuarlari
            </h1>
            <h2 className="mt-1 text-lg sm:text-2xl lg:text-3xl font-bold text-amber-300/90 tracking-tight">
              Eng Muhumi Sifat
            </h2>

            {/* Qisqa Tavsif */}
            <p className="mt-3 text-sm sm:text-base text-white/85 max-w-xl line-clamp-2 leading-relaxed font-normal">
             Bizda har doim birinchi qol va eng sifatli va arzon Parda Aksesuarlari
            </p>

            {/* Narxlar va CTA Tugmasi */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to="/katalog"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-slate-950/40 hover:bg-slate-900 hover:scale-[1.02] transition-all duration-300 active:scale-95 border border-white/10"
              >
                <ShoppingCart className="h-4 w-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Katalogga o‘tish</span>
                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Maxsus Taklif Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-semibold">
                <span className={`rounded-xl ${slide.accentColor} px-2.5 py-0.5 text-xs font-black uppercase shadow-sm`}>
                  {slide.badgeText}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-white/60 line-through">$25</span>
                  <span className="text-base font-extrabold text-white">$15</span>
                </div>
              </div>
            </div>

            {/* Kategoriya Teglari (Pill badges) */}
            <div className="mt-6 hidden sm:flex flex-wrap items-center gap-2">
              {slide.categoryBadges.map((badge, idx) => (
                <span 
                  key={idx}
                  className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white/90 hover:bg-white/20 transition-colors"
                >
                  {badge}
                </span>
              ))}
            </div>

          </div>

          {/* ========================================== */}
          {/* O'NG TOMON: KOMPYUTER / NOUTBUK RASMI (5 Cols) */}
          {/* ========================================== */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Rasm Ramkasi (Glass Box) */}
            <div className="relative w-full max-w-md h-48 sm:h-64 lg:h-80 rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl group">
              <img 
                key={slide.id}
                src={slide.imgUrl} 
                alt={slide.title}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              
              {/* Rasm ustidagi gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Rasm ichidagi xususiyat ko'rsatgichlari */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <FeatureBadge icon={Cpu} text="Top Processor" />
                <FeatureBadge icon={ShieldCheck} text="2 Yil Kafolat" />
              </div>
            </div>

          </div>

        </div>

        {/* ========================================== */}
        {/* 4. NAVIGATSIYA TUGMALARI VA SLIDER CONTROL */}
        {/* ========================================== */}
        
        {/* Chap Chevron */}
        <button
          onClick={handlePrev}
          aria-label="Oldingi slayd"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-950/30 hover:bg-slate-950/60 border border-white/20 p-2.5 text-white backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* O'ng Chevron */}
        <button
          onClick={handleNext}
          aria-label="Keyingi slayd"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-950/30 hover:bg-slate-950/60 border border-white/20 p-2.5 text-white backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Pastki Nuqtali Navigatsiya (Dots Indicator) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/30 border border-white/15 backdrop-blur-md px-3 py-1.5 rounded-full">
          {BANNER_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 'next' : 'prev');
                setCurrentSlide(index);
              }}
              aria-label={`Slayd ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-7 bg-amber-300' 
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

      </section>
    </div>
  );
}