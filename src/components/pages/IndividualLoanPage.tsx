import React, { useState } from 'react';
import { LoanApplication } from '../../types';
import { DecisionCard } from '../common/DecisionCard';
import { RiskBadge } from '../common/RiskBadge';
import { formatINR, formatPercent, formatNumber } from '../../utils/formatting';
import { 
  User, 
  Search, 
  ShieldAlert, 
  Percent, 
  Coins, 
  Calculator, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Clock, 
  Cpu, 
  FileText,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Cell 
} from 'recharts';

interface IndividualLoanPageProps {
  selectedLoan: LoanApplication;
  allLoans: LoanApplication[];
  onSelectLoan: (loan: LoanApplication) => void;
  onAskAiWithContext: (loan: LoanApplication) => void;
}

export const IndividualLoanPage: React.FC<IndividualLoanPageProps> = ({
  selectedLoan,
  allLoans,
  onSelectLoan,
  onAskAiWithContext,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  const filteredDropdownLoans = allLoans.filter(l => 
    l.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Credit Score Gauge calculations
  const minScore = 300;
  const maxScore = 900;
  const scorePct = Math.max(0, Math.min(100, ((selectedLoan.creditScore - minScore) / (maxScore - minScore)) * 100));

  // SHAP Chart data
  const shapData = selectedLoan.shapValues.map(s => ({
    feature: s.feature,
    impact: Math.abs(s.impact * 100),
    rawImpact: s.impact,
    isRiskIncreasing: s.isRiskIncreasing,
    color: s.isRiskIncreasing ? '#ef4444' : '#10b981'
  }));

  return (
    <div id="individual-loan-page" className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Search / Selector Bar */}
      <div className="bg-[#111C35] rounded-xl p-4 border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Search Customer / Loan ID</div>
            <div className="text-xs text-slate-400">Select an application to evaluate customer risk profile</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <select
            id="loan-selector-dropdown"
            value={selectedLoan.loanId}
            onChange={(e) => {
              const found = allLoans.find(l => l.loanId === e.target.value);
              if (found) onSelectLoan(found);
            }}
            className="w-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            {allLoans.map((l) => (
              <option key={l.loanId} value={l.loanId}>
                {l.loanId} • {l.customerName} ({l.loanType} - {l.decision})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onAskAiWithContext(selectedLoan)}
            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs transition-colors shadow-blue-600/30"
            title="Ask AI about this loan"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>AI Risk Audit</span>
          </button>
        </div>
      </div>

      {/* Customer Profile Card (Requirement #6) */}
      <div id="customer-profile-card" className="bg-[#111C35] rounded-xl p-6 border border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-600/30">
              {selectedLoan.customerName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">{selectedLoan.customerName}</h2>
                <RiskBadge category={selectedLoan.riskCategory} size="sm" />
                <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80">
                  {selectedLoan.customerId}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap font-medium">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {selectedLoan.employmentType}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedLoan.branch}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Applied: {selectedLoan.applicationDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Requested Facility</div>
              <div className="text-base font-extrabold text-white">{formatINR(selectedLoan.loanAmount)}</div>
              <div className="text-[11px] text-slate-400">{selectedLoan.loanType} • {selectedLoan.loanTenureMonths} Mos @ {selectedLoan.interestRate}%</div>
            </div>
          </div>
        </div>

        {/* Profile Attribute Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-5">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Age</div>
            <div className="text-sm font-bold text-white mt-0.5">{selectedLoan.customerAge} Years</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Monthly Income</div>
            <div className="text-sm font-bold text-white mt-0.5">{formatINR(selectedLoan.monthlyIncome)}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Employment Type</div>
            <div className="text-sm font-bold text-white mt-0.5">{selectedLoan.employmentType}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Region / Zone</div>
            <div className="text-sm font-bold text-white mt-0.5">{selectedLoan.region} Zone</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Origination Cohort</div>
            <div className="text-sm font-bold text-white mt-0.5">{selectedLoan.originationCohort}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Loan Status</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{selectedLoan.status}</div>
          </div>
        </div>
      </div>

      {/* Individual Risk KPI Cards (Requirement #7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Credit Score Card */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Credit Score</span>
              <span className="text-[10px] font-bold text-slate-500">CIBIL/EXP</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {selectedLoan.creditScore} <span className="text-xs font-normal text-slate-400">/ 900</span>
            </div>
            {/* Score Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  selectedLoan.creditScore >= 750 ? 'bg-emerald-500' :
                  selectedLoan.creditScore >= 650 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${scorePct}%` }}
              />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs mt-3">
            <span className="text-slate-400">Risk Band:</span>
            <span className={`font-bold ${
              selectedLoan.creditScore >= 750 ? 'text-emerald-400' :
              selectedLoan.creditScore >= 650 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {selectedLoan.riskCategory}
            </span>
          </div>
        </div>

        {/* Probability of Default (PD) */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prob. of Default (PD)</span>
              <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {formatPercent(selectedLoan.pd)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Ceiling: ≤{formatPercent(selectedLoan.pdThreshold)}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs mt-3">
            <span className="text-slate-400">Model:</span>
            <span className="font-mono text-slate-300 font-semibold">XGBoost v3.4</span>
          </div>
        </div>

        {/* Loss Given Default (LGD) */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Loss Given Default</span>
              <div className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {formatPercent(selectedLoan.lgd)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Collateral haircut applied
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs mt-3">
            <span className="text-slate-400">Recovery Rate:</span>
            <span className="font-bold text-white">{formatPercent(1 - selectedLoan.lgd)}</span>
          </div>
        </div>

        {/* Exposure at Default (EAD) */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Exposure at Default</span>
              <div className="p-1 rounded bg-teal-500/20 text-teal-400">
                <Coins className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mt-1 truncate">
              {formatINR(selectedLoan.ead)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              CCF Multiplier: 100%
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs mt-3">
            <span className="text-slate-400">Type:</span>
            <span className="font-semibold text-slate-300">{selectedLoan.loanType}</span>
          </div>
        </div>

        {/* Expected Credit Loss (ECL) */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl p-5 text-white shadow-md border border-slate-800 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Expected Loss (ECL)</span>
              <div 
                className="cursor-pointer text-blue-300 hover:text-white transition-colors"
                onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
              >
                <Calculator className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {formatINR(selectedLoan.ecl)}
            </div>
            <div className="text-xs text-blue-200/80 mt-1">
              IFRS 9 Provisioning Stage 1
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs mt-3 text-blue-300 font-mono">
            <span>ECL = PD × LGD × EAD</span>
          </div>

          {/* Formula Tooltip Box */}
          {showFormulaTooltip && (
            <div className="absolute inset-0 bg-slate-950/95 p-4 rounded-xl text-xs z-20 flex flex-col justify-between border border-slate-700">
              <div>
                <div className="font-bold text-emerald-400 mb-1">ECL Calculation Breakdown:</div>
                <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                  <div>• PD = {formatPercent(selectedLoan.pd)}</div>
                  <div>• LGD = {formatPercent(selectedLoan.lgd)}</div>
                  <div>• EAD = {formatINR(selectedLoan.ead)}</div>
                  <div className="pt-1 text-white font-bold border-t border-slate-800">
                    {formatPercent(selectedLoan.pd)} × {formatPercent(selectedLoan.lgd)} × {formatINR(selectedLoan.ead)} = {formatINR(selectedLoan.ecl)}
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowFormulaTooltip(false)}
                className="text-[10px] text-blue-400 hover:text-blue-200 underline text-right"
              >
                Close breakdown
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loan Decision Card (Requirement #8) */}
      <DecisionCard loan={selectedLoan} />

      {/* Risk Factors & Explainability Section (Requirement #9) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Positive & Negative Drivers */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Key Risk Factors</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Underwriting Drivers</span>
          </div>

          {/* Positive Factors */}
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Positive Mitigating Factors</span>
            </div>
            <div className="space-y-2">
              {selectedLoan.positiveFactors.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Negative Factors */}
          <div className="pt-2">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Negative Risk Drivers</span>
            </div>
            <div className="space-y-2">
              {selectedLoan.negativeFactors.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200">
                  <span className="text-rose-400 font-bold">⚠</span>
                  <span>{f}</span>
                </div>
              ))}
              {selectedLoan.negativeFactors.length === 0 && (
                <div className="text-xs text-slate-400 italic p-2 bg-slate-900/80 rounded border border-slate-800">
                  No adverse negative risk factors flagged during automated scan.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Explainability / SHAP Feature Importance */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span>Why was this decision made? (SHAP Explainability)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Feature contribution to model probability of default</p>
              </div>
            </div>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapData} layout="vertical" margin={{ left: 20, right: 20, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="feature" tick={{ fontSize: 10, fill: '#cbd5e1' }} width={130} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: number) => [`${val.toFixed(2)}% effect`, 'Impact']} 
                  />
                  <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                    {shapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-lg text-xs border border-slate-800 mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span> Risk Decreasing
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-xs"></span> Risk Increasing
              </span>
            </div>
            <span className="text-slate-400 font-mono text-[10px]">SHAP TreeExplainer v3.4</span>
          </div>
        </div>
      </div>

      {/* Customer Financial Profile Cards & Charts (Requirement #10) */}
      <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Customer Financial Profile & Debt Service Capacity</h3>
            <p className="text-xs text-slate-400">Comprehensive liquidity, leverage ratios, and past credit repayment discipline</p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Verified via CIBIL & Account Aggregator</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Existing Loans</div>
            <div className="text-base font-bold text-white mt-1">{formatINR(selectedLoan.existingLoansExposure)}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{selectedLoan.activeLoansCount} active facilities</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Monthly Obligations</div>
            <div className="text-base font-bold text-white mt-1">{formatINR(selectedLoan.monthlyObligations)}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">EMIs + Cards</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">DTI Ratio</div>
            <div className="text-base font-bold text-white mt-1">{formatPercent(selectedLoan.dti)}</div>
            <div className={`text-[10px] font-semibold mt-0.5 ${selectedLoan.dti <= 45 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {selectedLoan.dti <= 45 ? 'Safe (≤ 45%)' : 'High Burden (> 45%)'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">LTI Ratio</div>
            <div className="text-base font-bold text-white mt-1">{selectedLoan.lti.toFixed(1)}x</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Loan / Income multiple</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Credit Utilization</div>
            <div className="text-base font-bold text-white mt-1">{formatPercent(selectedLoan.creditUtilization)}</div>
            <div className={`text-[10px] font-semibold mt-0.5 ${selectedLoan.creditUtilization <= 40 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {selectedLoan.creditUtilization <= 40 ? 'Optimal (≤ 40%)' : 'Elevated'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Avg Delay / DPD</div>
            <div className="text-base font-bold text-white mt-1">{selectedLoan.avgRepaymentDelayDays} Days</div>
            <div className={`text-[10px] font-semibold mt-0.5 ${selectedLoan.delinquencyHistory36m === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {selectedLoan.delinquencyHistory36m} incidents in 36M
            </div>
          </div>
        </div>
      </div>

      {/* Individual Loan Risk Timeline (Requirement #11) */}
      <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Individual Loan Risk & Underwriting Timeline</span>
            </h3>
            <p className="text-xs text-slate-400">End-to-end trace of scoring, calibration, and automated decision pipeline</p>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
            Pipeline Executed: 100%
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {selectedLoan.lifecycleTimeline.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-[#111C35] ${
                step.status === 'completed' ? 'bg-emerald-500 ring-2 ring-emerald-500/30' :
                step.status === 'in-progress' ? 'bg-amber-500 ring-2 ring-amber-500/30 animate-pulse' : 'bg-slate-700'
              }`} />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="font-bold text-xs text-white">{step.stage}</div>
                <div className="text-[10px] font-mono text-slate-400">{step.timestamp}</div>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{step.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
