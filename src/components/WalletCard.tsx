import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface WalletCardProps {
  accumulatedBalance: number;
  totalSalesCount: number;
  todayRevenue: number;
  todayCount: number;
  weekRevenue: number;
  weekCount: number;
  monthRevenue: number;
  monthCount: number;
  onOpenSaleModal: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  accumulatedBalance,
  totalSalesCount,
  todayRevenue,
  todayCount,
  weekRevenue,
  weekCount,
  monthRevenue,
  monthCount,
  onOpenSaleModal,
}) => {
  const [hideBalance, setHideBalance] = useState(false);

  return (
    <div
      id="card-wallet-control"
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0e172a]/95 via-[#0b1322]/90 to-[#070d18]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top row: Label & Disclaimer Badge */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
            <Wallet className="w-5 h-5 text-[#05110d]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Carteira de Vendas
              </span>
              <button
                type="button"
                onClick={() => setHideBalance(!hideBalance)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                title={hideBalance ? 'Mostrar saldo' : 'Ocultar saldo'}
              >
                {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <h3 className="text-sm font-semibold text-slate-300">
              Saldo acumulado de vendas
            </h3>
          </div>
        </div>

        {/* Clear disclaimer badge as requested */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Controle Interno • Registros Cadastrados</span>
        </div>
      </div>

      {/* Main Balance Display */}
      <div className="relative z-10 my-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-1">
            Total bruto gerado em contas
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-numeric tracking-tight flex items-baseline gap-2">
            {hideBalance ? '••••••••' : formatCurrency(accumulatedBalance)}
            <span className="text-xs font-normal text-slate-400 tracking-normal">
              ({formatNumber(totalSalesCount)} vendas totais)
            </span>
          </div>
        </div>

        {/* Quick sale button */}
        <button
          type="button"
          onClick={onOpenSaleModal}
          className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer hover:border-emerald-500/40"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          <span>Nova Venda Rápida</span>
        </button>
      </div>

      {/* 3 Sub-Stats: Entradas Hoje, Entradas Esta Semana, Entradas Este Mês */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
        {/* Hoje */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Entradas Hoje
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 font-numeric mt-0.5">
              {hideBalance ? '••••••' : formatCurrency(todayRevenue)}
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {todayCount} {todayCount === 1 ? 'venda' : 'vendas'}
            </span>
          </div>
        </div>

        {/* Esta Semana */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Entradas Esta Semana
            </div>
            <div className="text-base sm:text-lg font-bold text-cyan-400 font-numeric mt-0.5">
              {hideBalance ? '••••••' : formatCurrency(weekRevenue)}
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {weekCount} {weekCount === 1 ? 'venda' : 'vendas'}
            </span>
          </div>
        </div>

        {/* Este Mês */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Entradas Este Mês
            </div>
            <div className="text-base sm:text-lg font-bold text-teal-300 font-numeric mt-0.5">
              {hideBalance ? '••••••' : formatCurrency(monthRevenue)}
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
              {monthCount} {monthCount === 1 ? 'venda' : 'vendas'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
