import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Loader2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Star,
  Zap,
  Globe2,
  Fingerprint
} from 'lucide-react';

export default function SiteLoginPage() {
  const { loginWithGoogle, isSiteAuthenticated } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/sayt/profil';

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Event: allaqachon kirilgan bo'lsa profilga yo'naltirish
  useEffect(() => {
    if (isSiteAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isSiteAuthenticated, navigate, from]);

  if (isSiteAuthenticated) {
    return null;
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        navigate(from, { replace: true });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Email/parol orqali ro'yxatdan o'tish hozircha Google orqali ishlaydi
    // Keyingi versiyada qo'shiladi
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 font-sans select-none">
      
      {/* ORQA FON EFFEKTLARI */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* DEKORATIV SHAKLLAR */}
      <div className="absolute top-16 left-[8%] hidden lg:block w-24 h-24 rounded-2xl border border-slate-800/50 rotate-12 animate-pulse opacity-50" />
      <div className="absolute bottom-16 right-[8%] hidden lg:block w-16 h-16 rounded-full border border-slate-800/50 animate-pulse opacity-50" />
      <div className="absolute top-1/2 right-[12%] hidden lg:block w-3 h-3 rounded-full bg-emerald-400/40 animate-ping" />

      <div className="relative w-full max-w-5xl z-10">
        <div className="grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl shadow-2xl shadow-black/50">

          {/* CHAP SEKSIYA - BREND / NISH */}
          <div className="relative hidden lg:flex flex-col justify-between p-10 border-r border-slate-900 bg-gradient-to-br from-slate-900/50 via-slate-950 to-slate-950 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.08),transparent_50%)] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 text-slate-950 shadow-lg shadow-indigo-500/20">
                  <Globe2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-widest text-white uppercase">
                    A.A.A<span className="text-emerald-400">.uz</span>
                  </h1>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                    Premium Digital Store
                  </p>
                </div>
              </div>

              <div className="mt-14 space-y-6">
                <h2 className="text-3xl font-black text-white leading-tight">
                  Yangi avlod<br />
                  <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                    kiber-do'koniga
                  </span><br />
                  xush kelibsiz!
                </h2>

                <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                  Google akkauntingiz bilan bir marotaba kiring va premium mahsulotlar,
                  chegirmalar hamda shaxsiy kabinetingizga tezkor kirish imkoniyatiga ega bo'ling.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span>Google orqali xavfsiz avtorizatsiya</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Zap className="h-4 w-4" />
                    </div>
                    <span>Shaxsiy kabinet va buyurtmalar tarixi</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      <Star className="h-4 w-4" />
                    </div>
                    <span>Yutuq va maxsus chegirmalar siz uchun</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center gap-2 text-[9px] text-slate-600 font-mono uppercase tracking-widest">
              <Fingerprint className="h-3 w-3 text-emerald-500/60" />
              Firebase Auth
              <span className="text-slate-800">•</span>
              Google Secure
              <span className="text-slate-800">•</span>
              SSL Encrypted
            </div>
          </div>

          {/* O'NG SEKSIYA - LOGIN FORMA */}
          <div className="p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />

            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 text-slate-950">
                <Globe2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-widest text-white uppercase">
                  A.A.A<span className="text-emerald-400">.uz</span>
                </h1>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                  Premium Digital Store
                </p>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                <Sparkles className="h-3 w-3" /> Ro'yxatdan o'tish / Kirish
              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white">
                Hisobingizga kiring
              </h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Google akkauntingiz orqali bir marta bosing, hammasi tayyor!
              </p>
            </div>

            {/* GOOGLE LOGIN BUTTON */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="group relative w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-white px-6 py-4 text-sm font-black text-slate-800 uppercase tracking-widest transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 hover:shadow-2xl hover:shadow-white/10 disabled:opacity-50 active:scale-[0.99] overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
                    Google bilan ulanmoqda...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google bilan kirish / Ro'yxatdan o'tish
                  </>
                )}
              </button>
            </div>

            {/* DIVIDER */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-900" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-950/60 px-4 py-1 rounded-full border border-slate-900 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                  yoki quyidagilar bilan
                </span>
              </div>
            </div>

            {/* EMAIL ORQALI KIRISH */}
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Ismingiz
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Ismingiz"
                      className="w-full rounded-xl border border-slate-900 bg-slate-950/80 py-3 pl-11 pr-4 text-xs text-white placeholder-slate-700 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email manzil
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full rounded-xl border border-slate-900 bg-slate-950/80 py-3 pl-11 pr-4 text-xs text-white placeholder-slate-700 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Parol
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-900 bg-slate-950/80 py-3 pl-11 pr-10 text-xs text-white placeholder-slate-700 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none transition-all font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-slate-600 hover:text-slate-300 transition-colors"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 py-3.5 text-xs font-black text-white uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99] shadow-xl shadow-indigo-500/10"
              >
                Hisob yaratish
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* XAVFSIZLIK */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] text-slate-600 font-mono uppercase tracking-widest">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-emerald-500/60" /> Firebase himoyasi
              </span>
              <span className="text-slate-800">•</span>
              <span>Google Auth</span>
              <span className="text-slate-800">•</span>
              <span>Ma'lumotlar shifrlangan</span>
            </div>

            <p className="mt-4 text-center text-[10px] text-slate-600 leading-relaxed">
              Davom etish orqali siz <span className="text-slate-400 underline cursor-pointer">Foydalanish shartlari</span> va{' '}
              <span className="text-slate-400 underline cursor-pointer">Maxfiylik siyosatiga</span> rozilik bildirasiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}