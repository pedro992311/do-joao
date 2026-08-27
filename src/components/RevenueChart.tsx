import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Calendar, Layers } from 'lucide-react';
import { Sale } from '../types';
import { generateChartData } from '../utils/metrics';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';

interface RevenueChartProps {
  sales: Sale[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ sales }) => {
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const chartData = generateChartData(sales, granularity);
  const totalPeriodRevenue = chartData.reduce((acc, p) => acc + p.revenue, 0);

  return (
    <div
      id="card-revenue-chart"
      className="rounded-2xl glass-panel p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col justify-between"
    >
      {/* Chart Header with Granularity Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Faturamento ao Longo do Tempo
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evolução da receita bruta por período selecionado
          </p>
        </div>

        {/* Toggle Diário / Semanal / Mensal */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 self-start sm:self-center">
          {(['daily', 'weekly', 'monthly'] as const).map((g) => {
            const labels = { daily: 'Diário', weekly: 'Semanal', monthly: 'Mensal' };
            const isActive = granularity === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setGranularity(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {labels[g]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric Callout */}
      <div className="my-4 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-slate-400">Total no período visualizado:</span>
          <div className="text-xl sm:text-2xl font-black text-white font-numeric tracking-tight">
            {formatCurrency(totalPeriodRevenue)}
          </div>
        </div>
        <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          ● Tempo Real
        </span>
      </div>

      {/* Chart Area */}
      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactCurrency(v)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-panel-elevated p-3 rounded-xl border border-emerald-500/30 shadow-2xl text-xs">
                      <p className="text-slate-400 font-medium">{data.fullDate || data.label}</p>
                      <p className="text-base font-bold text-emerald-400 font-numeric mt-1">
                        {formatCurrency(data.revenue)}
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        {data.salesCount} {data.salesCount === 1 ? 'conta vendida' : 'contas vendidas'}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              activeDot={{ r: 6, fill: '#34d399', stroke: '#064e3b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
