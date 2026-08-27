export type PaymentMethod = 'Pix' | 'Cartão' | 'Mercado Pago' | 'Outro';

export type SaleStatus = 'Concluída' | 'Pendente' | 'Cancelada';

export type AccountCategory = 'Streaming' | 'Jogos' | 'Produtividade' | 'Redes Sociais' | 'Outro';

export interface Sale {
  id: string;
  accountName: string;
  accountCategory: AccountCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  status: SaleStatus;
  notes?: string;
  createdAt: string; // ISO string
}

export type PeriodFilter = 
  | 'today' 
  | '7days' 
  | 'this_week' 
  | '30days' 
  | 'this_month' 
  | 'last_month' 
  | 'custom';

export interface CustomDateRange {
  startDate: string;
  endDate: string;
}

export interface SalesGoal {
  targetSalesCount: number;
  targetRevenue: number;
  month: string; // YYYY-MM
}

export interface UserProfile {
  name: string;
  email: string;
  businessName: string;
  avatarUrl?: string;
  currency: string;
  soundEnabled: boolean;
}

export interface PeriodMetrics {
  revenue: number;
  salesCount: number;
  averageTicket: number;
  growthRate: number; // percentage vs previous matching period
  prevRevenue: number;
  prevSalesCount: number;
  prevAverageTicket: number;
}

export type TabType = 'dashboard' | 'vendas' | 'relatorios' | 'metas' | 'configuracoes';

export interface ChartDataPoint {
  dateKey: string;
  label: string;
  fullDate: string;
  revenue: number;
  salesCount: number;
}

export interface SummaryCardData {
  salesCount: number;
  revenue: number;
  averageTicket: number;
  comparisonPercentage: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}
