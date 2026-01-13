
import React, { useState, useMemo } from 'react';
import { Calculator, Printer, ShieldCheck, Banknote, Landmark, Loader2, RefreshCcw, Coins, FileText } from 'lucide-react';
import { printReceipt } from '../services/printService';

const WalletCalculator: React.FC = () => {
  const [requiredAmount, setRequiredAmount] = useState<number>(0);
  const [usdtAmount, setUsdtAmount] = useState<number>(0);
  const [isPrintingReceipt, setIsPrintingReceipt] = useState(false);
  const [isPrintingRate, setIsPrintingRate] = useState(false);
  
  const BANK_FEE_PERCENT = 3.0;
  const WALLET_FEE_PERCENT = 1.0;

  const calculations = useMemo(() => {
    const bankFee = (requiredAmount * BANK_FEE_PERCENT) / 100;
    const walletFee = (requiredAmount * WALLET_FEE_PERCENT) / 100;
    const totalCharge = requiredAmount + bankFee + walletFee;
    const buyRate = usdtAmount > 0 ? totalCharge / usdtAmount : 0;
    
    return { bankFee, walletFee, totalCharge, buyRate };
  }, [requiredAmount, usdtAmount]);

  const handlePrintFullReceipt = async () => {
    if (requiredAmount <= 0) return;
    setIsPrintingReceipt(true);
    
    setTimeout(() => {
      printReceipt({
        type: 'TRANSACTION',
        data: {
          netAmount: requiredAmount,
          totalCharge: calculations.totalCharge,
          bankFee: calculations.bankFee,
          walletFee: calculations.walletFee,
          date: new Date().toLocaleString('ar-LY')
        }
      });
      setIsPrintingReceipt(false);
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'تمت طباعة إيصال الشحن بنجاح', type: 'success' } 
      }));
    }, 800);
  };

  const handlePrintBuyRateOnly = async () => {
    if (calculations.buyRate <= 0) return;
    setIsPrintingRate(true);
    
    setTimeout(() => {
      printReceipt({
        type: 'BUY_RATE',
        data: {
          buyRate: calculations.buyRate,
          date: new Date().toLocaleString('ar-LY')
        }
      });
      setIsPrintingRate(false);
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'تمت طباعة سعر صرف الشراء فقط', type: 'success' } 
      }));
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card p-6 rounded-[2rem] shadow-xl border border-slate-800 transition-all duration-500 focus-within:border-blue-500/50 focus-within:shadow-[0_0_30px_rgba(59,130,246,0.15)] group/card">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-focus-within/card:scale-110 transition-transform duration-300 flex items-center justify-center">
              <img 
                src="https://i.postimg.cc/d3gRsDT0/tnzyl.webp" 
                alt="Wallet" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-none">شحن محفظة</h2>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Wallet Charge System</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700">عمولة ثابتة 4%</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative group">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 group-focus-within:scale-110 transition-all duration-300 z-10">
                <Banknote className="w-6 h-6" />
              </div>
              <input 
                type="number" 
                className="w-full bg-slate-900/50 pr-14 pl-6 py-6 rounded-2xl border-2 border-slate-800 text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-2xl font-black placeholder:text-slate-800 shadow-inner relative z-0"
                placeholder="0.00"
                value={requiredAmount || ''}
                onChange={(e) => setRequiredAmount(Number(e.target.value))}
                autoFocus
              />
              <label className="absolute -top-2 right-4 px-2 bg-slate-950 text-[10px] font-black text-blue-400 uppercase tracking-widest transition-all group-focus-within:text-blue-300 z-10">
                المبلغ المراد شحنه (دينار)
              </label>
            </div>

            <div className="relative group">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-400 group-focus-within:scale-110 transition-all duration-300 z-10">
                <Coins className="w-6 h-6" />
              </div>
              <input 
                type="number" 
                className="w-full bg-slate-900/50 pr-14 pl-6 py-6 rounded-2xl border-2 border-slate-800 text-white focus:border-green-400 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-2xl font-black placeholder:text-slate-800 shadow-inner relative z-0"
                placeholder="0.00"
                value={usdtAmount || ''}
                onChange={(e) => setUsdtAmount(Number(e.target.value))}
              />
              <label className="absolute -top-2 right-4 px-2 bg-slate-950 text-[10px] font-black text-green-400 uppercase tracking-widest transition-all group-focus-within:text-green-300 z-10">
                كمية USDT المستهدفة
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-2xl border border-slate-800/50">
              <Landmark className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase">المصرف</p>
                <p className="text-sm font-black text-slate-300">{BANK_FEE_PERCENT}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-2xl border border-slate-800/50">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase">المحفظة</p>
                <p className="text-sm font-black text-slate-300">{WALLET_FEE_PERCENT}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Exchange Rate Display */}
      {calculations.buyRate > 0 && (
        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center justify-between animate-in zoom-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <RefreshCcw className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">سعر صرف الشراء</p>
              <p className="text-xs font-bold text-slate-400">بناءً على التكلفة الإجمالية</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white tracking-tighter tabular-nums">
              {calculations.buyRate.toFixed(3)}
            </p>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">LYD / 1 USDT</p>
          </div>
        </div>
      )}

      <div className="relative group overflow-hidden rounded-[2rem] transition-transform duration-500 hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative p-8 text-white space-y-5">
          <div className="flex justify-between items-center opacity-70">
            <span className="text-xs font-bold uppercase tracking-widest">تفاصيل العمولات</span>
            <div className="h-px flex-1 mx-4 bg-white/20"></div>
            <span className="text-xs font-black">د.ل</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] opacity-60 font-bold mb-1">عمولة المصرف</p>
              <p className="text-xl font-black">{calculations.bankFee.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] opacity-60 font-bold mb-1">عمولة المحفظة</p>
              <p className="text-xl font-black">{calculations.walletFee.toFixed(2)}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-blue-200">الإجمالي النهائي للدفع</p>
              <h3 className="text-5xl font-black tracking-tighter tabular-nums transition-all duration-300 group-hover:scale-105 origin-right">
                {calculations.totalCharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="relative h-14 w-28 rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 flex items-center justify-center p-1">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Libyan_dinar_-_10_dinar_-_obverse.jpg/1920px-Libyan_dinar_-_10_dinar_-_obverse.jpg" 
                alt="LYD" 
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          disabled={requiredAmount <= 0 || isPrintingReceipt}
          onClick={handlePrintFullReceipt}
          className={`group relative w-full py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-xl disabled:opacity-50 overflow-hidden border-2
            ${isPrintingReceipt ? 'bg-slate-800 text-blue-400 border-blue-500/50' : 
              'bg-slate-950 border-slate-800 text-blue-400 hover:bg-slate-900 hover:border-blue-500/50 active:scale-[0.98]'}`}
        >
          {isPrintingReceipt ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Printer className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          )}
          <span>طباعة إيصال الشحن</span>
        </button>

        <button 
          disabled={calculations.buyRate <= 0 || isPrintingRate}
          onClick={handlePrintBuyRateOnly}
          className={`group relative w-full py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-xl disabled:opacity-50 overflow-hidden border-2
            ${isPrintingRate ? 'bg-slate-800 text-green-400 border-green-500/50' : 
              'bg-slate-950 border-slate-800 text-green-400 hover:bg-slate-900 hover:border-green-500/50 active:scale-[0.98]'}`}
        >
          {isPrintingRate ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          )}
          <span>طباعة سعر الصرف فقط</span>
        </button>
      </div>

      <div className="text-center opacity-30">
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em]">نظام الطباعة الحرارية 58 مم</p>
      </div>
    </div>
  );
};

export default WalletCalculator;
