import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Calculator,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { PeriodMetrics } from '../types';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';

interface MetricCardsProps {
  metrics: PeriodMetrics;
  periodLabel: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, periodLabel }) => {
  const isPositiveGrowth = metrics.growthRate > 0;
  const isNegativeGrowth = metrics.growthRate < 0;
  const isNeutralGrowth = metrics.growthRate === 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* 1. Faturamento Total */}
      <div
        id="card-metric-revenue"
        className="group relative overflow-hidden rounded-2xl glass-panel p-5 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-emerald-950/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Faturamento
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/25 group-hover:scale-110 transition-transform">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-white font-numeric tracking-tight">
            {formatCurrency(metrics.revenue)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Total faturado</span>
            <span className="text-[11px] text-slate-500">({periodLabel})</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. Contas Vendidas */}
      <div
        id="card-metric-sales-count"
        className="group relative overflow-hidden rounded-2xl glass-panel p-5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-cyan-950/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Contas Vendidas
          </span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/25 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-white font-numeric tracking-tight">
            {formatNumber(metrics.salesCount)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Contas vendidas</span>
            <span className="text-[11px] text-slate-500">({periodLabel})</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 3. Ticket Médio */}
      <div
        id="card-metric-ticket"
        className="group relative overflow-hidden rounded-2xl glass-panel p-5 border border-white/10 hover:border-teal-500/40 transition-all duration-300 shadow-lg hover:shadow-teal-950/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Ticket Médio
          </span>
          <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center border border-teal-500/25 group-hover:scale-110 transition-transform">
            <Calculator className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black text-white font-numeric tracking-tight">
            {formatCurrency(metrics.averageTicket)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Faturamento ÷ contas</span>
            <span className="text-[11px] text-slate-500">méd./conta</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500/0 via-teal-500/50 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 4. Crescimento */}
      <div
        id="card-metric-growth"
        className="group relative overflow-hidden rounded-2xl glass-panel p-5 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Crescimento
          </span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform ${
              isPositiveGrowth
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                : isNegativeGrowth
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/25'
                : 'bg-slate-500/15 text-slate-400 border-slate-500/25'
            }`}
          >
            {isPositiveGrowth && <TrendingUp className="w-4 h-4" />}
            {isNegativeGrowth && <TrendingDown className="w-4 h-4" />}
            {isNeutralGrowth && <Minus className="w-4 h-4" />}
          </div>
        </div>

        <div className="mt-3">
          <div
            className={`text-2xl sm:text-3xl font-black font-numeric tracking-tight flex items-baseline gap-1.5 ${
              isPositiveGrowth
                ? 'text-emerald-400'
                : isNegativeGrowth
                ? 'text-rose-400'
                : 'text-slate-300'
            }`}
          >
            {formatPercentage(metrics.growthRate)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>vs. período anterior</span>
            <span className="text-[11px] text-slate-500">
              ({formatCurrency(metrics.prevRevenue)})
            </span>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
            isPositiveGrowth
              ? 'bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0'
              : isNegativeGrowth
              ? 'bg-gradient-to-r from-rose-500/0 via-rose-500/50 to-rose-500/0'
              : 'bg-gradient-to-r from-slate-500/0 via-slate-500/50 to-slate-500/0'
          }`}
        />
      </div>
    </div>
  );
};
