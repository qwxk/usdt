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
                         || (window.navigator as any).standalone;
    
    setIsStandalone(checkStandalone);

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (!checkStandalone && !sessionStorage.getItem('pwa_overlay_dismissed')) {
      setShowInstallOverlay(true);
    }

    // التحقق الفوري من وجود الحدث المخزن
    if ((window as any).deferredPrompt) {
      setCanInstall(true);
    }

    const handlePwaReady = () => {
      console.log('PWA is ready to be installed');
      setCanInstall(true);
    };

    window.addEventListener('pwa-install-ready', handlePwaReady);

    const handleToastEvent = (e: any) => {
      const { message, type } = e.detail;
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type: type || 'success' }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    window.addEventListener('app-toast' as any, handleToastEvent);
    
    return () => {
      window.removeEventListener('pwa-install-ready', handlePwaReady);
      window.removeEventListener('app-toast' as any, handleToastEvent);
    };
  }, []);

  const handleInstallClick = async () => {
    const prompt = (window as any).deferredPrompt;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
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
        detail: { message: 'التثبيت متاح عبر قائمة المتصفح (ثلاث نقاط > تثبيت التطبيق)', type: 'info' } 
      }));
    }
  };

  const dismissOverlay = () => {
    setShowInstallOverlay(false);
    sessionStorage.setItem('pwa_overlay_dismissed', 'true');
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTabChanging(false);
    }, 450);
  };

  const handleUpdateRates = useCallback((buy: number, sell: number, usdt: number) => {
    if (buy > 0) { setLastBuyRate(buy); localStorage.setItem('buyRate', buy.toString()); }
    if (sell > 0) { setLastSellRate(sell); localStorage.setItem('sellRate', sell.toString()); }
    if (usdt > 0) { setLastUSDT(usdt); localStorage.setItem('usdtQty', usdt.toString()); }
  }, []);

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
          <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_100px_rgba(59,130,246,0.15)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
            
            <div className="w-24 h-24 bg-slate-800 rounded-3xl mb-6 p-2 border border-white/5 shadow-2xl flex items-center justify-center relative">
              <img src="https://g.top4top.io/p_36302vlm50.jpg" alt="Logo" className="w-full h-full object-contain rounded-2xl" />
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-lg p-1.5 shadow-lg border border-slate-900">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">المصداقية للإلكترونيات</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 px-4 font-bold">
              {isIOS ? 'للحصول على أفضل تجربة، أضف التطبيق لشاشتك الرئيسية.' : 'قم بتثبيت التطبيق للوصول السريع والعمل بدون إنترنت.'}
            </p>

            <div className="w-full space-y-3">
              <button 
                onClick={handleInstallClick}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-900/20"
              >
                {isIOS ? <Share className="w-6 h-6" /> : <Download className="w-6 h-6" />}
                <span>{isIOS ? 'طريقة التثبيت' : 'تثبيت التطبيق'}</span>
              </button>
              
              <button onClick={dismissOverlay} className="w-full py-4 text-slate-400 rounded-2xl font-bold text-sm hover:text-white transition-colors">
                المتابعة عبر المتصفح
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-full px-6">
        {toasts.map(toast => (
          <div key={toast.id} className={`pointer-events-auto flex items-center gap-2.5 px-5 py-2.5 rounded-full border shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-4 fade-in duration-500 ${toast.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-blue-500/15 border-blue-500/30 text-blue-400'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Info className="w-4 h-4 shrink-0" />}
            <span className="text-[11px] font-black uppercase tracking-wide">{toast.message}</span>
          </div>
        ))}
      </div>

      <header className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/5 p-4 mb-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-20"></div>
            <div className="relative p-1 bg-slate-900 border border-white/10 rounded-xl">
              <img src="https://g.top4top.io/p_36302vlm50.jpg" alt="Logo" className="h-10 w-10 object-contain rounded-lg" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black text-white/90 uppercase tracking-tighter">المصداقية للإلكترونيات</h1>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{getTabTitle()}</p>
          </div>
        </div>
        
        {(!isStandalone && canInstall) && (
          <button onClick={handleInstallClick} className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>تثبيت</span>
          </button>
        )}
      </header>

      <main className={`w-full max-w-xl px-4 flex-1 transition-all duration-400 relative ${isTabChanging ? 'opacity-20 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'}`}>
        {isTabChanging && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-32 animate-in fade-in duration-300">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        )}
        <div className={isTabChanging ? 'blur-md' : 'blur-0'}>
          {activeTab === TabType.WALLET && <WalletCalculator />}
          {activeTab === TabType.YUSSOR_PAY && <YussorPayCalculator />}
          {activeTab === TabType.EXCHANGE && <ExchangeCalculator onUpdateRates={handleUpdateRates} initialUSDT={lastUSDT} />}
          {activeTab === TabType.POS && <POSCalculator buyRate={lastBuyRate} sellRate={lastSellRate} />}
          {activeTab === TabType.PROFIT && <ProfitCalculator buyRate={lastBuyRate} sellRate={lastSellRate} usdtQuantity={lastUSDT} />}
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex justify-around p-1.5 shadow-2xl z-50">
        {[
          { tab: TabType.WALLET, icon: Wallet, label: 'المحفظة', color: 'text-blue-400' },
          { tab: TabType.YUSSOR_PAY, icon: Zap, label: 'يسر باي', color: 'text-orange-400' },
          { tab: TabType.POS, icon: ShoppingCart, label: 'نقطة بيع', color: 'text-green-400' },
          { tab: TabType.EXCHANGE, icon: RefreshCw, label: 'الصرف', color: 'text-cyan-400' },
          { tab: TabType.PROFIT, icon: BarChart3, label: 'الأرباح', color: 'text-purple-400' }
        ].map(({ tab, icon: Icon, label, color }) => (
          <button 
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all flex-1 relative ${activeTab === tab ? color : 'text-slate-500 hover:text-slate-300'}`}
          >
            {activeTab === tab && <div className={`absolute inset-0 opacity-10 rounded-2xl bg-current animate-pulse`}></div>}
            <Icon className={`w-5 h-5 relative z-10 transition-transform ${activeTab === tab ? 'scale-110' : ''}`} />
            <span className="text-[8px] mt-1 font-black relative z-10">{label}</span>
          </button>
        ))}
      </nav>

      <ReceiptPrinter />
    </div>
  );
};

export default App;