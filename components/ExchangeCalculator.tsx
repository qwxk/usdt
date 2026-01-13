
import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Printer, Receipt, Coins, TrendingUp, ShoppingCart, Hash, MousePointer2, Cpu, Loader2 } from 'lucide-react';
import { printReceipt } from '../services/printService';

interface ExchangeCalculatorProps {
  onUpdateRates: (buy: number, sell: number, usdt: number) => void;
  initialUSDT: number;
}

type ValueSource = 'manual' | 'auto';

const ExchangeCalculator: React.FC<ExchangeCalculatorProps> = ({ onUpdateRates, initialUSDT }) => {
  const [usdtQuantity, setUsdtQuantity] = useState<number>(initialUSDT || 0);
  const [buyRate, setBuyRate] = useState<number>(0);
  const [sellRate, setSellRate] = useState<number>(0);
  const [buySource, setBuySource] = useState<ValueSource>('manual');
  const [sellSource, setSellSource] = useState<ValueSource>('manual');
  
  const [isPrintingDaily, setIsPrintingDaily] = useState(false);
  const [isPrintingReceipt, setIsPrintingReceipt] = useState(false);
  
  const totalBuyAmount = usdtQuantity * buyRate;
  const totalSellAmount = usdtQuantity * sellRate;

  useEffect(() => {
    onUpdateRates(buyRate, sellRate, usdtQuantity);
  }, [buyRate, sellRate, usdtQuantity, onUpdateRates]);

  const handleTotalSellChange = (value: number) => {
    if (usdtQuantity > 0) {
      setSellRate(value / usdtQuantity);
      setSellSource('auto');
    }
  };

  const handleTotalBuyChange = (value: number) => {
    if (usdtQuantity > 0) {
      setBuyRate(value / usdtQuantity);
      setBuySource('auto');
    }
  };

  const handleManualBuyRateChange = (value: number) => {
    setBuyRate(value);
    setBuySource('manual');
  };

  const handleManualSellRateChange = (value: number) => {
    setSellRate(value);
    setSellSource('manual');
  };

  const handlePrintDaily = () => {
    if (sellRate <= 0) return;
    setIsPrintingDaily(true);
    setTimeout(() => {
      printReceipt({
        type: 'DAILY_RATE',
        data: {
          sellRate,
          date: new Date().toLocaleString('ar-LY')
        }
      });
      setIsPrintingDaily(false);
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'تمت طباعة سعر اليوم بنجاح', type: 'success' } 
      }));
    }, 600);
  };

  const handlePrintReceipt = () => {
    if (usdtQuantity <= 0 || sellRate <= 0) return;
    setIsPrintingReceipt(true);
    setTimeout(() => {
      printReceipt({
        type: 'TRANSACTION',
        data: {
          netAmount: totalSellAmount,
          totalCharge: totalSellAmount,
          bankFee: 0,
          walletFee: 0,
          usdt: usdtQuantity,
          sellRate: sellRate,
          buyRate: buyRate,
          totalBuy: totalBuyAmount,
          totalSell: totalSellAmount,
          date: new Date().toLocaleString('ar-LY')
        }
      });
      setIsPrintingReceipt(false);
      window.dispatchEvent(new CustomEvent('app-toast', { 
        detail: { message: 'تمت طباعة إيصال الزبون بنجاح', type: 'success' } 
      }));
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass-card p-6 rounded-[2.5rem] shadow-2xl border border-slate-800 transition-all duration-500 focus-within:border-green-500/30 overflow-hidden relative">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[60px] rounded-full -translate-y-12 translate-x-12"></div>
        
        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="relative group/logo">
            {/* Logo Glow Effect */}
            <div className="absolute inset-0 bg-green-500/40 blur-xl rounded-full opacity-0 group-focus-within:opacity-50 transition-opacity duration-700 animate-pulse"></div>
            <div className="relative p-3 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-green-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform transition-all duration-500 group-focus-within:scale-110 group-focus-within:rotate-3 flex items-center justify-center w-16 h-16">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/USDT_Logo.png/1280px-USDT_Logo.png?20240524104709" 
                alt="USDT Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white leading-none tracking-tight">صرف USDT الذكي</h2>
              <div className="px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-md">
                <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">المصداقية</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 uppercase font-bold tracking-[0.1em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              نظام تحويل الأصول الرقمية
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-500 group-focus-within:scale-110 transition-all duration-300 z-10">
              <Coins className="w-7 h-7" />
            </div>
            <input 
              type="number" 
              className="w-full bg-slate-950/40 pr-16 pl-6 py-7 rounded-[2rem] border-2 border-slate-800 text-white focus:border-green-500 focus:ring-8 focus:ring-green-500/5 focus:shadow-[0_0_50px_rgba(34,197,94,0.15)] outline-none transition-all text-4xl font-black placeholder:text-slate-900 shadow-inner relative z-0"
              placeholder="0.00"
              value={usdtQuantity || ''}
              onChange={(e) => setUsdtQuantity(Number(e.target.value))}
            />
            <label className="absolute -top-2.5 right-6 px-3 bg-[#0f172a] text-[10px] font-black text-green-400 uppercase tracking-widest transition-all group-focus-within:text-white z-10 border border-slate-800 rounded-lg">
              كمية USDT المتوفرة
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-900/30 rounded-3xl border border-slate-800/50 space-y-4 focus-within:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-800/50 pb-2">
                <div className="flex items-center gap-2 text-orange-500">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">سعر الشراء (توفير السيولة)</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter transition-all duration-300 ${buySource === 'auto' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-500'}`}>
                  {buySource === 'auto' ? <Cpu className="w-2.5 h-2.5" /> : <MousePointer2 className="w-2.5 h-2.5" />}
                  {buySource === 'auto' ? 'حساب آلي' : 'يدوي'}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.001"
                    className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-white outline-none focus:border-orange-500/50 transition-all font-black text-center text-xl"
                    placeholder="سعر الوحدة"
                    value={buyRate ? Number(buyRate.toFixed(4)) : ''}
                    onChange={(e) => handleManualBuyRateChange(Number(e.target.value))}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-700 font-black">RATE</div>
                </div>

                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full bg-orange-500/5 p-4 rounded-xl border border-orange-500/10 text-orange-400 outline-none focus:border-orange-500/40 transition-colors font-black text-center text-2xl"
                    placeholder="إجمالي الشراء"
                    value={totalBuyAmount ? Number(totalBuyAmount.toFixed(2)) : ''}
                    onChange={(e) => handleTotalBuyChange(Number(e.target.value))}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-orange-900 font-black">TOTAL LYD</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-900/30 rounded-3xl border border-slate-800/50 space-y-4 focus-within:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-800/50 pb-2">
                <div className="flex items-center gap-2 text-blue-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">سعر البيع للزبائن</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter transition-all duration-300 ${sellSource === 'auto' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-500'}`}>
                  {sellSource === 'auto' ? <Cpu className="w-2.5 h-2.5" /> : <MousePointer2 className="w-2.5 h-2.5" />}
                  {sellSource === 'auto' ? 'حساب آلي' : 'يدوي'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.001"
                    className="w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-white outline-none focus:border-blue-500/50 transition-all font-black text-center text-xl"
                    placeholder="سعر الوحدة"
                    value={sellRate ? Number(sellRate.toFixed(4)) : ''}
                    onChange={(e) => handleManualSellRateChange(Number(e.target.value))}
                  />
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-700 font-black">RATE</div>
                </div>

                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 text-blue-400 outline-none focus:border-blue-500/40 transition-colors font-black text-center text-2xl"
                    placeholder="إجمالي المدفوع"
                    value={totalSellAmount ? Number(totalSellAmount.toFixed(2)) : ''}
                    onChange={(e) => handleTotalSellChange(Number(e.target.value))}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-blue-900 font-black">TOTAL LYD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button 
          disabled={sellRate <= 0 || isPrintingDaily}
          onClick={handlePrintDaily}
          className={`relative group overflow-hidden w-full py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50
            ${isPrintingDaily ? 'bg-green-900 text-green-300 border-green-800' : 'bg-green-600 text-white hover:bg-green-500 shadow-green-900/30'}`}
        >
          {isPrintingDaily ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : (
            <>
              <Printer className="w-7 h-7 group-hover:rotate-12 transition-transform" />
              <span>طباعة إعلان سعر اليوم</span>
            </>
          )}
        </button>

        <button 
          disabled={usdtQuantity <= 0 || sellRate <= 0 || isPrintingReceipt}
          onClick={handlePrintReceipt}
          className={`group relative overflow-hidden w-full py-6 border-2 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50
            ${isPrintingReceipt ? 'bg-slate-900 text-blue-400 border-blue-800' : 'bg-slate-950 border-slate-800 text-green-400 hover:bg-slate-900 hover:border-green-500/50'}`}
        >
          {isPrintingReceipt ? (
            <Loader2 className="w-7 h-7 animate-spin" />
          ) : (
            <>
              <Receipt className="w-7 h-7 group-hover:scale-110 transition-transform" />
              <span>طباعة إيصال صرف للزبون</span>
            </>
          )}
        </button>
      </div>

      <div className="p-5 bg-slate-900/40 rounded-[2rem] border border-slate-800/60 flex justify-between items-center transition-all duration-500 hover:border-blue-500/20 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-10 w-20 rounded-lg overflow-hidden border border-slate-700/50 shadow-lg bg-slate-950 flex items-center justify-center p-1 group">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Libyan_dinar_-_10_dinar_-_obverse.jpg/1920px-Libyan_dinar_-_10_dinar_-_obverse.jpg" 
              alt="LYD" 
              className="h-full w-full object-cover rounded group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">معدل الصرف المستهدف</span>
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-blue-500/50" />
              <span className="text-xs font-bold text-slate-400">USDT to LYD</span>
            </div>
          </div>
        </div>
        <div className="text-right">
           <p className="text-3xl font-black text-blue-400 tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            {sellRate > 0 ? sellRate.toFixed(3) : '0.000'}
           </p>
        </div>
      </div>
    </div>
  );
};

export default ExchangeCalculator;
