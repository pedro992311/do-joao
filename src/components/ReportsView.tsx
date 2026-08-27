import React, { useState } from 'react';
import {
  Download,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Award,
  CreditCard,
  PieChart as PieChartIcon,
  BarChart3,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Sale } from '../types';
import { calculateReportsData, calculateMetricsForPeriod } from '../utils/metrics';
import { formatCurrency, formatNumber, formatDateBR, formatPercentage } from '../utils/formatters';
import { StorageService } from '../services/storage';

interface ReportsViewProps {
  sales: Sale[];
  onNotify: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

const COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#a855f7', '#f59e0b'];

export const ReportsView: React.FC<ReportsViewProps> = ({ sales, onNotify }) => {
  const [reportPeriod, setReportPeriod] = useState<'all' | '30days' | 'this_month' | 'last_month'>('all');

  const filteredSales = React.useMemo(() => {
    if (reportPeriod === 'all') return sales;
    const metrics = calculateMetricsForPeriod(sales, reportPeriod);
    return sales.filter((s) => s.status === 'Concluída');
  }, [sales, reportPeriod]);

  const reportsData = calculateReportsData(filteredSales);

  const dailyMetrics = calculateMetricsForPeriod(sales, 'today');
  const weeklyMetrics = calculateMetricsForPeriod(sales, 'this_week');
  const monthlyMetrics = calculateMetricsForPeriod(sales, 'this_month');

  const handleExportCSV = () => {
    try {
      const csv = StorageService.exportToCSV(sales);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `vaultpay_relatorio_vendas_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onNotify('success', 'Relatório CSV exportado com sucesso!', 'O arquivo foi baixado no seu dispositivo.');
    } catch (e) {
      onNotify('error', 'Erro ao exportar relatório', 'Tente novamente.');
    }
  };

  return (
    <div id="view-reports-page" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Inteligência Financeira
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Relatórios e Análise de Vendas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Consolidado executivo com detalhamento de faturamento, ticket e canais de pagamento
          </p>
        </div>

        {/* Export Button */}
        <button
          id="btn-export-report-csv"
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório CSV</span>
        </button>
      </div>

      {/* 3 Executive High-level Cards (Diário, Semanal, Mensal) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Diário */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
            <span>Faturamento Diário (Hoje)</span>
            <span className="text-emerald-400">❖ Hoje</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-numeric mt-2">
            {formatCurrency(dailyMetrics.revenue)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>{dailyMetrics.salesCount} contas vendidas</span>
            <span className="text-emerald-400 font-bold">
              Méd. {formatCurrency(dailyMetrics.averageTicket)}
            </span>
          </div>
        </div>

        {/* Semanal */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
            <span>Faturamento Semanal</span>
            <span className="text-cyan-400 font-bold">
              {formatPercentage(weeklyMetrics.growthRate)}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-numeric mt-2">
            {formatCurrency(weeklyMetrics.revenue)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>{weeklyMetrics.salesCount} contas vendidas</span>
            <span className="text-cyan-400 font-bold">
              Méd. {formatCurrency(weeklyMetrics.averageTicket)}
            </span>
          </div>
        </div>

        {/* Mensal */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
            <span>Faturamento Mensal</span>
            <span className="text-emerald-400 font-bold">
              {formatPercentage(monthlyMetrics.growthRate)}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-numeric mt-2">
            {formatCurrency(monthlyMetrics.revenue)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>{monthlyMetrics.salesCount} contas vendidas</span>
            <span className="text-teal-300 font-bold">
              Méd. {formatCurrency(monthlyMetrics.averageTicket)}
            </span>
          </div>
        </div>
      </div>

      {/* Record Highlights: Melhor Dia e Melhor Mês */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Melhor dia de vendas */}
        <div className="p-5 rounded-2xl glass-panel-elevated border border-amber-500/30 bg-gradient-to-br from-[#1a170f]/80 to-[#0e1626]/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-amber-500/20 pointer-events-none">
            <Award className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Melhor Dia de Vendas (Recorde)</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white font-numeric">
              {formatCurrency(reportsData.bestDay.revenue)}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Data: <strong className="text-amber-300">{formatDateBR(reportsData.bestDay.date) || 'Hoje'}</strong> •{' '}
              {reportsData.bestDay.count} contas vendidas em um único dia
            </div>
          </div>
        </div>

        {/* Melhor mês de vendas */}
        <div className="p-5 rounded-2xl glass-panel-elevated border border-emerald-500/30 bg-gradient-to-br from-[#0c1c17]/80 to-[#0e1626]/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-emerald-500/20 pointer-events-none">
            <Sparkles className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Melhor Mês Histórico</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white font-numeric">
              {formatCurrency(reportsData.bestMonth.revenue)}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Mês: <strong className="text-emerald-300">{reportsData.bestMonth.month || 'Mês Vigente'}</strong> •{' '}
              {reportsData.bestMonth.count} contas comercializadas no período
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown by Payment Method & Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Vendas por Método de Pagamento</h3>
            </div>
            <span className="text-xs text-slate-400">Total Faturado</span>
          </div>

          <div className="space-y-3">
            {reportsData.methodBreakdown.map((m, idx) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    {m.name}
                  </span>
                  <span className="font-numeric font-bold text-white">
                    {formatCurrency(m.revenue)}{' '}
                    <span className="text-xs text-slate-400 font-normal">
                      ({m.count} vendas • {m.percentage.toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${m.percentage}%`,
                      backgroundColor: COLORS[idx % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Vendas por Categoria de Conta</h3>
            </div>
            <span className="text-xs text-slate-400">Volume</span>
          </div>

          <div className="space-y-3">
            {reportsData.categoryBreakdown.map((cat, idx) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[(idx + 1) % COLORS.length] }}
                    />
                    {cat.name}
                  </span>
                  <span className="font-numeric font-bold text-white">
                    {formatCurrency(cat.revenue)}{' '}
                    <span className="text-xs text-slate-400 font-normal">
                      ({cat.count} un • {cat.percentage.toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: COLORS[(idx + 1) % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
