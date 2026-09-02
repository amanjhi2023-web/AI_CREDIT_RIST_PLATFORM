import React, { useState, useMemo } from 'react';
import { LoanApplication, UserRole, LoanDecision, RiskCategory } from '../../types';
import { formatINR, formatPercent, formatNumber } from '../../utils/formatting';
import { RiskBadge, DecisionBadge } from '../common/RiskBadge';
import { 
  UserCheck, 
  FileText, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  Search, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  Building2, 
  Coins, 
  Sparkles, 
  Info, 
  Check, 
  X, 
  ArrowUpDown,
  Filter,
  RefreshCw,
  Zap,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Cell, 
  ReferenceLine,
  CartesianGrid 
} from 'recharts';

interface IndividualRiskPageProps {
  allLoans: LoanApplication[];
  selectedLoan: LoanApplication;
  onSelectLoan: (loan: LoanApplication) => void;
  userRole: UserRole;
  initialSubTab?: 'application' | 'behavioral';
  onOpenAiAssistant?: () => void;
}

export const IndividualRiskPage: React.FC<IndividualRiskPageProps> = ({
  allLoans,
  selectedLoan,
  onSelectLoan,
  userRole,
  initialSubTab = 'application',
  onOpenAiAssistant,
}) => {
  // Sub-Navigation Tab: 'application' | 'behavioral'
  const [subTab, setSubTab] = useState<'application' | 'behavioral'>(initialSubTab);

  // Application Risk Filter: 'ALL' | 'APPROVED' | 'REJECTED' | 'MANUAL REVIEW'
  const [applicationDecisionFilter, setApplicationDecisionFilter] = useState<string>('ALL');
  const [appSearchQuery, setAppSearchQuery] = useState('');

  // Behavioral Risk Filter & Simulation State
  const [behavioralSearchQuery, setBehavioralSearchQuery] = useState('');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('All');
  const [selectedLoanType, setSelectedLoanType] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Interactive Simulation Controls on the Selected Loan
  const [simulatedPd, setSimulatedPd] = useState<number>(selectedLoan.pd);
  const [simulatedLgd, setSimulatedLgd] = useState<number>(selectedLoan.lgd);
  const [manualDecision, setManualDecision] = useState<LoanDecision>(selectedLoan.decision);
  const [decisionNotes, setDecisionNotes] = useState<string>('');
  const [showOverrideSuccess, setShowOverrideSuccess] = useState(false);

  // Keep simulated state in sync when selected loan changes
  React.useEffect(() => {
    setSimulatedPd(selectedLoan.pd);
    setSimulatedLgd(selectedLoan.lgd);
    setManualDecision(selectedLoan.decision);
    setShowOverrideSuccess(false);
  }, [selectedLoan.loanId]);

  // Recalculated dynamic ECL and Capital for simulation
  const simulatedEcl = useMemo(() => {
    return simulatedPd * simulatedLgd * selectedLoan.ead;
  }, [simulatedPd, simulatedLgd, selectedLoan.ead]);

  const simulatedRwa = useMemo(() => {
    // Standardised approach: base risk weight factor scaled by PD shock
    const pdFactor = simulatedPd / selectedLoan.pd;
    return selectedLoan.rwa * (0.8 + 0.2 * Math.max(0.5, pdFactor));
  }, [simulatedPd, selectedLoan]);

  const simulatedCapitalReq = useMemo(() => {
    return simulatedRwa * 0.105; // 10.5% Basel III requirement
  }, [simulatedRwa]);

  // Automated simulated recommendation based on threshold
  const autoSimulatedDecision: LoanDecision = useMemo(() => {
    if (simulatedPd > 0.08 || selectedLoan.creditScore < 640 || simulatedPd * simulatedLgd > 0.035) {
      return 'REJECTED';
    } else if (simulatedPd > 0.045 || selectedLoan.creditScore < 690) {
      return 'MANUAL REVIEW';
    } else {
      return 'APPROVED';
    }
  }, [simulatedPd, simulatedLgd, selectedLoan.creditScore]);

  // Application Risk Filtered List (Approved vs Rejected)
  const applicationLoans = useMemo(() => {
    return allLoans.filter((l) => {
      if (applicationDecisionFilter !== 'ALL' && l.decision !== applicationDecisionFilter) return false;
      if (appSearchQuery) {
        const q = appSearchQuery.toLowerCase();
        const match = l.loanId.toLowerCase().includes(q) ||
          l.customerId.toLowerCase().includes(q) ||
          l.customerName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [allLoans, applicationDecisionFilter, appSearchQuery]);

  // Behavioral Risk Filtered List
  const behavioralLoans = useMemo(() => {
    return allLoans.filter((l) => {
      if (selectedRiskCategory !== 'All' && l.riskCategory !== selectedRiskCategory) return false;
      if (selectedLoanType !== 'All' && l.loanType !== selectedLoanType) return false;
      if (selectedRegion !== 'All' && l.region !== selectedRegion) return false;
      if (behavioralSearchQuery) {
        const q = behavioralSearchQuery.toLowerCase();
        const match = l.loanId.toLowerCase().includes(q) ||
          l.customerId.toLowerCase().includes(q) ||
          l.customerName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [allLoans, selectedRiskCategory, selectedLoanType, selectedRegion, behavioralSearchQuery]);

  // Counts for Approved vs Rejected
  const approvedCount = useMemo(() => allLoans.filter(l => l.decision === 'APPROVED').length, [allLoans]);
  const rejectedCount = useMemo(() => allLoans.filter(l => l.decision === 'REJECTED').length, [allLoans]);
  const reviewCount = useMemo(() => allLoans.filter(l => l.decision === 'MANUAL REVIEW').length, [allLoans]);

  const handleApplyDecisionOverride = (newDecision: LoanDecision) => {
    setManualDecision(newDecision);
    selectedLoan.decision = newDecision;
    setShowOverrideSuccess(true);
    setTimeout(() => setShowOverrideSuccess(false), 3000);
  };

  return (
    <div id="individual-risk-page" className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Top Header & Sub-Tab Switcher (Application Risk vs Behavioral Risk) */}
      <div className="bg-[#111C35] p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Individual Loan Risk Management</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Choose between <strong>Application Scorecard (Approved/Rejected)</strong> or <strong>Behavioral Risk Analysis (PD, LGD, EAD, ECL, Capital)</strong>.
          </p>
        </div>

        {/* The Two Main Options / Pages as requested by user */}
        <div className="inline-flex p-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            type="button"
            id="tab-application-risk"
            onClick={() => setSubTab('application')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'application'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Application Risk (Scorecards)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
              {allLoans.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-behavioral-risk"
            onClick={() => setSubTab('behavioral')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'behavioral'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Behavioral Risk (PD / LGD / Capital)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono">
              Live
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. APPLICATION RISK VIEW (APPROVED / REJECTED SCORECARDS) */}
      {/* ========================================================================= */}
      {subTab === 'application' && (
        <div id="application-risk-view" className="space-y-6 animate-in fade-in duration-200">
          {/* Quick KPI stats for Approved vs Rejected */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div 
              onClick={() => setApplicationDecisionFilter('ALL')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                applicationDecisionFilter === 'ALL'
                  ? 'bg-blue-950/40 border-blue-500 shadow-md'
                  : 'bg-[#111C35] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">All Applications</span>
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white mt-1">{allLoans.length}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Total underwritten queue</div>
            </div>

            <div 
              onClick={() => setApplicationDecisionFilter('APPROVED')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                applicationDecisionFilter === 'APPROVED'
                  ? 'bg-emerald-950/50 border-emerald-500 shadow-md'
                  : 'bg-[#111C35] border-slate-800 hover:border-emerald-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approved Loans</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                  {((approvedCount / allLoans.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{approvedCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Passed cutoff & policy criteria</div>
            </div>

            <div 
              onClick={() => setApplicationDecisionFilter('REJECTED')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                applicationDecisionFilter === 'REJECTED'
                  ? 'bg-rose-950/50 border-rose-500 shadow-md'
                  : 'bg-[#111C35] border-slate-800 hover:border-rose-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Rejected Loans</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                  {((rejectedCount / allLoans.length) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="text-2xl font-black text-rose-400 mt-1">{rejectedCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Failed credit score or PD cutoff</div>
            </div>

            <div 
              onClick={() => setApplicationDecisionFilter('MANUAL REVIEW')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                applicationDecisionFilter === 'MANUAL REVIEW'
                  ? 'bg-amber-950/50 border-amber-500 shadow-md'
                  : 'bg-[#111C35] border-slate-800 hover:border-amber-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Manual Review</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                  {reviewCount}
                </span>
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1">{reviewCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Borderline or policy exception</div>
            </div>
          </div>

          {/* Main Grid: Application List + Detailed Selected Scorecard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Applications Table (Filter by Approved/Rejected) */}
            <div className="lg:col-span-5 bg-[#111C35] rounded-xl border border-slate-800 p-4 space-y-3.5 shadow-xs flex flex-col h-[650px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase">
                    Applications ({applicationLoans.length})
                  </span>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1 text-[10px]">
                  {['ALL', 'APPROVED', 'REJECTED'].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setApplicationDecisionFilter(filter)}
                      className={`px-2 py-0.5 rounded font-bold transition-colors ${
                        applicationDecisionFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search application ID, customer..."
                  value={appSearchQuery}
                  onChange={(e) => setAppSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                {applicationLoans.map((loan) => {
                  const isSelected = loan.loanId === selectedLoan.loanId;
                  return (
                    <div
                      key={loan.loanId}
                      onClick={() => onSelectLoan(loan)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-950/60 border-blue-500 shadow-md'
                          : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-xs text-white flex items-center gap-1.5">
                            <span>{loan.customerName}</span>
                            <span className="font-mono text-[10px] text-slate-400">{loan.loanId}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {loan.loanType} • {formatINR(loan.loanAmount)}
                          </div>
                        </div>
                        <DecisionBadge decision={loan.decision} size="sm" />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                        <span>Score: <strong className="text-slate-200">{loan.creditScore}</strong></span>
                        <span>PD: <strong className="text-slate-200">{formatPercent(loan.pd)}</strong></span>
                        <span>ECL: <strong className="text-slate-200">{formatINR(loan.ecl)}</strong></span>
                      </div>
                    </div>
                  );
                })}

                {applicationLoans.length === 0 && (
                  <div className="text-center py-10 text-xs text-slate-400">
                    No loan applications match the current filter.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Application Scorecard for Selected Loan */}
            <div className="lg:col-span-7 bg-[#111C35] rounded-xl border border-slate-800 p-5 space-y-5 shadow-xs h-[650px] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedLoan.customerName}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {selectedLoan.loanId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customer ID: <span className="font-mono text-slate-300">{selectedLoan.customerId}</span> • Branch: {selectedLoan.branch} ({selectedLoan.region})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <DecisionBadge decision={selectedLoan.decision} size="md" />
                  <RiskBadge category={selectedLoan.riskCategory} size="md" />
                </div>
              </div>

              {/* Decision Rationale Banner */}
              <div className={`p-4 rounded-xl border ${
                selectedLoan.decision === 'APPROVED' 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                  : selectedLoan.decision === 'REJECTED'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide mb-1">
                  {selectedLoan.decision === 'APPROVED' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                  <span>Underwriting Rule Assessment: {selectedLoan.decision}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-200">
                  {selectedLoan.decisionReason || `Evaluated against Model PD cutoff (${(selectedLoan.pdThreshold * 100).toFixed(1)}%) and Bureau score floor. Current PD is ${(selectedLoan.pd * 100).toFixed(2)}% with ECL of ${formatINR(selectedLoan.ecl)}.`}
                </p>
              </div>

              {/* Scorecard Reason Codes & Drivers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Positive Scorecard Drivers</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedLoan.positiveFactors?.length > 0 ? (
                      selectedLoan.positiveFactors.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400">Regular income stability, clean bureau history.</li>
                    )}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" />
                    <span>Risk Deterrents / Penalties</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedLoan.negativeFactors?.length > 0 ? (
                      selectedLoan.negativeFactors.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400">No major negative delinquency triggers detected.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Key Application Financials */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Loan Amount</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{formatINR(selectedLoan.loanAmount)}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Credit Score</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{selectedLoan.creditScore}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">DTI Ratio</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{selectedLoan.dti}%</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Monthly Income</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{formatINR(selectedLoan.monthlyIncome)}</span>
                </div>
              </div>

              {/* Action Buttons for Underwriter (Approve / Reject Override) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Underwriter Decision Action</span>
                  <span className="text-[10px] text-slate-400">Authorized Officer: {userRole}</span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleApplyDecisionOverride('APPROVED')}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Application</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyDecisionOverride('REJECTED')}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shadow-rose-600/30"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyDecisionOverride('MANUAL REVIEW')}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shadow-amber-600/30"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Send to Manual Review</span>
                  </button>
                </div>

                {showOverrideSuccess && (
                  <div className="p-2 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>Decision status updated to <strong>{selectedLoan.decision}</strong> and saved to audit trail.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BEHAVIORAL RISK VIEW (PD, LGD, EAD, ECL, CAPITAL, CUSTOMER ID, ETC) */}
      {/* ========================================================================= */}
      {subTab === 'behavioral' && (
        <div id="behavioral-risk-view" className="space-y-6 animate-in fade-in duration-200">
          {/* Top Info Banner explicitly mentioning the parameters */}
          <div className="bg-[#111C35] rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white">Behavioral Risk Matrix & Capital Solvency Engine</span>
                <p className="text-[11px] text-slate-400">
                  Comprehensive tracking of <strong>Customer ID, Loan ID, Loan Amount, PD, LGD, EAD, ECL, Credit Score, Risk Category, Decision, Region, Loan Type & Basel Capital</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAiAssistant}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI Assistant</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulation & Sensitivity Deck for Selected Loan */}
          <div className="bg-[#111C35] rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Active Loan Risk Sensitivity & Real-Time Decisioning</h3>
                  <p className="text-[11px] text-slate-400">
                    Adjust PD & LGD in real time to simulate ECL impact, Basel RWA Capital requirement, and Decision outcomes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Selected:</span>
                <span className="font-bold text-white">{selectedLoan.customerName}</span>
                <span className="font-mono text-blue-400 bg-blue-950 px-1.5 py-0.2 rounded border border-blue-800">{selectedLoan.loanId}</span>
              </div>
            </div>

            {/* Exact Required Fields Metric Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Customer ID & Loan ID */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Customer / Loan ID</div>
                <div className="text-xs font-bold text-white font-mono mt-0.5 truncate">{selectedLoan.customerId}</div>
                <div className="text-[11px] text-blue-400 font-mono mt-0.5 truncate">{selectedLoan.loanId}</div>
              </div>

              {/* Loan Amount & Loan Type */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Amount & Type</div>
                <div className="text-xs font-bold text-white mt-0.5">{formatINR(selectedLoan.loanAmount)}</div>
                <div className="text-[11px] text-slate-300 mt-0.5 truncate">{selectedLoan.loanType}</div>
              </div>

              {/* Credit Score & Risk Category */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Score & Risk Category</div>
                <div className="text-xs font-bold text-white mt-0.5">{selectedLoan.creditScore}</div>
                <div className="mt-1">
                  <RiskBadge category={selectedLoan.riskCategory} size="sm" showIcon={false} />
                </div>
              </div>

              {/* PD (Probability of Default) */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">PD (Default Prob.)</div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">{formatPercent(simulatedPd)}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Base: {formatPercent(selectedLoan.pd)}</div>
              </div>

              {/* LGD & EAD */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">LGD & EAD Exposure</div>
                <div className="text-xs font-bold text-white mt-0.5">LGD: {formatPercent(simulatedLgd)}</div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5">EAD: {formatINR(selectedLoan.ead)}</div>
              </div>

              {/* ECL & Basel Capital */}
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-900/60 bg-emerald-950/20">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">ECL Loss & Capital</div>
                <div className="text-xs font-bold text-white mt-0.5">ECL: {formatINR(simulatedEcl)}</div>
                <div className="text-[11px] text-emerald-300 font-bold mt-0.5">Cap: {formatINR(simulatedCapitalReq)}</div>
              </div>
            </div>

            {/* Sensitivity Sliders & Real-Time Decision Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              {/* Slider 1: Simulated PD */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Simulate PD (Probability of Default):</span>
                  <span className="font-bold text-blue-400 font-mono">{(simulatedPd * 100).toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0.005"
                  max="0.25"
                  step="0.002"
                  value={simulatedPd}
                  onChange={(e) => setSimulatedPd(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.5% (Prime)</span>
                  <span>Cutoff: 6.0%</span>
                  <span>25.0% (Distressed)</span>
                </div>
              </div>

              {/* Slider 2: Simulated LGD */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Simulate LGD (Loss Given Default):</span>
                  <span className="font-bold text-indigo-400 font-mono">{(simulatedLgd * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.02"
                  value={simulatedLgd}
                  onChange={(e) => setSimulatedLgd(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10% (High Collateral)</span>
                  <span>Average: 45%</span>
                  <span>90% (Unsecured)</span>
                </div>
              </div>
            </div>

            {/* Decision Engine Result & Action Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 uppercase">Simulated Recommendation:</span>
                  <DecisionBadge decision={autoSimulatedDecision} size="sm" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Formula: Expected Credit Loss <strong className="text-white">₹{simulatedEcl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong> | Basel Capital Req (10.5% RWA): <strong className="text-emerald-400">₹{simulatedCapitalReq.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyDecisionOverride('APPROVED')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs shadow-emerald-600/30"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyDecisionOverride('REJECTED')}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs shadow-rose-600/30"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSimulatedPd(selectedLoan.pd);
                    setSimulatedLgd(selectedLoan.lgd);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
                  title="Reset to baseline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Comprehensive Behavioral Risk Database Table (All Requested Columns) */}
          <div className="bg-[#111C35] rounded-xl border border-slate-800 shadow-xs overflow-hidden space-y-3 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Behavioral Risk & Exposure Register</h3>
                <p className="text-xs text-slate-400">
                  Displaying Customer ID, Loan ID, Amount, PD, LGD, EAD, ECL, Score, Risk, Decision, Region, Type & Capital.
                </p>
              </div>

              {/* Search & Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Customer/Loan ID..."
                    value={behavioralSearchQuery}
                    onChange={(e) => setBehavioralSearchQuery(e.target.value)}
                    className="w-48 pl-8 pr-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={selectedLoanType}
                  onChange={(e) => setSelectedLoanType(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200"
                >
                  <option value="All">All Types</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Auto Loan">Auto Loan</option>
                  <option value="MSME Loan">MSME Loan</option>
                  <option value="Credit Card">Credit Card</option>
                </select>

                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200"
                >
                  <option value="All">All Regions</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="West">West</option>
                  <option value="East">East</option>
                  <option value="Central">Central</option>
                </select>
              </div>
            </div>

            {/* The Table with every field specified in the prompt */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-300 font-semibold border-b border-slate-800 whitespace-nowrap">
                  <tr>
                    <th className="py-2.5 px-3">Customer ID</th>
                    <th className="py-2.5 px-3">Loan ID</th>
                    <th className="py-2.5 px-3">Loan Amount</th>
                    <th className="py-2.5 px-3">Loan Type</th>
                    <th className="py-2.5 px-3">Region</th>
                    <th className="py-2.5 px-3">Credit Score</th>
                    <th className="py-2.5 px-3">PD</th>
                    <th className="py-2.5 px-3">LGD</th>
                    <th className="py-2.5 px-3">EAD</th>
                    <th className="py-2.5 px-3">ECL</th>
                    <th className="py-2.5 px-3">Capital (RWA)</th>
                    <th className="py-2.5 px-3">Risk Category</th>
                    <th className="py-2.5 px-3">Decision</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 whitespace-nowrap">
                  {behavioralLoans.map((loan) => {
                    const isSelected = loan.loanId === selectedLoan.loanId;
                    return (
                      <tr
                        key={loan.loanId}
                        className={`hover:bg-slate-800/50 transition-colors ${
                          isSelected ? 'bg-blue-950/40' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-300">
                          {loan.customerId}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-blue-400 font-semibold">
                          {loan.loanId}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">
                          {formatINR(loan.loanAmount)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {loan.loanType}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {loan.region}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">
                          {loan.creditScore}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-amber-400">
                          {formatPercent(loan.pd)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {formatPercent(loan.lgd)}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-300">
                          {formatINR(loan.ead)}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">
                          {formatINR(loan.ecl)}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-400">
                          {formatINR(loan.capitalRequirement || loan.rwa * 0.105)}
                        </td>
                        <td className="py-2.5 px-3">
                          <RiskBadge category={loan.riskCategory} size="sm" showIcon={false} />
                        </td>
                        <td className="py-2.5 px-3">
                          <DecisionBadge decision={loan.decision} size="sm" />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onSelectLoan(loan)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 font-semibold transition-colors border border-slate-700"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
