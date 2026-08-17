import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Star,
  BadgePercent,
  Gem,
  RotateCcw
} from 'lucide-react';

// ==========================================
// 1. SLAYDER MA'LUMOTLARI VA KONFIGURATSIYA
// ==========================================

const AUTO_PLAY_INTERVAL = 5500; // Slayd almashish vaqti (ms)

const BANNER_SLIDES = [
  {
    id: 1,
    tag: "YANGI KOLLEKSIYA • 2026",
    title: "Premium Noutbuklar",
    highlightTitle: "va Aksessuarlar",
    description: "Eng so'nggi avlod protsessorlar, yuqori aniqlikdagi ekranlar va zamonaviy dizayn — ish hamda o'yin uchun mukammal tanlov.",
    badgeText: "-20%",
    oldPrice: "15 900 000 so'm",
    newPrice: "12 720 000 so'm",
    rating: 4.9,
    categoryBadges: ['Noutbuklar', 'Monitorlar', 'Klaviaturalar', 'Aksessuarlar'],
    imgUrl: "/banner/banner1.png",
    gradientBg: "from-[#241a08] via-[#3a2b0a] to-[#0D0C0A]",
    accentColor: "bg-amber-400 text-slate-950",
    glowColor: "rgba(255, 193, 7, 0.35)"
  },
  {
    id: 2,
    tag: "PROFESSIONAL TANLOV",
    title: "Monitorlar va",
    highlightTitle: "Ish Stansiyalari",
    description: "4K aniqlikdagi displeylar, yuqori chastotali refresh va kuchli ish stansiyalari — dizaynerlar va dasturchilar uchun.",
    badgeText: "-15%",
    oldPrice: "8 900 000 so'm",
    newPrice: "7 565 000 so'm",
    rating: 5.0,
    categoryBadges: ['4K Monitorlar', 'Workstation', 'Klaviaturalar', 'Sichqonchalar'],
    imgUrl: "/banner/banner2.png",
    gradientBg: "from-[#1f1a10] via-[#3a2b0a] to-[#0D0C0A]",
    accentColor: "bg-amber-400 text-slate-950",
    glowColor: "rgba(197, 160, 40, 0.35)"
  },
  {
    id: 3,
    tag: "GEYMING SEGMENTI",
    title: "Kiber Sport",
    highlightTitle: "Periferiyalari",
    description: "RGB yoritgichli mexanik klaviaturalar, yuqori DPI sichqonlar va simsiz garnituralar — o'yin tajribangizni yangi bosqichga olib chiqing.",
    badgeText: "-30%",
    oldPrice: "2 500 000 so'm",
    newPrice: "1 750 000 so'm",
    rating: 4.8,
    categoryBadges: ['RGB Klaviatura', 'Gaming Mouse', 'Naushnik', 'Mikrofon'],
    imgUrl: "/banner/banner3.png",
    gradientBg: "from-[#241a08] via-[#4a3508] to-[#0A0806]",
    accentColor: "bg-amber-400 text-slate-950",
    glowColor: "rgba(229, 178, 13, 0.4)"
  }
];

// ==========================================
// 2. YORDAMCHI KICHIK KOMPONENTLAR
// ==========================================

const FeatureBadge = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 rounded-xl bg-black/40 backdrop-blur-md px-3 py-1.5 border border-amber-400/20 text-[11px] text-amber-100/90 font-medium transition-all hover:bg-black/60">
    <Icon className="h-3.5 w-3.5 text-amber-300" />
    <span className="whitespace-nowrap">{text}</span>
  </div>
);

const GoldDivider = () => (
  <div className="flex items-center gap-2 mt-5">
    <span className="h-px w-10 bg-gradient-to-r from-amber-400/70 to-transparent" />
    <Gem className="h-3 w-3 text-amber-400/80" />
    <span className="h-px w-10 bg-gradient-to-l from-amber-400/70 to-transparent" />
  </div>
);

