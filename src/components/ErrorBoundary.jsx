import { Component } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

/**
 * ERROR BOUNDARY — ilova ichida kutilmagan xato yuz bersa,
 * butun sayt oq ekran bo'lib qolmasdan, chiroyli xato sahifasi ko'rsatiladi.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Ilova xatosi:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center px-4 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 text-center max-w-md w-full">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/10">
              <AlertTriangle className="h-9 w-9 text-rose-400 animate-pulse" />
            </div>

            <h1 className="text-xl font-black uppercase tracking-widest mb-2">
              Xatolik <span className="text-rose-400">Yuz Berdi</span>
            </h1>
            <p className="text-sm text-slate-400 font-light leading-relaxed mb-8">
              Kechirasiz, sahifani yuklashda kutilmagan xatolik ro'y berdi.
              Sahifani qayta yuklab ko'ring.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-rose-400 transition-all"
              >
                <RotateCcw className="h-4 w-4" /> Sahifani qayta yuklash
              </button>
              <a
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 py-3 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              >
                <Home className="h-4 w-4" /> Bosh sahifaga qaytish
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
