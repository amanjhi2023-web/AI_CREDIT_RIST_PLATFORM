import React, { useState } from 'react';
import { LoanApplication } from '../../types';
import { DecisionBadge, RiskBadge } from './RiskBadge';
import { formatPercent, formatINR } from '../../utils/formatting';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Cpu, 
  Hash, 
  UserCheck, 
  Sparkles,
  Info
} from 'lucide-react';

interface DecisionCardProps {
  loan: LoanApplication;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ loan }) => {
  const [showAudit, setShowAudit] = useState(false);

  const isApproved = loan.decision === 'APPROVED';
  const isRejected = loan.decision === 'REJECTED';
  const isReview = loan.decision === 'MANUAL REVIEW';

  const containerBg = isApproved 
    ? 'bg-gradient-to-r from-emerald-950/40 via-[#111C35] to-[#111C35] border-emerald-500/40' 
    : isRejected 
      ? 'bg-gradient-to-r from-rose-950/40 via-[#111C35] to-[#111C35] border-rose-500/40'
      : 'bg-gradient-to-r from-amber-950/40 via-[#111C35] to-[#111C35] border-amber-500/40';

  const statusIcon = isApproved ? (
    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xs">
      <ShieldCheck className="w-6 h-6" />
    </div>
  ) : isRejected ? (
    <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-xs">
      <AlertOctagon className="w-6 h-6" />
    </div>
  ) : (
    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xs">
      <Clock className="w-6 h-6" />
    </div>
  );

  return (
    <div id="loan-decision-card" className={`rounded-xl border ${containerBg} p-6 shadow-sm transition-all`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="flex items-start sm:items-center gap-4">
          {statusIcon}
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Decision Engine Evaluation
              </span>
              <RiskBadge category={loan.riskCategory} size="sm" />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <DecisionBadge decision={loan.decision} size="lg" />
              <span className="text-sm text-slate-300 font-medium">
                Rule ID: <span className="font-mono text-white font-semibold">{loan.decisionRule.split('-')[0].trim()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Comparison threshold badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900/90 p-3 rounded-lg border border-slate-800 shadow-2xs">
          <div className="border-r border-slate-800 pr-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">PD vs Ceiling</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {formatPercent(loan.pd)} <span className="text-xs font-normal text-slate-400">/ ≤{formatPercent(loan.pdThreshold)}</span>
            </div>
            <div className={`text-[10px] font-medium mt-0.5 ${loan.pd <= loan.pdThreshold ? 'text-emerald-400' : 'text-rose-400'}`}>
              {loan.pd <= loan.pdThreshold ? 'Within threshold' : 'Exceeds threshold'}
            </div>
          </div>

          <div className="border-r border-slate-800 pr-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">ECL vs Limit</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {formatINR(loan.ecl)} <span className="text-xs font-normal text-slate-400">/ ≤{formatINR(loan.eclThreshold, true)}</span>
            </div>
            <div className={`text-[10px] font-medium mt-0.5 ${loan.ecl <= loan.eclThreshold ? 'text-emerald-400' : 'text-rose-400'}`}>
              {loan.ecl <= loan.eclThreshold ? 'Within risk budget' : 'Exceeds risk cap'}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Decision Engine</div>
            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>v3.4.2 ML</span>
            </div>
            <div className="text-[10px] font-medium text-emerald-400 mt-0.5">
              Automated Pass
            </div>
          </div>
        </div>
      </div>

      {/* Decision Rationale */}
      <div className="mt-5">
        <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Decision Reason & Underwriting Rationale</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
          "{loan.decisionReason}"
        </p>
      </div>

      {/* Audit Trail Accordion */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <button
          id="btn-toggle-audit"
          type="button"
          onClick={() => setShowAudit(!showAudit)}
          className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            <span>Decision & Audit Details (Compliance Traceability)</span>
          </span>
          {showAudit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAudit && (
          <div className="mt-3 p-4 bg-slate-950 text-slate-200 border border-slate-800 rounded-lg text-xs font-mono grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in">
            <div>
              <span className="text-slate-400 block mb-0.5">Model Version:</span>
              <span className="text-emerald-400 font-semibold">{loan.modelVersion}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Audit Trail ID:</span>
              <span className="text-blue-400 font-semibold">{loan.auditTrailId}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Prediction Timestamp:</span>
              <span className="text-slate-300">{loan.predictionTimestamp}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Evaluated By:</span>
              <span className="text-slate-300">{loan.evaluatedBy}</span>
            </div>
            <div className="md:col-span-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              Regulatory notice: All inputs, weights, and intermediate logits are cryptographically hashed and stored in immutable compliance logs for statutory inspection.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
