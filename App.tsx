
import React, { useState, useCallback, useEffect } from 'react';
import { Wallet, RefreshCw, BarChart3, Zap, Download, Loader2, ShoppingCart, CheckCircle2, XCircle, Info, Smartphone, ArrowRight, Share } from 'lucide-react';
import WalletCalculator from './components/WalletCalculator';
import YussorPayCalculator from './components/YussorPayCalculator';
import ExchangeCalculator from './components/ExchangeCalculator';
import POSCalculator from './components/POSCalculator';
import ProfitCalculator from './components/ProfitCalculator';
import ReceiptPrinter from './components/ReceiptPrinter';
import { TabType } from './types';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.WALLET);
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [lastBuyRate, setLastBuyRate] = useState<number>(() => Number(localStorage.getItem('buyRate')) || 0);
  const [lastSellRate, setLastSellRate] = useState<number>(() => Number(localStorage.getItem('sellRate')) || 0);
  const [lastUSDT, setLastUSDT] = useState<number>(() => Number(localStorage.getItem('usdtQty')) || 0);

  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallOverlay, setShowInstallOverlay] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || (window.navigator as any).standalone 
                         || document.referrer.includes('android-app://');
    
    setIsStandalone(checkStandalone);

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (!checkStandalone && !sessionStorage.getItem('pwa_overlay_dismissed')) {
      setShowInstallOverlay(true);
    }

    // التحقق من وجود الحدث المخزن في window
    if ((window as any).deferredPrompt) {
      setCanInstall(true);
    }

    const handlePwaReady = () => setCanInstall(true);
    window.addEventListener('pwa-install-ready', handlePwaReady);

    const handleToastEvent = (e: any) => {
      const { message, type } = e.detail;
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, message, type: type || 'success' }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    window.addEventListener('app-toast' as any, handleToastEvent);
    
    return () => {
      window.removeEventListener('pwa-install-ready', handlePwaReady);
      window.removeEventListener('app-toast' as any, handleToastEvent);
    };
  }, []);

  const handleInstallClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        (window as any).deferredPrompt = null;
        setCanInstall(false);
        setShowInstallOverlay(false);
      }
    } else if (isIOS) {
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'اضغط على زر المشاركة ثم "إضافة إلى الشاشة الرئيسية"', type: 'info' } 
      }));
    } else {
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'يرجى استخدام قائمة المتصفح لتثبيت التطبيق', type: 'info' } 
      }));
    }
  };

  const dismissOverlay = () => {
    setShowInstallOverlay(false);
    sessionStorage.setItem('pwa_overlay_dismissed', 'true');
  };

  const handleUpdateRates = useCallback((buy: number, sell: number, usdt: number) => {
    if (buy > 0) {
      setLastBuyRate(buy);
      localStorage.setItem('buyRate', buy.toString());
    }
    if (sell > 0) {
      setLastSellRate(sell);
      localStorage.setItem('sellRate', sell.toString());
    }
    if (usdt > 0) {
      setLastUSDT(usdt);
      localStorage.setItem('usdtQty', usdt.toString());
    }
  }, []);

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTabChanging(false);
    }, 450);
  };

  const getTabTitle = () => {
    switch(activeTab) {
      case TabType.WALLET: return "حاسبة المحفظة";
      case TabType.YUSSOR_PAY: return "حاسبة يسر باي";
      case TabType.EXCHANGE: return "صرف USDT";
      case TabType.POS: return "نقطة بيع USDT";
      case TabType.PROFIT: return "تحليل الأرباح";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen pb-32 md:pb-12 flex flex-col items-center bg-[#020617] text-slate-100 overflow-x-hidden selection:bg-blue-500/30">
      
      {showInstallOverlay && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-2xl animate-in fade-in duration-500">
          <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_100px_rgba(59,130,246,0.15)] flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
            
            <div className="w-24 h-24 bg-slate-800 rounded-3xl mb-6 p-2 border border-white/5 shadow-2xl flex items-center justify-center relative">
              <img 
                src="https://g.top4top.io/p_36302vlm50.jpg" 
                alt="Logo" 
                className="w-full h-full object-contain rounded-2xl" 
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-lg p-1.5 shadow-lg border border-slate-900">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">تطبيق المصداقية للإلكترونيات</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 px-4 font-bold">
              {isIOS ? 'للحصول على أفضل تجربة، أضف التطبيق لشاشتك الرئيسية عبر زر المشاركة.' : 'قم بتثبيت التطبيق للوصول السريع والعمل بدون إنترنت.'}
            </p>

            <div className="w-full space-y-3">
              <button 
                onClick={handleInstallClick}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-900/20"
              >
                {isIOS ? <Share className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                <span>{isIOS ? 'طريقة التثبيت على آيفون' : 'تثبيت التطبيق الآن'}</span>
              </button>
              
              <button 
                onClick={dismissOverlay}
                className="w-full py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>المتابعة عبر المتصفح</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-50">نظام المصداقية الذكي • إصدار V2.0</p>
          </div>
        </div>
      )}

      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-full px-6">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-2.5 px-5 py-2.5 rounded-full border shadow-[0_12px_40px_rgb(0,0,0,0.5)] backdrop-blur-2xl
              animate-in slide-in-from-top-4 fade-in zoom-in-95 duration-500 ease-out
              ${toast.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 
                toast.type === 'error' ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' : 
                'bg-blue-500/15 border-blue-500/30 text-blue-400'}
            `}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
            <span className="text-[11px] font-black uppercase tracking-wide whitespace-nowrap">{toast.message}</span>
          </div>
        ))}
      </div>

      <header className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/5 p-4 mb-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative p-1 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden flex items-center justify-center">
              <img 
                src="https://g.top4top.io/p_36302vlm50.jpg" 
                alt="Logo" 
                className="h-10 w-auto max-w-[40px] object-contain" 
              />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black text-white/90 uppercase tracking-tighter">المصداقية للإلكترونيات</h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest transition-all duration-300">
                {getTabTitle()}
              </p>
            </div>
          </div>
        </div>
        
        {(!isStandalone && canInstall) && (
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition-all active:scale-95 shadow-lg shadow-blue-900/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تثبيت</span>
          </button>
        )}
        
        {isStandalone && (
          <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
            <span className="text-[10px] font-bold text-slate-400">مثبت</span>
          </div>
        )}

        <div className={`absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 transition-all duration-500 ease-in-out z-[60] ${isTabChanging ? 'w-full opacity-100 shadow-[0_0_15px_#3b82f6]' : 'w-0 opacity-0'}`}></div>
      </header>

      <main className={`w-full max-w-xl px-4 flex-1 transition-all duration-400 relative ${isTabChanging ? 'opacity-20 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'}`}>
        {isTabChanging && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-32 animate-in fade-in duration-300">
            <div className="p-5 bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] animate-pulse">جاري التحميل...</span>
            </div>
          </div>
        )}
        <div className={`transition-all duration-500 ${isTabChanging ? 'blur-md' : 'blur-0'}`}>
          {activeTab === TabType.WALLET && <WalletCalculator />}
          {activeTab === TabType.YUSSOR_PAY && <YussorPayCalculator />}
          {activeTab === TabType.EXCHANGE && (
            <ExchangeCalculator 
              onUpdateRates={handleUpdateRates} 
              initialUSDT={lastUSDT}
            />
          )}
          {activeTab === TabType.POS && (
            <POSCalculator 
              buyRate={lastBuyRate}
              sellRate={lastSellRate}
            />
          )}
          {activeTab === TabType.PROFIT && (
            <ProfitCalculator 
              buyRate={lastBuyRate} 
              sellRate={lastSellRate} 
              usdtQuantity={lastUSDT} 
            />
          )}
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex justify-around p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
        <button 
          onClick={() => handleTabChange(TabType.WALLET)}
          className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-500 flex-1 relative ${activeTab === TabType.WALLET ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {activeTab === TabType.WALLET && <div className="absolute inset-0 bg-blue-500/10 rounded-2xl animate-pulse"></div>}
          <Wallet className={`w-5 h-5 relative z-10 transition-transform ${activeTab === TabType.WALLET ? 'scale-110' : ''}`} />
          <span className="text-[8px] mt-1 font-black relative z-10">المحفظة</span>
        </button>
        <button 
          onClick={() => handleTabChange(TabType.YUSSOR_PAY)}
          className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-500 flex-1 relative ${activeTab === TabType.YUSSOR_PAY ? 'text-orange-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {activeTab === TabType.YUSSOR_PAY && <div className="absolute inset-0 bg-orange-500/10 rounded-2xl animate-pulse"></div>}
          <Zap className={`w-5 h-5 relative z-10 transition-transform ${activeTab === TabType.YUSSOR_PAY ? 'scale-110' : ''}`} />
          <span className="text-[8px] mt-1 font-black relative z-10">يسر باي</span>
        </button>
        <button 
          onClick={() => handleTabChange(TabType.POS)}
          className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-500 flex-1 relative ${activeTab === TabType.POS ? 'text-green-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {activeTab === TabType.POS && <div className="absolute inset-0 bg-green-500/10 rounded-2xl animate-pulse"></div>}
          <ShoppingCart className={`w-5 h-5 relative z-10 transition-transform ${activeTab === TabType.POS ? 'scale-110' : ''}`} />
          <span className="text-[8px] mt-1 font-black relative z-10">نقطة بيع</span>
        </button>
        <button 
          onClick={() => handleTabChange(TabType.EXCHANGE)}
          className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-500 flex-1 relative ${activeTab === TabType.EXCHANGE ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {activeTab === TabType.EXCHANGE && <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl animate-pulse"></div>}
          <RefreshCw className={`w-5 h-5 relative z-10 transition-transform ${activeTab === TabType.EXCHANGE ? 'scale-110' : ''}`} />
          <span className="text-[8px] mt-1 font-black relative z-10">الصرف</span>
        </button>
        <button 
          onClick={() => handleTabChange(TabType.PROFIT)}
          className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-500 flex-1 relative ${activeTab === TabType.PROFIT ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {activeTab === TabType.PROFIT && <div className="absolute inset-0 bg-purple-500/10 rounded-2xl animate-pulse"></div>}
          <BarChart3 className={`w-5 h-5 relative z-10 transition-transform ${activeTab === TabType.PROFIT ? 'scale-110' : ''}`} />
          <span className="text-[8px] mt-1 font-black relative z-10">الأرباح</span>
        </button>
      </nav>

      <ReceiptPrinter />
    </div>
  );
};

export default App;