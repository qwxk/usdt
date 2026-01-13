
import React, { useState, useMemo } from 'react';
import { Printer, Zap, Sparkles, Coins, Info, Loader2 } from 'lucide-react';
import { printReceipt } from '../services/printService';

const YussorPayCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const COMMISSION_PERCENT = 5.0;

  const calculations = useMemo(() => {
    const rawFee = (amount * COMMISSION_PERCENT) / 100;
    const rawTotal = amount + rawFee;
    
    const integerPart = Math.floor(rawTotal);
    const decimalPart = rawTotal - integerPart;
    
    let roundedTotal = rawTotal;
    if (decimalPart > 0 && decimalPart <= 0.5) {
      roundedTotal = integerPart + 0.5;
    } else if (decimalPart > 0.5) {
      roundedTotal = integerPart + 1.0;
    }

    const finalFee = roundedTotal - amount;
    const roundingDiff = roundedTotal - rawTotal;

    return { rawFee, finalFee, roundedTotal, roundingDiff };
  }, [amount]);

  const handlePrint = async () => {
    if (amount <= 0) return;
    setIsPrinting(true);
    
    setTimeout(() => {
      printReceipt({
        type: 'TRANSACTION',
        data: {
          netAmount: amount,
          totalCharge: calculations.roundedTotal,
          bankFee: calculations.finalFee,
          walletFee: 0,
          usdt: 0,
          sellRate: 0,
          date: new Date().toLocaleString('ar-LY')
        }
      });
      setIsPrinting(false);
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'تمت طباعة إيصال يسر باي بنجاح', type: 'success' } 
      }));
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass-card p-6 rounded-[2rem] shadow-xl border border-slate-800 transition-all duration-500 focus-within:border-orange-500/50 focus-within:shadow-[0_0_30px_rgba(249,115,22,0.1)] group/card">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-2xl border border-orange-500/20 group-focus-within/card:scale-110 transition-transform duration-300 flex items-center justify-center">
              <img 
                src="https://masarat.ly/ms_uploads/2023/08/yussor-white.svg" 
                alt="Yussor Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-none">يسر باي</h2>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Yussor Pay Service</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-orange-500 bg-orange-500/5 px-2 py-0.5 rounded-md border border-orange-500/10">عمولة 5%</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 group-focus-within:scale-110 transition-all duration-300 z-10">
              <Coins className="w-6 h-6" />
            </div>
            <input 
              type="number" 
              className="w-full bg-slate-900/50 pr-14 pl-6 py-6 rounded-2xl border-2 border-slate-800 text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-3xl font-black placeholder:text-slate-800 shadow-inner"
              placeholder="0.00"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              autoFocus
            />
            <label className="absolute -top-2 right-4 px-2 bg-slate-950 text-[10px] font-black text-orange-400 uppercase tracking-widest transition-all group-focus-within:text-white origin-right">
              المبلغ المراد دفعه
            </label>
          </div>

          <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 flex gap-3 items-start transition-all duration-300 group-focus-within/card:border-orange-500/20">
            <Info className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
              يتم تطبيق تقريب آلي للمبلغ النهائي (0.5 أو 1.0) لتبسيط عملية المحاسبة النقدية مع الزبون.
            </p>
          </div>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-[2rem] transition-transform duration-500 hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-800 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="relative p-8 text-white space-y-5">
          <div className="flex justify-between items-center opacity-70">
            <span className="text-xs font-bold uppercase tracking-widest">تحليل العملية</span>
            <div className="h-px flex-1 mx-4 bg-white/20"></div>
            <Sparkles className="w-4 h-4" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] opacity-60 font-bold mb-1 uppercase tracking-tighter">العمولة الكلية</p>
              <p className="text-xl font-black tabular-nums">{calculations.finalFee.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] opacity-60 font-bold mb-1 uppercase tracking-tighter">فرق التقريب</p>
              <p className="text-xl font-black tabular-nums">+{calculations.roundingDiff.toFixed(2)}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-orange-200">الإجمالي المطلوب</p>
              <h3 className="text-5xl font-black tracking-tighter tabular-nums transition-all duration-300 group-hover:scale-105 origin-right">
                {calculations.roundedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="relative h-12 w-24 group-hover:rotate-2 transition-transform duration-500 rounded-lg overflow-hidden border border-white/20 shadow-xl bg-white/5 flex items-center justify-center p-1">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Libyan_dinar_-_10_dinar_-_obverse.jpg/1920px-Libyan_dinar_-_10_dinar_-_obverse.jpg" 
                alt="LYD" 
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <button 
        disabled={amount <= 0 || isPrinting}
        onClick={handlePrint}
        className={`group relative w-full py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl disabled:opacity-50 overflow-hidden border-2
          ${isPrinting ? 'bg-slate-800 text-orange-400 border-orange-500/50' : 
            'bg-slate-950 border-slate-800 text-orange-400 hover:bg-slate-900 hover:border-orange-500/50 active:scale-[0.98]'}`}
      >
        {isPrinting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="animate-pulse">جاري الطباعة...</span>
          </>
        ) : (
          <>
            <Printer className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span>طباعة إيصال يسر باي</span>
          </>
        )}
      </button>
    </div>
  );
};

export default YussorPayCalculator;
