
import React, { useState } from 'react';
import { ShoppingCart, Printer, Loader2, Coins, TrendingUp, UserCheck } from 'lucide-react';
import { printReceipt } from '../services/printService';
import { POSTransaction } from '../types';

interface POSCalculatorProps {
  buyRate: number;
  sellRate: number;
}

const POSCalculator: React.FC<POSCalculatorProps> = ({ buyRate, sellRate: initialSellRate }) => {
  const [usdtAmount, setUsdtAmount] = useState<number>(0);
  const [currentSellRate, setCurrentSellRate] = useState<number>(initialSellRate || 0);
  const [binanceId, setBinanceId] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState(false);
  
  const totalLyd = usdtAmount * currentSellRate;
  const currentProfit = (currentSellRate - buyRate) * usdtAmount;

  const handleCompleteSale = () => {
    if (usdtAmount <= 0 || currentSellRate <= 0) return;
    
    setIsPrinting(true);

    const transaction: POSTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      usdtAmount,
      sellRate: currentSellRate,
      buyRate,
      totalLyd,
      profit: currentProfit,
      binanceId,
      date: new Date().toLocaleString('ar-LY')
    };

    const history: POSTransaction[] = JSON.parse(localStorage.getItem('pos_history') || '[]');
    localStorage.setItem('pos_history', JSON.stringify([transaction, ...history]));

    setTimeout(() => {
      printReceipt({
        type: 'USDT_POS',
        data: {
          usdt: usdtAmount,
          sellRate: currentSellRate,
          binanceId: binanceId || 'غير متوفر',
          totalSell: totalLyd,
          date: transaction.date
        }
      });
      setIsPrinting(false);
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'تم تسجيل البيع وطباعة الإيصال بنجاح', type: 'success' } 
      }));
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card p-6 rounded-[2rem] shadow-xl border border-slate-800 transition-all duration-500 focus-within:border-green-500/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-2xl border border-green-500/20 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-none">نقطة بيع USDT</h2>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">USDT Point of Sale</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="relative group">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-500 transition-all z-10">
              <Coins className="w-6 h-6" />
            </div>
            <input 
              type="number" 
              className="w-full bg-slate-900/50 pr-14 pl-6 py-5 rounded-2xl border-2 border-slate-800 text-white focus:border-green-400 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-2xl font-black placeholder:text-slate-800"
              placeholder="0.00"
              value={usdtAmount || ''}
              onChange={(e) => setUsdtAmount(Number(e.target.value))}
            />
            <label className="absolute -top-2 right-4 px-2 bg-slate-950 text-[10px] font-black text-green-400 uppercase tracking-widest">كمية USDT</label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-all z-10">
                <TrendingUp className="w-5 h-5" />
              </div>
              <input 
                type="number" 
                step="0.001"
                className="w-full bg-slate-900/50 pr-10 pl-4 py-4 rounded-xl border-2 border-slate-800 text-white focus:border-blue-400 outline-none transition-all text-lg font-black"
                placeholder="0.000"
                value={currentSellRate || ''}
                onChange={(e) => setCurrentSellRate(Number(e.target.value))}
              />
              <label className="absolute -top-2 right-4 px-2 bg-slate-950 text-[10px] font-black text-blue-400 uppercase tracking-widest">سعر البيع</label>
            </div>

            <div className="relative group">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-500 transition-all z-10">
                <UserCheck className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                className="w-full bg-slate-900/50 pr-10 pl-4 py-4 rounded-xl border-2 border-slate-800 text-white focus:border-purple-400 outline-none transition-all text-lg font-black"
                placeholder="Binance ID"
                value={binanceId}
                onChange={(e) => setBinanceId(e.target.value)}
              />
              <label className="absolute -top-2 right-4 px-2 bg-slate-950 text-[10px] font-black text-purple-400 uppercase tracking-widest">آيدي بينانس</label>
            </div>
          </div>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-[2rem] transition-transform duration-500 hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-900"></div>
        <div className="relative p-8 text-white space-y-4">
          <div className="flex justify-between items-center opacity-70">
            <span className="text-xs font-bold uppercase tracking-widest">ملخص البيع للزبون</span>
            <div className="h-px flex-1 mx-4 bg-white/20"></div>
            <span className="text-[10px] font-black tabular-nums">USDT / LYD</span>
          </div>
          
          <div className="pt-4 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-green-200">الإجمالي للدفع بالدينار</p>
              <h3 className="text-5xl font-black tracking-tighter tabular-nums">
                {totalLyd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="text-right">
               <p className="text-[10px] opacity-60 font-bold mb-1">الربح الصافي</p>
               <p className="text-lg font-black text-green-300">+{currentProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        disabled={usdtAmount <= 0 || currentSellRate <= 0 || isPrinting}
        onClick={handleCompleteSale}
        className={`group relative w-full py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl disabled:opacity-50 overflow-hidden border-2
          ${isPrinting ? 'bg-slate-800 text-blue-400 border-blue-500/50' : 
            'bg-slate-950 border-slate-800 text-green-400 hover:bg-slate-900 hover:border-green-500/50 active:scale-[0.96]'}`}
      >
        {isPrinting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>جاري المعالجة...</span>
          </>
        ) : (
          <>
            <Printer className="w-6 h-6" />
            <span>تسجيل البيع وطباعة الإيصال</span>
          </>
        )}
      </button>
      
      <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest px-10 leading-relaxed">
        يتم حذف بيانات "سعر الشراء" و"الربح" تلقائياً من الإيصال المطبوع لضمان سرية العمليات.
      </p>
    </div>
  );
};

export default POSCalculator;