// ==========================================
// 3. ASOSIY HERO BANNER KOMPONENTI
// ==========================================

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState('next');

  const totalSlides = BANNER_SLIDES.length;

  const handleNext = useCallback(() => {
    setDirection('next');
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setDirection('prev');
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => handleNext(), AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [handleNext, isHovered]);

  const slide = useMemo(() => BANNER_SLIDES[currentSlide], [currentSlide]);

  return (
    <div className="w-full px-0 sm:px-2 lg:px-4">
      <section
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br ${slide.gradientBg} shadow-2xl shadow-black/60 transition-all duration-700 min-h-[440px] sm:min-h-[480px] lg:h-[500px] flex items-center border border-amber-400/10`}
      >
        {/* Yumshoq oltin nur */}
        <div
          className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[110px] pointer-events-none transition-all duration-700 opacity-60"
          style={{ backgroundColor: slide.glowColor }}
        />
        {/* Yuqori oltin chiziq */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {/* Nozik tekstura */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(255,193,7,0.08),_transparent_40%),radial-gradient(circle_at_85%_75%,_rgba(255,193,7,0.06),_transparent_45%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* ====== CHAP TOMON: MATNLAR ====== */}
          <div className="lg:col-span-7 flex flex-col items-start justify-center text-white">
            {/* Tag */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">
                <Sparkles className="h-3 w-3 animate-pulse" />
                {slide.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-amber-200">
                <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                {slide.rating}
              </span>
            </div>

            {/* Sarlavhalar — serif, hashamatli */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[1.05] text-white font-serif">
              {slide.title}{' '}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                {slide.highlightTitle}
              </span>
            </h1>

            {/* Oltin ajratgich */}
            <GoldDivider />

            {/* Tavsif */}
            <p className="mt-4 text-sm sm:text-base text-slate-300/90 max-w-xl leading-relaxed">
              {slide.description}
            </p>

            {/* Narxlar va CTA */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                to="/katalog"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-3.5 text-sm font-black text-slate-950 uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-[1.02] transition-all duration-300 active:scale-95"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Katalogga o'tish</span>
                <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Maxsus taklif */}
              <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-black/30 backdrop-blur-md px-4 py-2.5">
                <span className={`rounded-xl ${slide.accentColor} px-2.5 py-1 text-xs font-black uppercase shadow-sm`}>
                  {slide.badgeText}
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-slate-400 line-through">{slide.oldPrice}</span>
                  <span className="text-base font-extrabold text-amber-300">{slide.newPrice}</span>
                </div>
              </div>
            </div>

            {/* Kategoriya teglari */}
            <div className="mt-6 hidden sm:flex flex-wrap items-center gap-2">
              {slide.categoryBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium text-slate-300 hover:border-amber-400/30 hover:text-amber-200 transition-colors"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* ====== O'NG TOMON: RASM ====== */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md h-52 sm:h-64 lg:h-80 rounded-3xl overflow-hidden border border-amber-400/20 bg-black/40 shadow-2xl shadow-black/60 group">
              <img
                key={slide.id}
                src={slide.imgUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Rasm ichidagi xususiyatlar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                <FeatureBadge icon={BadgePercent} text="Maxsus narxlar" />
                <FeatureBadge icon={Truck} text="Tezkor yetkazish" />
              </div>
            </div>

            {/* Orqa fon halqasi */}
            <div className="absolute -inset-4 rounded-[2rem] border border-amber-400/10 -z-10" />
          </div>
        </div>

        {/* ====== NAVIGATSIYA ====== */}
        <button
          onClick={handlePrev}
          aria-label="Oldingi slayd"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 hover:bg-black/70 border border-amber-400/20 p-2.5 text-amber-300 backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Keyingi slayd"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 hover:bg-black/70 border border-amber-400/20 p-2.5 text-amber-300 backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Nuqtalar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
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
                  ? 'w-7 bg-amber-400'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Pastki xavfsizlik belgilari */}
        <div className="absolute bottom-4 right-4 z-20 hidden md:flex items-center gap-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          <ShieldCheck className="h-3 w-3 text-amber-400/70" />
          Kafolat
          <span className="text-slate-700">•</span>
          <RotateCcw className="h-3 w-3 text-amber-400/70" />
          14 kun qaytarish
        </div>
      </section>
    </div>
  );
}
