import React, { useState } from 'react';
import {
  Target,
  Trophy,
  Flame,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SalesGoal, Sale } from '../types';
import { calculateGoalProgress } from '../utils/metrics';
import { formatCurrency, formatNumber, parseCurrencyInput } from '../utils/formatters';

interface GoalsViewProps {
  sales: Sale[];
  goal: SalesGoal;
  onUpdateGoal: (newGoal: SalesGoal) => void;
  onNotify: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  sales,
  goal,
  onUpdateGoal,
  onNotify,
}) => {
  const [salesCountInput, setSalesCountInput] = useState(goal.targetSalesCount.toString());
  const [revenueInput, setRevenueInput] = useState(goal.targetRevenue.toString());

  const progress = calculateGoalProgress(sales, goal);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(salesCountInput, 10);
    const rev = parseCurrencyInput(revenueInput);

    if (isNaN(count) || count <= 0 || isNaN(rev) || rev <= 0) {
      onNotify('error', 'Valores inválidos', 'Defina metas numéricas maiores que zero.');
      return;
    }

    onUpdateGoal({
      ...goal,
      targetSalesCount: count,
      targetRevenue: rev,
    });
    onNotify('success', 'Metas atualizadas com sucesso!', `Meta ajustada para ${count} contas e ${formatCurrency(rev)}.`);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#fbbf24', '#a855f7'],
    });
  };

  return (
    <div id="view-goals-page" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Planejamento & Objetivos
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Metas de Vendas & Faturamento
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure suas metas mensais e acompanhe seu ritmo diário para superar seus objetivos
          </p>
        </div>

        {progress.isCountAchieved && progress.isRevenueAchieved && (
          <button
            onClick={triggerConfetti}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-2 hover:bg-amber-500/30 cursor-pointer shadow-lg shadow-amber-950/40"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Celebrar Conquista 🏆</span>
          </button>
        )}
      </div>

      {/* Main Goal Configuration & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Form */}
        <div className="p-6 rounded-2xl glass-panel-elevated border border-white/15 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Configurar Metas</h3>
              <p className="text-xs text-slate-400">Ajuste os valores alvo do mês atual</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Meta de Contas Vendidas
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={salesCountInput}
                  onChange={(e) => setSalesCountInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white font-numeric"
                  placeholder="Ex: 100"
                />
                <span className="text-xs text-slate-400 absolute right-3.5 top-3.5">contas</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Meta de Faturamento Bruto (R$)
              </label>
              <div className="relative">
                <span className="text-sm font-bold text-emerald-400 absolute left-3.5 top-3.5">R$</span>
                <input
                  type="text"
                  value={revenueInput}
                  onChange={(e) => setRevenueInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white font-numeric"
                  placeholder="Ex: 10000"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Novas Metas</span>
            </button>
          </form>

          {/* Quick preset target buttons */}
          <div className="pt-3 border-t border-white/10">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              Sugestões rápidas de metas:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 50, rev: 5000, label: 'Iniciante' },
                { count: 100, rev: 10000, label: 'Pro' },
                { count: 250, rev: 25000, label: 'Elite' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    setSalesCountInput(s.count.toString());
                    setRevenueInput(s.rev.toString());
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-all cursor-pointer"
                >
                  <div className="text-xs font-bold text-white">{s.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.count} un / R${s.rev/1000}k</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Progress Cards & Projection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Detailed Progress Breakdown */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Progresso em Tempo Real (Mês Atual)</span>
            </h3>

            {/* Target 1: Contas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-300">Contas Comerciais Entregues:</span>
                <span className="font-bold font-numeric text-cyan-400">
                  {formatNumber(progress.currentCount)} / {formatNumber(goal.targetSalesCount)} contas ({progress.countPercentage}%)
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-800 p-0.5 border border-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-700"
                  style={{ width: `${Math.min(progress.countPercentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{progress.salesNeeded > 0 ? `Faltam ${progress.salesNeeded} contas` : '✅ Meta alcançada!'}</span>
                <span>Ritmo necessário: ~{progress.dailyTargetSales} contas/dia</span>
              </div>
            </div>

            {/* Target 2: Faturamento */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-300">Faturamento Bruto Realizado:</span>
                <span className="font-bold font-numeric text-emerald-400">
                  {formatCurrency(progress.currentRevenue)} / {formatCurrency(goal.targetRevenue)} ({progress.revenuePercentage}%)
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-800 p-0.5 border border-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-700"
                  style={{ width: `${Math.min(progress.revenuePercentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  {progress.revenueNeeded > 0
                    ? `Faltam ${formatCurrency(progress.revenueNeeded)}`
                    : '🏆 Faturamento superado!'}
                </span>
                <span>Ritmo necessário: ~{formatCurrency(progress.dailyTargetRevenue)}/dia</span>
              </div>
            </div>
          </div>

          {/* Advice & Projection Card */}
          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 bg-emerald-950/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Análise de Ritmo</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Restam <strong>{progress.daysRemaining} dias</strong> neste mês. Para bater 100% da sua meta de vendas, mantenha uma média de{' '}
                <strong className="text-emerald-400">{progress.dailyTargetSales} contas por dia</strong> (ou aprox. {formatCurrency(progress.dailyTargetRevenue)} em faturamento diário).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
