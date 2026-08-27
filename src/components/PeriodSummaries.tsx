import React from 'react';
import {
  CalendarDays,
  CalendarRange,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Calculator,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Sale } from '../types';
import { calculateWeekSummary, calculateMonthSummary } from '../utils/metrics';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';

interface PeriodSummariesProps {
  sales: Sale[];
}

export const PeriodSummaries: React.FC<PeriodSummariesProps> = ({ sales }) => {
  const weekSummary = calculateWeekSummary(sales);
  const monthSummary = calculateMonthSummary(sales);

  const isWeekPositive = weekSummary.comparisonPercentage >= 0;
  const isMonthPositive = monthSummary.comparisonPercentage >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 1. Resumo da Semana */}
      <div
        id="card-summary-week"
        className="relative overflow-hidden rounded-2xl glass-panel p-5 sm:p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Resumo da semana</h3>
              <p className="text-xs text-slate-400">Segunda a Domingo (Semana Vigente)</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              isWeekPositive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {isWeekPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{formatPercentage(weekSummary.comparisonPercentage)}</span>
          </div>
        </div>

        {/* 3 Metric columns inside */}
        <div className="grid grid-cols-3 gap-2.5 my-4 pt-1">
          {/* Contas vendidas */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Contas vendidas
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-numeric">
              {formatNumber(weekSummary.salesCount)}
            </div>
          </div>

          {/* Faturamento */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Faturamento
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-400 font-numeric truncate">
              {formatCurrency(weekSummary.revenue)}
            </div>
          </div>

          {/* Ticket médio */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Ticket médio
            </div>
            <div className="text-lg sm:text-xl font-black text-teal-300 font-numeric truncate">
              {formatCurrency(weekSummary.averageTicket)}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
          <span className="flex items-center gap-1 text-slate-400">
            Comparação: <strong className={isWeekPositive ? 'text-emerald-400' : 'text-rose-400'}>{formatPercentage(weekSummary.comparisonPercentage)}</strong>
          </span>
          <span className="text-[11px] text-slate-500">vs. semana anterior</span>
        </div>
      </div>

      {/* 2. Resumo do Mês */}
      <div
        id="card-summary-month"
        className="relative overflow-hidden rounded-2xl glass-panel p-5 sm:p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 shadow-xl"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <CalendarRange className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Resumo do mês</h3>
              <p className="text-xs text-slate-400">Total acumulado neste mês calendário</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              isMonthPositive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {isMonthPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{formatPercentage(monthSummary.comparisonPercentage)}</span>
          </div>
        </div>

        {/* 3 Metric columns inside */}
        <div className="grid grid-cols-3 gap-2.5 my-4 pt-1">
          {/* Contas vendidas */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Contas vendidas
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-numeric">
              {formatNumber(monthSummary.salesCount)}
            </div>
          </div>

          {/* Faturamento */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Faturamento
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-400 font-numeric truncate">
              {formatCurrency(monthSummary.revenue)}
            </div>
          </div>

          {/* Ticket médio */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Ticket médio
            </div>
            <div className="text-lg sm:text-xl font-black text-teal-300 font-numeric truncate">
              {formatCurrency(monthSummary.averageTicket)}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
          <span className="flex items-center gap-1 text-slate-400">
            Comparação: <strong className={isMonthPositive ? 'text-emerald-400' : 'text-rose-400'}>{formatPercentage(monthSummary.comparisonPercentage)}</strong>
          </span>
          <span className="text-[11px] text-slate-500">vs. mês anterior</span>
        </div>
      </div>
    </div>
  );
};
