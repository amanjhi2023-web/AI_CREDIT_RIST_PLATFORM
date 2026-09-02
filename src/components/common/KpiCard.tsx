import React, { useState } from 'react';
import { LucideIcon, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  id?: string;
  title: string;
  value: string;
  changeText?: string;
  isPositiveChange?: boolean | null; // null for neutral
  isChangeGood?: boolean; // In risk, ECL down is GOOD (green), default rate down is GOOD (green)
  icon: LucideIcon;
  tooltipText: string;
  subtext?: string;
  iconBgColor?: string;
  iconTextColor?: string;
  onClick?: () => void;
  active?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  changeText,
  isPositiveChange,
  isChangeGood = true,
  icon: Icon,
  tooltipText,
  subtext,
  iconBgColor = 'bg-slate-800',
  iconTextColor = 'text-slate-300',
  onClick,
  active = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Determine trend color
  const getTrendColor = () => {
    if (isPositiveChange === null || isPositiveChange === undefined) return 'text-slate-400 bg-slate-800';
    if (isChangeGood) {
      return isPositiveChange ? 'text-emerald-400 bg-emerald-500/15' : 'text-rose-400 bg-rose-500/15';
    } else {
      // If higher is bad (like PD or ECL or Default rate)
      return isPositiveChange ? 'text-rose-400 bg-rose-500/15' : 'text-emerald-400 bg-emerald-500/15';
    }
  };

  return (
    <div
      id={id || `kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`relative bg-[#111C35] rounded-xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
        active 
          ? 'border-blue-500 ring-2 ring-blue-500/20' 
          : 'border-slate-800 hover:border-slate-700'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
              {title}
            </span>
            <div 
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button 
                type="button" 
                className="text-slate-500 hover:text-slate-300 p-0.5 rounded-full transition-colors focus:outline-none"
                aria-label={`Info about ${title}`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              
              {showTooltip && (
                <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-60 p-2.5 bg-slate-950 border border-slate-700 text-white text-xs rounded-lg shadow-xl pointer-events-none transition-opacity duration-150 animate-in fade-in">
                  <div className="font-semibold text-slate-200 mb-0.5">{title}</div>
                  <div className="text-slate-300 leading-relaxed">{tooltipText}</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                </div>
              )}
            </div>
          </div>
          
          <div className="text-2xl font-bold tracking-tight text-white truncate">
            {value}
          </div>
        </div>

        <div className={`p-2.5 rounded-lg ${iconBgColor} shrink-0`}>
          <Icon className={`w-5 h-5 ${iconTextColor}`} />
        </div>
      </div>

      {(changeText || subtext) && (
        <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          {changeText && (
            <span className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md ${getTrendColor()}`}>
              {isPositiveChange === true && <TrendingUp className="w-3 h-3 shrink-0" />}
              {isPositiveChange === false && <TrendingDown className="w-3 h-3 shrink-0" />}
              {isPositiveChange === null && <Minus className="w-3 h-3 shrink-0" />}
              <span>{changeText}</span>
            </span>
          )}
          {subtext && (
            <span className="text-slate-400 font-normal truncate ml-auto">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
