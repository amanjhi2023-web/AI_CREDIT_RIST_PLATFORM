import React from 'react';
import { getRiskCategoryColor, getDecisionColor } from '../../utils/formatting';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface RiskBadgeProps {
  category: 'Low Risk' | 'Medium Risk' | 'High Risk' | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ category, size = 'md', showIcon = true }) => {
  const colors = getRiskCategoryColor(category);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-bold gap-2'
  }[size];

  const IconComponent = () => {
    if (!showIcon) return null;
    if (category === 'Low Risk') return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    if (category === 'Medium Risk') return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    return <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
  };

  return (
    <span 
      id={`risk-badge-${category.toLowerCase().replace(/\s+/g, '-')}`}
      className={`inline-flex items-center rounded-md border ${colors.bg} ${colors.border} ${sizeClasses} transition-all shadow-xs`}
    >
      <IconComponent />
      <span className="whitespace-nowrap">{category}</span>
    </span>
  );
};

interface DecisionBadgeProps {
  decision: 'APPROVED' | 'REJECTED' | 'MANUAL REVIEW' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const DecisionBadge: React.FC<DecisionBadgeProps> = ({ decision, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-2.5 py-1 text-xs font-bold gap-1.5',
    lg: 'px-4 py-2 text-sm font-extrabold gap-2 tracking-wide'
  }[size];

  if (decision === 'APPROVED') {
    return (
      <span id="decision-badge-approved" className={`inline-flex items-center rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium ${sizeClasses}`}>
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="whitespace-nowrap">APPROVED</span>
      </span>
    );
  }

  if (decision === 'MANUAL REVIEW') {
    return (
      <span id="decision-badge-review" className={`inline-flex items-center rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium ${sizeClasses}`}>
        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="whitespace-nowrap">MANUAL REVIEW</span>
      </span>
    );
  }

  return (
    <span id="decision-badge-rejected" className={`inline-flex items-center rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30 font-medium ${sizeClasses}`}>
      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
      <span className="whitespace-nowrap">REJECTED</span>
    </span>
  );
};
