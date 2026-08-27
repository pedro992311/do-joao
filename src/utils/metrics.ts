import { Sale, PeriodFilter, CustomDateRange, PeriodMetrics, SummaryCardData, ChartDataPoint, SalesGoal } from '../types';
import { getDateRangeForPeriod, isDateInRange, formatDateToYMD, parseDateString, WEEKDAYS_SHORT_PT, MONTH_NAMES_PT } from './dateHelpers';

export function calculateMetricsForPeriod(
  sales: Sale[],
  period: PeriodFilter,
  customRange?: CustomDateRange
): PeriodMetrics {
  const range = getDateRangeForPeriod(period, customRange);
  
  // Current period sales (only completed sales contribute to financial revenue)
  const currentSales = sales.filter(
    (s) => isDateInRange(s.date, range.startStr, range.endStr) && s.status === 'Concluída'
  );

  // Previous period sales
  const prevSales = sales.filter(
    (s) => isDateInRange(s.date, range.prevStartStr, range.prevEndStr) && s.status === 'Concluída'
  );

  const revenue = currentSales.reduce((acc, s) => acc + s.amount, 0);
  const salesCount = currentSales.length;
  const averageTicket = salesCount > 0 ? revenue / salesCount : 0;

  const prevRevenue = prevSales.reduce((acc, s) => acc + s.amount, 0);
  const prevSalesCount = prevSales.length;
  const prevAverageTicket = prevSalesCount > 0 ? prevRevenue / prevSalesCount : 0;

  let growthRate = 0;
  if (prevRevenue > 0) {
    growthRate = ((revenue - prevRevenue) / prevRevenue) * 100;
  } else if (revenue > 0) {
    growthRate = 100;
  }

  return {
    revenue,
    salesCount,
    averageTicket,
    growthRate,
    prevRevenue,
    prevSalesCount,
    prevAverageTicket,
  };
}

export function calculateWalletStats(sales: Sale[]) {
  const todayStr = formatDateToYMD(new Date());
  
  // All-time accumulated balance
  const completedSales = sales.filter((s) => s.status === 'Concluída');
  const accumulatedBalance = completedSales.reduce((acc, s) => acc + s.amount, 0);
  const totalSalesCount = completedSales.length;

  // Entradas hoje
  const todaySales = completedSales.filter((s) => s.date === todayStr);
  const todayRevenue = todaySales.reduce((acc, s) => acc + s.amount, 0);
  const todayCount = todaySales.length;

  // Entradas esta semana
  const weekRange = getDateRangeForPeriod('this_week');
  const weekSales = completedSales.filter((s) => isDateInRange(s.date, weekRange.startStr, weekRange.endStr));
  const weekRevenue = weekSales.reduce((acc, s) => acc + s.amount, 0);
  const weekCount = weekSales.length;

  // Entradas este mês
  const monthRange = getDateRangeForPeriod('this_month');
  const monthSales = completedSales.filter((s) => isDateInRange(s.date, monthRange.startStr, monthRange.endStr));
  const monthRevenue = monthSales.reduce((acc, s) => acc + s.amount, 0);
  const monthCount = monthSales.length;

  return {
    accumulatedBalance,
    totalSalesCount,
    todayRevenue,
    todayCount,
    weekRevenue,
    weekCount,
    monthRevenue,
    monthCount,
  };
}

export function calculateWeekSummary(sales: Sale[]): SummaryCardData {
  const weekMetrics = calculateMetricsForPeriod(sales, 'this_week');
  return {
    salesCount: weekMetrics.salesCount,
    revenue: weekMetrics.revenue,
    averageTicket: weekMetrics.averageTicket,
    comparisonPercentage: weekMetrics.growthRate,
  };
}

export function calculateMonthSummary(sales: Sale[]): SummaryCardData {
  const monthMetrics = calculateMetricsForPeriod(sales, 'this_month');
  return {
    salesCount: monthMetrics.salesCount,
    revenue: monthMetrics.revenue,
    averageTicket: monthMetrics.averageTicket,
    comparisonPercentage: monthMetrics.growthRate,
  };
}

export function calculateGoalProgress(sales: Sale[], goal: SalesGoal) {
  const monthRange = getDateRangeForPeriod('this_month');
  const currentMonthSales = sales.filter(
    (s) => isDateInRange(s.date, monthRange.startStr, monthRange.endStr) && s.status === 'Concluída'
  );

  const currentCount = currentMonthSales.length;
  const currentRevenue = currentMonthSales.reduce((acc, s) => acc + s.amount, 0);

  const countPercentage = goal.targetSalesCount > 0 
    ? Math.min(Math.round((currentCount / goal.targetSalesCount) * 100), 1000) 
    : 0;
    
  const revenuePercentage = goal.targetRevenue > 0 
    ? Math.min(Math.round((currentRevenue / goal.targetRevenue) * 100), 1000) 
    : 0;

  // Days remaining in month
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentDay = today.getDate();
  const daysRemaining = Math.max(1, lastDay - currentDay);
  
  const salesNeeded = Math.max(0, goal.targetSalesCount - currentCount);
  const revenueNeeded = Math.max(0, goal.targetRevenue - currentRevenue);
  const dailyTargetSales = (salesNeeded / daysRemaining).toFixed(1);
  const dailyTargetRevenue = revenueNeeded / daysRemaining;

  return {
    currentCount,
    targetSalesCount: goal.targetSalesCount,
    countPercentage,
    currentRevenue,
    targetRevenue: goal.targetRevenue,
    revenuePercentage,
    salesNeeded,
    revenueNeeded,
    daysRemaining,
    dailyTargetSales,
    dailyTargetRevenue,
    isCountAchieved: currentCount >= goal.targetSalesCount,
    isRevenueAchieved: currentRevenue >= goal.targetRevenue,
  };
}

