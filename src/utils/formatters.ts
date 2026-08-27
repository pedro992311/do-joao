export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Robust parser for Brazilian currency inputs.
 * Handles formats like:
 * - "1117" -> 1117
 * - "1.117" -> 1117 (3 digits after dot = thousands separator in BR)
 * - "1,117" -> 1117 (3 digits after comma = thousands separator)
 * - "1.117,50" -> 1117.50
 * - "1,117.50" -> 1117.50
 * - "1117,50" -> 1117.50
 * - "1117.50" -> 1117.50
 * - "25,00" -> 25
 * - "25.00" -> 25
 * - "0,50" -> 0.5
 * - "0.50" -> 0.5
 * - "1,5" -> 1.5
 */
export function parseCurrencyInput(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;

  let clean = value.toString().trim();
  // Remove currency symbol, prefixes and whitespace
  clean = clean.replace(/R\$\s?/gi, '').replace(/\s+/g, '');

  if (!clean) return 0;

  // Case 1: Has both dot and comma (e.g. 1.117,50 or 1,117.50)
  if (clean.includes('.') && clean.includes(',')) {
    const lastDotIndex = clean.lastIndexOf('.');
    const lastCommaIndex = clean.lastIndexOf(',');
    if (lastCommaIndex > lastDotIndex) {
      // Brazilian format: 1.117,50 -> remove dots, replace comma with dot
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      // US format: 1,117.50 -> remove commas
      clean = clean.replace(/,/g, '');
    }
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Case 2: Only has comma
  if (clean.includes(',')) {
    const parts = clean.split(',');
    if (parts.length === 2) {
      const [integerPart, decimalPart] = parts;
      // If 3 digits after comma and integer is 1-3 digits, e.g. "1,117" -> treated as 1117
      if (decimalPart.length === 3 && integerPart.length >= 1 && integerPart.length <= 3 && !integerPart.startsWith('0')) {
        const parsed = parseFloat(clean.replace(',', ''));
        return isNaN(parsed) ? 0 : parsed;
      }
      clean = clean.replace(',', '.');
    } else {
      clean = clean.replace(/,/g, '');
    }
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Case 3: Only has dot
  if (clean.includes('.')) {
    const parts = clean.split('.');
    if (parts.length > 2) {
      // Multiple dots, e.g. 1.000.000 -> thousands
      clean = clean.replace(/\./g, '');
      const parsed = parseFloat(clean);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    // Exactly 1 dot:
    const [integerPart, decimalPart] = parts;
    // In Brazil, "1.117" (3 digits after dot) is 1.117 reais (thousands separator)
    if (decimalPart.length === 3 && integerPart.length >= 1 && integerPart.length <= 3 && !integerPart.startsWith('0')) {
      clean = clean.replace('.', '');
      const parsed = parseFloat(clean);
      return isNaN(parsed) ? 0 : parsed;
    }

    // Otherwise 1 or 2 digits after dot, e.g. "1117.50" or "0.50"
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Case 4: Plain number string, e.g. "1117"
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatCompactCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'R$ 0';
  if (Math.abs(value) >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1).replace('.', ',')}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`;
  }
  return formatCurrency(value);
}

export function formatNumber(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatPercentage(value: number, includeSign = true): string {
  if (isNaN(value) || !isFinite(value)) return '0,0%';
  const sign = value > 0 && includeSign ? '+' : '';
  return `${sign}${value.toFixed(1).replace('.', ',')}%`;
}

export function formatDateBR(dateString: string): string {
  if (!dateString) return '-';
  // Handle YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
}

export function formatDateTimeBR(isoString: string): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return formatDateBR(isoString);
  }
}
