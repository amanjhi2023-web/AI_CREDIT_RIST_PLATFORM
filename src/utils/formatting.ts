/**
 * Utility functions for Indian Rupee currency, percentages, risk colors, and Basel metric formatters
 */

export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  
  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    
    if (abs >= 10000000) {
      // 1 Crore = 10,000,000
      const cr = abs / 10000000;
      return `${sign}₹${cr.toFixed(cr >= 100 ? 1 : 2)} Cr`;
    } else if (abs >= 100000) {
      // 1 Lakh = 100,000
      const lakh = abs / 100000;
      return `${sign}₹${lakh.toFixed(lakh >= 100 ? 1 : 2)} L`;
    } else if (abs >= 1000) {
      const k = abs / 1000;
      return `${sign}₹${k.toFixed(1)} K`;
    }
  }

  // Full Indian number formatting (lakhs & crores standard)
  const isNegative = amount < 0;
  const rounded = Math.round(Math.abs(amount));
  const numStr = rounded.toString();
  
  let lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatPercent(value: number, decimals: number = 2): string {
  if (isNaN(value) || value === null || value === undefined) return '0.00%';
  // If value is 0.062, handle both fractional (0.062) and whole (6.2) nicely
  const displayVal = Math.abs(value) <= 1 && value !== 0 && value !== 1 ? value * 100 : value;
  return `${displayVal.toFixed(decimals)}%`;
}

export function formatNumber(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
}

export function getRiskCategoryColor(category: string): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  dot: string;
} {
  switch (category) {
    case 'Low Risk':
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        badgeBg: 'bg-emerald-500/20 text-emerald-300',
        dot: 'bg-emerald-400',
      };
    case 'Medium Risk':
      return {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        badgeBg: 'bg-amber-500/20 text-amber-300',
        dot: 'bg-amber-400',
      };
    case 'High Risk':
    default:
      return {
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        badgeBg: 'bg-rose-500/20 text-rose-300',
        dot: 'bg-rose-400',
      };
  }
}

export function getDecisionColor(decision: string): {
  badge: string;
  border: string;
  iconBg: string;
  textColor: string;
} {
  switch (decision) {
    case 'APPROVED':
      return {
        badge: 'bg-emerald-600 text-white shadow-sm',
        border: 'border-emerald-500/30 bg-emerald-500/10',
        iconBg: 'bg-emerald-500/20 text-emerald-400',
        textColor: 'text-emerald-400',
      };
    case 'MANUAL REVIEW':
      return {
        badge: 'bg-amber-600 text-white shadow-sm',
        border: 'border-amber-500/30 bg-amber-500/10',
        iconBg: 'bg-amber-500/20 text-amber-400',
        textColor: 'text-amber-400',
      };
    case 'REJECTED':
    default:
      return {
        badge: 'bg-rose-600 text-white shadow-sm',
        border: 'border-rose-500/30 bg-rose-500/10',
        iconBg: 'bg-rose-500/20 text-rose-400',
        textColor: 'text-rose-400',
      };
  }
}
