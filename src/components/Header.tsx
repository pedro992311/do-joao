import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  ChevronDown,
  Filter,
  Sparkles,
  SlidersHorizontal,
  Bell,
} from 'lucide-react';
import { PeriodFilter, CustomDateRange } from '../types';

interface HeaderProps {
  userName: string;
  period: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
  customRange: CustomDateRange;
  onCustomRangeChange: (range: CustomDateRange) => void;
  onOpenSaleModal: () => void;
  totalSalesToday: number;
}

const PERIOD_LABELS: Record<PeriodFilter, string> = {
  today: 'Hoje',
  '7days': '7 dias',
  this_week: 'Semana atual',
  '30days': '30 dias',
  this_month: 'Mês atual',
  last_month: 'Mês anterior',
  custom: 'Personalizado',
};

export const Header: React.FC<HeaderProps> = ({
  userName,
  period,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
  onOpenSaleModal,
  totalSalesToday,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const handleSelectPeriod = (p: PeriodFilter) => {
    onPeriodChange(p);
    setShowDropdown(false);
    if (p === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
    }
  };

  return (
    <header className="mb-6 sm:mb-8 space-y-4">
      {/* Top Banner / Greeting & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistema Online • {totalSalesToday} vendas hoje
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Olá, <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">{userName}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Veja como está seu desempenho financeiro.
          </p>
        </div>

        {/* Right Controls: Period Filter & Big Action Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Period Selector Dropdown */}
          <div className="relative">
            <button
              id="btn-period-selector"
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl glass-panel text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:border-white/20 transition-all cursor-pointer shadow-sm"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Período: <strong>{PERIOD_LABELS[period]}</strong></span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowDropdown(false)}
                />
                <div
                  id="dropdown-period-menu"
                  className="absolute right-0 mt-2 w-48 rounded-xl glass-panel-elevated border border-white/15 shadow-2xl py-1.5 z-40 animate-fade-in"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Filtrar por período
                  </div>
                  {(['today', '7days', 'this_week', '30days', 'this_month', 'last_month', 'custom'] as PeriodFilter[]).map(
                    (p) => {
                      const isSelected = period === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleSelectPeriod(p)}
                          className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{PERIOD_LABELS[p]}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </button>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </div>

          {/* Big "+ Registrar Venda" Button */}
          <button
            id="btn-register-sale-main"
            type="button"
            onClick={onOpenSaleModal}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-400 text-[#05110d] hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Registrar venda</span>
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker bar (if period === 'custom' or picker open) */}
      {period === 'custom' && (
        <div className="p-3.5 rounded-xl glass-panel-subtle flex flex-wrap items-center gap-3 text-xs sm:text-sm border border-emerald-500/30 bg-emerald-950/10">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            Intervalo personalizado:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customRange.startDate}
              onChange={(e) =>
                onCustomRangeChange({ ...customRange, startDate: e.target.value })
              }
              className="px-2.5 py-1.5 rounded-lg glass-input text-xs text-white"
            />
            <span className="text-slate-400">até</span>
            <input
              type="date"
              value={customRange.endDate}
              onChange={(e) =>
                onCustomRangeChange({ ...customRange, endDate: e.target.value })
              }
              className="px-2.5 py-1.5 rounded-lg glass-input text-xs text-white"
            />
          </div>
        </div>
      )}
    </header>
  );
};
