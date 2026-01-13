
export interface WalletState {
  requiredAmount: number;
  bankFeePercent: number;
  walletFeePercent: number;
}

export interface ExchangeState {
  totalPaid: number;
  totalBuy: number;
  usdtQuantity: number;
}

export interface ProfitState {
  manualBuyRate?: number;
  manualSellRate?: number;
  usdtQuantity: number;
}

export interface POSTransaction {
  id: string;
  usdtAmount: number;
  sellRate: number;
  buyRate: number;
  totalLyd: number;
  profit: number;
  binanceId: string;
  date: string;
}

export enum TabType {
  WALLET = 'WALLET',
  YUSSOR_PAY = 'YUSSOR_PAY',
  EXCHANGE = 'EXCHANGE',
  POS = 'POS',
  PROFIT = 'PROFIT',
}
