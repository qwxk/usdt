
type PrintData = {
  netAmount?: number;
  totalCharge?: number;
  bankFee?: number;
  walletFee?: number;
  usdt?: number;
  sellRate?: number;
  buyRate?: number; // Removed from visible template
  binanceId?: string;
  totalBuy?: number; // Removed from visible template
  totalSell?: number;
  date: string;
};

type DailyRateData = {
  sellRate: number;
  date: string;
};

export type PrintParams = 
  | { type: 'TRANSACTION'; data: PrintData }
  | { type: 'DAILY_RATE'; data: DailyRateData }
  | { type: 'USDT_POS'; data: PrintData };

export const printReceipt = (params: PrintParams) => {
  const container = document.getElementById('print-section');
  if (!container) return;

  const logoUrl = "https://g.top4top.io/p_36302vlm50.jpg";

  if (params.type === 'TRANSACTION') {
    const { 
      netAmount, 
      totalCharge, 
      bankFee, 
      walletFee, 
      usdt, 
      sellRate, 
      totalSell,
      date 
    } = params.data;
    
    const isYussor = (walletFee === 0 && !usdt);
    const feeTitle = isYussor ? "عمولة الخدمة:" : "عمولة المصرف:";

    container.innerHTML = `
      <div style="font-family: 'Cairo', sans-serif; width: 100%; color: #000; padding: 5px; direction: rtl;">
        <div style="text-align: center; margin-bottom: 15px;">
          <img src="${logoUrl}" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 5px;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 900;">المصداقية للإلكترونيات</h2>
          <p style="margin: 2px 0; font-size: 10px; font-weight: bold;">إيصال مالي معتمد</p>
          <div style="border-bottom: 2px solid #000; margin: 10px 0;"></div>
          <p style="font-size: 9px; margin: 0;">التاريخ: ${date}</p>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">
            <span>المبلغ المستلم:</span>
            <span><b>${netAmount?.toLocaleString(undefined, {minimumFractionDigits: 2})} د.ل</b></span>
          </div>
          
          <div style="background: #f0f0f0; padding: 10px; border: 1px solid #000; border-radius: 4px; text-align: center; margin: 10px 0;">
            <p style="margin: 0; font-size: 10px; font-weight: 900;">إجمالي المبلغ للدفع</p>
            <h1 style="margin: 5px 0; font-size: 24px; font-weight: 900;">${totalCharge?.toLocaleString(undefined, {minimumFractionDigits: 2})} د.ل</h1>
          </div>
        </div>

        <div style="font-size: 10px; border: 1px dashed #000; padding: 8px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>${feeTitle}</span>
            <span>${bankFee?.toFixed(2)} د.ل</span>
          </div>
          ${walletFee && walletFee > 0 ? `
          <div style="display: flex; justify-content: space-between;">
            <span>عمولة المحفظة:</span>
            <span>${walletFee?.toFixed(2)} د.ل</span>
          </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 20px; border-top: 1px solid #000; padding-top: 10px;">
          <p style="margin: 0; font-size: 11px; font-weight: 900;">شكراً لتعاملكم معنا</p>
          <p style="margin: 4px 0 0 0; font-size: 8px; opacity: 0.7;">نسعى دائماً لتقديم الأفضل بصدق وأمانة</p>
        </div>
      </div>
    `;
  } else if (params.type === 'USDT_POS') {
    const { usdt, sellRate, binanceId, totalSell, date } = params.data;
    container.innerHTML = `
      <div style="font-family: 'Cairo', sans-serif; width: 100%; color: #000; padding: 5px; direction: rtl;">
        <div style="text-align: center; margin-bottom: 15px;">
          <img src="${logoUrl}" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 5px;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 900;">المصداقية للإلكترونيات</h2>
          <p style="margin: 2px 0; font-size: 10px; font-weight: bold;">إيصال بيع USDT</p>
          <div style="border-bottom: 2px solid #000; margin: 10px 0;"></div>
          <p style="font-size: 9px; margin: 0;">التاريخ: ${date}</p>
        </div>

        <div style="margin-bottom: 15px; border: 1px solid #000; padding: 10px; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
            <span>كمية USDT:</span>
            <span><b>${usdt?.toFixed(2)}</b></span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
            <span>سعر الصرف:</span>
            <span><b>${sellRate?.toFixed(3)}</b></span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; border-top: 1px solid #eee; padding-top: 8px;">
            <span>مستلم Binance:</span>
            <span style="font-family: monospace; font-size: 10px;"><b>${binanceId}</b></span>
          </div>
        </div>

        <div style="background: #000; color: #fff; padding: 12px; border-radius: 4px; text-align: center; margin: 10px 0;">
          <p style="margin: 0; font-size: 10px; font-weight: 400;">الإجمالي المدفوع بالدينار</p>
          <h1 style="margin: 5px 0; font-size: 26px; font-weight: 900;">${totalSell?.toLocaleString(undefined, {minimumFractionDigits: 2})} د.ل</h1>
        </div>

        <div style="text-align: center; margin-top: 20px; border-top: 1px solid #000; padding-top: 10px;">
          <p style="margin: 0; font-size: 11px; font-weight: 900;">عملية بيع موثقة</p>
          <p style="margin: 4px 0 0 0; font-size: 8px; opacity: 0.7;">يرجى التأكد من وصول الرصيد إلى محفظتكم</p>
        </div>
      </div>
    `;
  } else {
    const { sellRate, date } = params.data;
    container.innerHTML = `
      <div style="font-family: 'Cairo', sans-serif; width: 100%; color: #000; padding: 10px; text-align: center; border: 2px solid #000; border-radius: 8px; direction: rtl;">
        <img src="${logoUrl}" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 5px;">
        <h2 style="margin: 0; font-size: 16px;">المصداقية للإلكترونيات</h2>
        <p style="font-size: 10px; margin: 5px 0;">إيصال عرض سعر اليوم</p>
        <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
        
        <p style="margin: 0; font-size: 14px; font-weight: bold;">سعر البيع الحالي:</p>
        <div style="margin: 15px 0;">
          <span style="font-size: 48px; font-weight: 900; line-height: 1;">${sellRate.toFixed(3)}</span>
          <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: 900; background: #000; color: #fff; display: inline-block; padding: 2px 10px; border-radius: 4px;">دينار ليبي</p>
        </div>
        
        <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
        <p style="font-size: 10px; font-weight: bold;">بتاريخ: ${date}</p>
      </div>
    `;
  }

  window.print();
};