export function generateChartData(
  sales: Sale[],
  granularity: 'daily' | 'weekly' | 'monthly'
): ChartDataPoint[] {
  const completedSales = sales.filter((s) => s.status === 'Concluída');
  const now = new Date();

  if (granularity === 'daily') {
    // Last 14 days
    const points: ChartDataPoint[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = formatDateToYMD(d);
      const dayName = WEEKDAYS_SHORT_PT[d.getDay()];
      const dayNum = d.getDate();

      const daySales = completedSales.filter((s) => s.date === dateStr);
      const revenue = daySales.reduce((acc, s) => acc + s.amount, 0);

      points.push({
        dateKey: dateStr,
        label: `${dayName} ${dayNum}`,
        fullDate: `${dayNum.toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`,
        revenue,
        salesCount: daySales.length,
      });
    }
    return points;
  }

  if (granularity === 'weekly') {
    // Last 8 weeks
    const points: ChartDataPoint[] = [];
    for (let w = 7; w >= 0; w--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - w * 7);
      
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);

      const startStr = formatDateToYMD(weekStart);
      const endStr = formatDateToYMD(weekEnd);

      const weekSales = completedSales.filter((s) => isDateInRange(s.date, startStr, endStr));
      const revenue = weekSales.reduce((acc, s) => acc + s.amount, 0);

      const label = `Sem ${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
      points.push({
        dateKey: `sem_${w}`,
        label,
        fullDate: `${formatDateToYMD(weekStart)} a ${formatDateToYMD(weekEnd)}`,
        revenue,
        salesCount: weekSales.length,
      });
    }
    return points;
  }

  if (granularity === 'monthly') {
    // Last 6 months
    const points: ChartDataPoint[] = [];
    for (let m = 5; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const startStr = formatDateToYMD(d);
      const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const endStr = formatDateToYMD(lastDayOfMonth);

      const monthSales = completedSales.filter((s) => isDateInRange(s.date, startStr, endStr));
      const revenue = monthSales.reduce((acc, s) => acc + s.amount, 0);
      const monthName = MONTH_NAMES_PT[d.getMonth()].slice(0, 3);

      points.push({
        dateKey: `${d.getFullYear()}-${d.getMonth() + 1}`,
        label: `${monthName}/${String(d.getFullYear()).slice(2)}`,
        fullDate: `${MONTH_NAMES_PT[d.getMonth()]} de ${d.getFullYear()}`,
        revenue,
        salesCount: monthSales.length,
      });
    }
    return points;
  }

  return [];
}

export function calculateReportsData(sales: Sale[]) {
  const completed = sales.filter((s) => s.status === 'Concluída');

  // Breakdown by payment method
  const methodMap: Record<string, { count: number; revenue: number }> = {
    Pix: { count: 0, revenue: 0 },
    Cartão: { count: 0, revenue: 0 },
    'Mercado Pago': { count: 0, revenue: 0 },
    Outro: { count: 0, revenue: 0 },
  };

  // Breakdown by category
  const categoryMap: Record<string, { count: number; revenue: number }> = {
    Streaming: { count: 0, revenue: 0 },
    Jogos: { count: 0, revenue: 0 },
    Produtividade: { count: 0, revenue: 0 },
    'Redes Sociais': { count: 0, revenue: 0 },
    Outro: { count: 0, revenue: 0 },
  };

  // Daily revenue map to find best day
  const dailyMap: Record<string, { revenue: number; count: number }> = {};
  const monthlyMap: Record<string, { revenue: number; count: number }> = {};

  completed.forEach((s) => {
    // Payment method
    const method = s.paymentMethod || 'Outro';
    if (!methodMap[method]) methodMap[method] = { count: 0, revenue: 0 };
    methodMap[method].count += 1;
    methodMap[method].revenue += s.amount;

    // Category
    const cat = s.accountCategory || 'Outro';
    if (!categoryMap[cat]) categoryMap[cat] = { count: 0, revenue: 0 };
    categoryMap[cat].count += 1;
    categoryMap[cat].revenue += s.amount;

    // Daily
    if (!dailyMap[s.date]) dailyMap[s.date] = { revenue: 0, count: 0 };
    dailyMap[s.date].revenue += s.amount;
    dailyMap[s.date].count += 1;

    // Monthly
    const monthKey = s.date.slice(0, 7);
    if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { revenue: 0, count: 0 };
    monthlyMap[monthKey].revenue += s.amount;
    monthlyMap[monthKey].count += 1;
  });

  // Best day
  let bestDay = { date: '', revenue: 0, count: 0 };
  Object.entries(dailyMap).forEach(([date, val]) => {
    if (val.revenue > bestDay.revenue) {
      bestDay = { date, revenue: val.revenue, count: val.count };
    }
  });

  // Best month
  let bestMonth = { month: '', revenue: 0, count: 0 };
  Object.entries(monthlyMap).forEach(([month, val]) => {
    if (val.revenue > bestMonth.revenue) {
      bestMonth = { month, revenue: val.revenue, count: val.count };
    }
  });

  const totalRevenue = completed.reduce((acc, s) => acc + s.amount, 0);
  const totalSales = completed.length;
  const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  return {
    totalRevenue,
    totalSales,
    avgTicket,
    methodBreakdown: Object.entries(methodMap).map(([name, val]) => ({
      name,
      ...val,
      percentage: totalRevenue > 0 ? (val.revenue / totalRevenue) * 100 : 0,
    })),
    categoryBreakdown: Object.entries(categoryMap).map(([name, val]) => ({
      name,
      ...val,
      percentage: totalRevenue > 0 ? (val.revenue / totalRevenue) * 100 : 0,
    })),
    bestDay,
    bestMonth,
  };
}
