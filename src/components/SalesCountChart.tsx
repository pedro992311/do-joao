import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { ShoppingBag, Calendar } from 'lucide-react';
import { Sale } from '../types';
import { generateChartData } from '../utils/metrics';
import { formatNumber } from '../utils/formatters';

interface SalesCountChartProps {
  sales: Sale[];
}

export const SalesCountChart: React.FC<SalesCountChartProps> = ({ sales }) => {
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const chartData = generateChartData(sales, granularity);
  const totalPeriodSales = chartData.reduce((acc, p) => acc + p.salesCount, 0);

  return (
    <div
      id="card-sales-count-chart"
      className="rounded-2xl glass-panel p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col justify-between"
    >
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Volume de Contas Vendidas
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Quantidade física de contas entregues por período
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
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
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
          <span className="text-xs text-slate-400">Total de contas no período:</span>
          <div className="text-xl sm:text-2xl font-black text-white font-numeric tracking-tight">
            {formatNumber(totalPeriodSales)} <span className="text-xs font-medium text-slate-400">contas</span>
          </div>
        </div>
        <span className="text-xs text-cyan-400 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
          ● Distribuição
        </span>
      </div>

      {/* Chart Area */}
      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
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
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-panel-elevated p-3 rounded-xl border border-cyan-500/30 shadow-2xl text-xs">
                      <p className="text-slate-400 font-medium">{data.fullDate || data.label}</p>
                      <p className="text-base font-bold text-cyan-400 font-numeric mt-1">
                        {data.salesCount} {data.salesCount === 1 ? 'conta vendida' : 'contas vendidas'}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="salesCount"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.salesCount > 0 ? '#06b6d4' : '#334155'}
                  className="transition-colors hover:fill-cyan-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
