import React, { useState } from 'react';
import { Target, Trophy, Edit3, Check, X, Flame, Sparkles, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SalesGoal, Sale } from '../types';
import { calculateGoalProgress } from '../utils/metrics';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface GoalSectionProps {
  sales: Sale[];
  goal: SalesGoal;
  onUpdateGoal: (newGoal: SalesGoal) => void;
}

export const GoalSection: React.FC<GoalSectionProps> = ({ sales, goal, onUpdateGoal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editSalesCount, setEditSalesCount] = useState(goal.targetSalesCount.toString());
  const [editRevenue, setEditRevenue] = useState(goal.targetRevenue.toString());

  const progress = calculateGoalProgress(sales, goal);

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(editSalesCount, 10);
    const rev = parseFloat(editRevenue.replace(',', '.'));

    if (!isNaN(count) && count > 0 && !isNaN(rev) && rev > 0) {
      onUpdateGoal({
        ...goal,
        targetSalesCount: count,
        targetRevenue: rev,
      });
      setIsEditing(false);

      if (progress.currentCount >= count || progress.currentRevenue >= rev) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#3b82f6', '#fbbf24'],
    });
  };

  return (
    <div
      id="section-monthly-goal"
      className="relative overflow-hidden rounded-2xl glass-panel p-5 sm:p-6 border border-white/10 shadow-xl"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Meta do mês</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                Mês Atual
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Acompanhe seu ritmo de vendas e faturamento para alcançar seus objetivos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {progress.isCountAchieved && progress.isRevenueAchieved && (
            <button
              onClick={triggerCelebration}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 hover:bg-amber-500/30 cursor-pointer transition-all"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Meta Batida! 🏆</span>
            </button>
          )}

          <button
            id="btn-edit-monthly-goal"
            type="button"
            onClick={() => {
              setEditSalesCount(goal.targetSalesCount.toString());
              setEditRevenue(goal.targetRevenue.toString());
              setIsEditing(!isEditing);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEditing ? 'Cancelar Edição' : 'Ajustar Metas'}</span>
          </button>
        </div>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveGoal}
          className="mt-4 p-4 rounded-xl glass-panel-elevated border border-emerald-500/30 animate-fade-in"
        >
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
            Definir Metas do Mês
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Meta de Quantidade (Contas)
              </label>
              <input
                type="number"
                min="1"
                value={editSalesCount}
                onChange={(e) => setEditSalesCount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg glass-input text-sm text-white"
                placeholder="Ex: 100"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Meta de Faturamento (R$)
              </label>
              <input
                type="text"
                value={editRevenue}
                onChange={(e) => setEditRevenue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg glass-input text-sm text-white font-numeric"
                placeholder="Ex: 10000"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Salvar Metas
            </button>
          </div>
        </form>
      )}

      {/* Progress Bars & Numbers */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* 1. Quantidade de Contas Vendidas */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-400 font-medium">Meta de Contas:</span>
            <span className="font-bold text-white font-numeric">
              {formatNumber(goal.targetSalesCount)} contas
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400">Vendido: </span>
              <span className="text-lg sm:text-xl font-extrabold text-cyan-400 font-numeric">
                {formatNumber(progress.currentCount)} contas
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-300">Progresso: </span>
              <span className="text-base sm:text-lg font-black text-cyan-300 font-numeric">
                {progress.countPercentage}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-700 shadow-sm shadow-cyan-500/50"
              style={{ width: `${Math.min(progress.countPercentage, 100)}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              {progress.salesNeeded > 0 ? (
                <>Faltam <strong>{progress.salesNeeded}</strong> contas</>
              ) : (
                <span className="text-emerald-400 font-semibold">🎉 Meta de contas superada!</span>
              )}
            </span>
            <span>{progress.daysRemaining} dias restantes</span>
          </div>
        </div>

        {/* 2. Faturamento */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-400 font-medium">Meta de Faturamento:</span>
            <span className="font-bold text-white font-numeric">
              {formatCurrency(goal.targetRevenue)}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400">Faturado: </span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-numeric">
                {formatCurrency(progress.currentRevenue)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-300">Alcançado: </span>
              <span className="text-base sm:text-lg font-black text-emerald-300 font-numeric">
                {progress.revenuePercentage}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-700 shadow-sm shadow-emerald-500/50"
              style={{ width: `${Math.min(progress.revenuePercentage, 100)}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              {progress.revenueNeeded > 0 ? (
                <>Faltam <strong>{formatCurrency(progress.revenueNeeded)}</strong></>
              ) : (
                <span className="text-emerald-400 font-semibold">🏆 Faturamento alvo atingido!</span>
              )}
            </span>
            <span className="text-slate-400">
              Ritmo: ~{formatCurrency(progress.dailyTargetRevenue)}/dia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
