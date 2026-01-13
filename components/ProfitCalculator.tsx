
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, MinusCircle, Lightbulb, Check, History, Trash2, Smile, Frown, Meh, Laugh } from 'lucide-react';
import { POSTransaction } from '../types';

interface ProfitCalculatorProps {
  buyRate: number;
  sellRate: number;
  usdtQuantity: number;
}

const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ buyRate: initialBuy, sellRate: initialSell, usdtQuantity: initialQty }) => {
  const [bRate, setBRate] = useState(initialBuy);
  const [sRate, setSRate] = useState(initialSell);
  const [qty, setQty] = useState(initialQty);
  const [isTipApplied, setIsTipApplied] = useState(false);
  const [history, setHistory] = useState<POSTransaction[]>([]);

  useEffect(() => {
    setBRate(initialBuy);
    setSRate(initialSell);
    setQty(initialQty);
    setIsTipApplied(false);
    
    // Load POS History
    const savedHistory = JSON.parse(localStorage.getItem('pos_history') || '[]');
    setHistory(savedHistory);
  }, [initialBuy, initialSell, initialQty]);

  const currentProfit = (sRate - bRate) * qty;

  const totalHistoryProfit = useMemo(() => {
    return history.reduce((sum, item) => sum + item.profit, 0);
  }, [history]);

  const clearHistory = () => {
    if (window.confirm('هل أنت متأكد من مسح سجل المبيعات بالكامل؟')) {
      localStorage.removeItem('pos_history');
      setHistory([]);
    }
  };

  const getStatus = (val: number) => {
    // Excellent Profit
    if (val >= 50) return { 
      label: 'ربح ممتاز', 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/30', 
      icon: Laugh,
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]'
    };
    // Good Profit
    if (val > 0.001) return { 
      label: 'ربح جيد', 
      color: 'text-green-400', 
      bg: 'bg-green-500/10', 
      border: 'border-green-500/30', 
      icon: Smile,
      glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]'
    };
    // Loss
    if (val < -0.001) return { 
      label: 'خاسر', 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/10', 
      border: 'border-rose-500/30', 
      icon: Frown,
      glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]'
    };
    // Neutral
    return { 
      label: 'لا يوجد ربح', 
      color: 'text-slate-400', 
      bg: 'bg-slate-500/10', 
      border: 'border-slate-500/30', 
      icon: Meh,
      glow: ''
    };
  };

  const status = getStatus(currentProfit);

  const smartTip = useMemo(() => {
    if (bRate <= 0 || qty <= 0) return null;
    const targetMargin = 0.02; 
    let suggestedRate = bRate * (1 + targetMargin);
    if (sRate >= suggestedRate - 0.001) {
      suggestedRate = sRate + 0.015;
    }
    const roundedRate = Math.ceil(suggestedRate * 200) / 200;
    const potentialProfit = (roundedRate - bRate) * qty;

    return {
      rate: roundedRate,
      profit: potentialProfit,
      increase: roundedRate - sRate
    };
  }, [bRate, sRate, qty]);

  const handleApplyTip = () => {
    if (smartTip && !isTipApplied) {
      setSRate(smartTip.rate);
      setIsTipApplied(true);
    }
  };

  const formattedProfit = currentProfit.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });

  const getFontSizeClass = (text: string) => {
    if (text.length > 12) return 'text-3xl sm:text-4xl md:text-5xl';
    if (text.length > 8) return 'text-4xl sm:text-5xl md:text-6xl';
    return 'text-5xl sm:text-6xl md:text-7xl';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Current Analysis */}
      <div className="glass-card p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">تحليل أرباح المكتب</h2>
          </div>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">إجمالي مكسب السجل</p>
            <p className="text-sm font-black text-white">{totalHistoryProfit.toFixed(2)} د.ل</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 mr-1 uppercase tracking-widest">سعر الشراء</label>
            <input 
              type="number" 
              className="w-full bg-slate-900/50 p-3 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 font-bold transition-all text-center placeholder:text-slate-800"
              value={bRate || ''}
              placeholder="0.000"
              onChange={(e) => {
                  setBRate(Number(e.target.value));
                  setIsTipApplied(false);
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 mr-1 uppercase tracking-widest">سعر البيع</label>
            <input 
              type="number" 
              className="w-full bg-slate-900/50 p-3 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 font-bold transition-all text-center placeholder:text-slate-800"
              value={sRate || ''}
              placeholder="0.000"
              onChange={(e) => {
                  setSRate(Number(e.target.value));
                  setIsTipApplied(false);
              }}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="block text-[10px] font-black text-slate-500 mr-1 uppercase tracking-widest">الكمية الإجمالية (USDT)</label>
            <input 
              type="number" 
              className="w-full bg-slate-950 p-4 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-purple-500 font-black text-2xl shadow-inner transition-all text-center placeholder:text-slate-900"
              value={qty || ''}
              placeholder="0.00"
              onChange={(e) => {
                  setQty(Number(e.target.value));
                  setIsTipApplied(false);
              }}
            />
          </div>
        </div>

        {/* Dynamic Status View */}
        <div className={`p-6 sm:p-8 rounded-[2.5rem] border-2 transition-all duration-700 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[250px] ${status.bg} ${status.border} ${status.glow}`}>
          
          {/* Animated Background Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none scale-[2] blur-sm transition-transform duration-700">
            <status.icon className="w-32 h-32" />
          </div>
          
          <div className="relative z-10 w-full flex flex-col items-center gap-4">
            {/* Status Header with Icon */}
            <div className={`flex items-center gap-3 py-2 px-6 rounded-full bg-slate-950/80 border border-white/5 shadow-2xl animate-in zoom-in duration-500 ${status.color}`}>
              <status.icon className="w-5 h-5 shrink-0" />
              <span className="text-xs font-black uppercase tracking-widest">
                {status.label}
              </span>
            </div>
            
            {/* Profit Value */}
            <div className="w-full flex flex-col items-center justify-center">
              <div className="flex items-baseline justify-center gap-3 w-full px-2 max-w-full">
                <span className={`font-black tracking-tighter tabular-nums break-all transition-all duration-300 drop-shadow-sm ${status.color} ${getFontSizeClass(formattedProfit)}`}>
                  {formattedProfit}
                </span>
                <span className={`text-lg sm:text-2xl font-bold ${status.color} opacity-60 shrink-0 uppercase tracking-tighter`}>د.ل</span>
              </div>
              <p className="mt-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] opacity-80 max-w-[200px] leading-relaxed">
                صافي الربح المتوقع لهذه العملية
              </p>
            </div>
          </div>
        </div>

        {/* Smart Tip */}
        {smartTip && qty > 0 && Math.abs(smartTip.rate - sRate) > 0.0001 && (
          <div className={`mt-6 relative overflow-hidden p-5 rounded-2xl transition-all duration-500 border ${isTipApplied ? 'bg-green-500/5 border-green-500/20 opacity-90' : 'bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20'} group/tip`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`p-3 rounded-xl transition-all duration-300 ${isTipApplied ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400 group-hover/tip:scale-110'}`}>
                {isTipApplied ? <Check className="w-6 h-6" /> : <Lightbulb className="w-6 h-6 animate-pulse" />}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold text-slate-200 leading-tight">
                  {isTipApplied ? (
                    <>تم ضبط السعر بنجاح.</>
                  ) : (
                    <>قم بالبيع بسعر <span className="text-blue-400 font-black text-lg">{smartTip.rate.toFixed(3)}</span> لتحصل على ربح <span className="text-green-400 font-black text-lg">{Math.round(smartTip.profit)} د.ل</span></>
                  )}
                </p>
              </div>
              {!isTipApplied && (
                <button 
                  onClick={handleApplyTip}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-[11px] font-black transition-all shadow-lg"
                >
                  تطبيق
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sales Record */}
      <div className="glass-card p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="font-black text-white text-sm uppercase">سجل المبيعات الأخير</h3>
          </div>
          <button 
            onClick={clearHistory}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {history.length === 0 ? (
            <p className="text-center py-10 text-slate-600 text-xs font-bold uppercase tracking-widest">لا توجد عمليات مسجلة</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-slate-700 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-white">{item.usdtAmount.toFixed(2)} USDT</span>
                    <span className="text-[9px] text-slate-500 font-bold">{item.date}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 uppercase font-black">Binance: <span className="text-slate-400">{item.binanceId}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-black text-green-400">+{item.profit.toFixed(2)} د.ل</p>
                  <p className="text-[8px] text-slate-500 font-bold">بمعدل {item.sellRate.toFixed(3)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitCalculator;
