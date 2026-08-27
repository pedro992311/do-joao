import { PeriodFilter, CustomDateRange } from '../types';

export function getTodayString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface DateRangeResult {
  startStr: string;
  endStr: string;
  prevStartStr: string;
  prevEndStr: string;
  label: string;
}

export function getDateRangeForPeriod(
  period: PeriodFilter,
  customRange?: CustomDateRange,
  baseDate: Date = new Date()
): DateRangeResult {
  const today = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  
  if (period === 'today') {
    const todayStr = formatDateToYMD(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateToYMD(yesterday);
    return {
      startStr: todayStr,
      endStr: todayStr,
      prevStartStr: yesterdayStr,
      prevEndStr: yesterdayStr,
      label: 'Hoje',
    };
  }

  if (period === '7days') {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - 6);
    return {
      startStr: formatDateToYMD(start),
      endStr: formatDateToYMD(today),
      prevStartStr: formatDateToYMD(prevStart),
      prevEndStr: formatDateToYMD(prevEnd),
      label: 'Últimos 7 dias',
    };
  }

  if (period === 'this_week') {
    // Week starting Monday (1)
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(monday.getDate() - distanceToMonday);
    
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    const prevMonday = new Date(monday);
    prevMonday.setDate(prevMonday.getDate() - 7);
    const prevSunday = new Date(prevMonday);
    prevSunday.setDate(prevSunday.getDate() + 6);

    return {
      startStr: formatDateToYMD(monday),
      endStr: formatDateToYMD(sunday),
      prevStartStr: formatDateToYMD(prevMonday),
      prevEndStr: formatDateToYMD(prevSunday),
      label: 'Semana atual',
    };
  }

  if (period === '30days') {
    const start = new Date(today);
    start.setDate(start.getDate() - 29);
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - 29);
    return {
      startStr: formatDateToYMD(start),
      endStr: formatDateToYMD(today),
      prevStartStr: formatDateToYMD(prevStart),
      prevEndStr: formatDateToYMD(prevEnd),
      label: 'Últimos 30 dias',
    };
  }

  if (period === 'this_month') {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const prevMonthFirst = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevMonthLast = new Date(today.getFullYear(), today.getMonth(), 0);

    return {
      startStr: formatDateToYMD(firstDay),
      endStr: formatDateToYMD(lastDay),
      prevStartStr: formatDateToYMD(prevMonthFirst),
      prevEndStr: formatDateToYMD(prevMonthLast),
      label: 'Mês atual',
    };
  }

  if (period === 'last_month') {
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);

    const prevMonthFirst = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const prevMonthLast = new Date(today.getFullYear(), today.getMonth() - 1, 0);

    return {
      startStr: formatDateToYMD(firstDay),
      endStr: formatDateToYMD(lastDay),
      prevStartStr: formatDateToYMD(prevMonthFirst),
      prevEndStr: formatDateToYMD(prevMonthLast),
      label: 'Mês anterior',
    };
  }

  if (period === 'custom' && customRange && customRange.startDate && customRange.endDate) {
    const start = parseDateString(customRange.startDate);
    const end = parseDateString(customRange.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - diffDays + 1);

    return {
      startStr: customRange.startDate,
      endStr: customRange.endDate,
      prevStartStr: formatDateToYMD(prevStart),
      prevEndStr: formatDateToYMD(prevEnd),
      label: 'Personalizado',
    };
  }

  // Default fallback
  const todayStr = formatDateToYMD(today);
  return {
    startStr: todayStr,
    endStr: todayStr,
    prevStartStr: todayStr,
    prevEndStr: todayStr,
    label: 'Hoje',
  };
}

export function isDateInRange(dateStr: string, startStr: string, endStr: string): boolean {
  return dateStr >= startStr && dateStr <= endStr;
}

export const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const WEEKDAYS_SHORT_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
