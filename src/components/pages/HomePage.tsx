import React from 'react';
import { PortfolioSummary, RiskDistributionData, LoanApplication } from '../../types';
import { formatINR, formatPercent, formatNumber } from '../../utils/formatting';
import { 
  Building2, 
  UserCheck, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  Coins, 
  Scale, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  ChevronRight,
  PieChart as PieIcon,
  Bot,
  Zap,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

interface HomePageProps {
  summary: PortfolioSummary;
  riskDist: RiskDistributionData[];
  recentLoans: LoanApplication[];
  onNavigate: (tab: string, loan?: LoanApplication, subTab?: 'application' | 'behavioral') => void;
  onOpenAiAssistant: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  summary,
  riskDist,
  recentLoans,
  onNavigate,
  onOpenAiAssistant,
}) => {
  return (
    <div id="home-landing-page" className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200 select-none">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0D1B3E] via-[#11234D] to-[#0A1633] p-7 rounded-2xl text-white shadow-xl border border-blue-900/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                AI-Powered Credit Risk Intelligence
              </span>
              <span className="text-xs text-slate-300">Enterprise Edition v3.4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Credit Risk & Underwriting Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Select your risk analysis workflow below. Choose <strong>Portfolio Risk</strong> for macro solvency and cohort analytics, or <strong>Individual Risk</strong> for application scoring (Approved/Rejected) and behavioral risk monitoring (PD, LGD, EAD, ECL, Capital).
            </p>
          </div>

          {/* Quick AI Trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-blue-200" />
              <span>Ask AI Copilot</span>
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </button>
          </div>
        </div>

        {/* Subtle Background Glow Accent */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Primary Gateway Cards: Portfolio Risk vs Individual Risk (User Core Requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. PORTFOLIO RISK HUB CARD */}
        <div 
          id="card-select-portfolio-risk"
          className="group relative bg-[#111C35] hover:bg-[#142240] rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 shadow-xl transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:scale-105 transition-transform">
                <PieIcon className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-800/80">
                Macro & Portfolio View
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
              Portfolio Risk Analytics
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Analyze aggregated credit exposure, Basel III regulatory capital adequacy (CRAR), delinquency transition roll-rates, vintage cohort curves, and reverse stress testing.
            </p>

            {/* Quick Metrics Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Exposure</div>
                <div className="text-sm font-bold text-white mt-0.5">{formatINR(summary.totalExposure, true)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total ECL Loss</div>
                <div className="text-sm font-bold text-white mt-0.5">{formatINR(summary.totalEcl, true)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Average PD</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{formatPercent(summary.avgPd)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">CRAR Solvency</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{formatPercent(summary.capitalAdequacyRatio || 0.1485)}</div>
              </div>
            </div>

            {/* Sub-Feature Links */}
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Vintage Cohorts (MOB)</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Roll-Rate Transition</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Basel III RWA</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Macro Shocks</span>
            </div>
          </div>

          <div className="pt-6 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{formatNumber(summary.totalLoans)} active balance sheet accounts</span>
            <button
              type="button"
              id="btn-open-portfolio-hub"
              onClick={() => onNavigate('overview')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <span>Explore Portfolio Risk</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* 2. INDIVIDUAL RISK HUB CARD */}
        <div 
          id="card-select-individual-risk"
          className="group relative bg-[#111C35] hover:bg-[#142240] rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                Loan-Level & Behavioral
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
              Individual Risk & Underwriting
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Evaluate single borrower risk profiles via two specialized engines: <strong>Application Risk</strong> (Approved/Rejected new origination scorecards) and <strong>Behavioral Risk</strong> (PD, LGD, EAD, ECL, Capital & Real-Time Decisioning).
            </p>

            {/* Direct Sub-choice Buttons in Individual Risk Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {/* Option A: Application Risk */}
              <div 
                onClick={() => onNavigate('individual_risk', undefined, 'application')}
                className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">Application Risk</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Approved" />
                    <span className="w-2 h-2 rounded-full bg-rose-400" title="Rejected" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  New originations with <strong>Approved</strong> & <strong>Rejected</strong> loan scorecards, cutoff policies, and rules.
                </p>
                <div className="mt-2 text-[10px] font-bold text-blue-400 flex items-center gap-1">
                  <span>Open Scorecards</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Option B: Behavioral Risk */}
              <div 
                onClick={() => onNavigate('individual_risk', undefined, 'behavioral')}
                className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">Behavioral Risk</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">PD • LGD • ECL</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Customer ID, Loan ID, PD, LGD, EAD, ECL, Score, Region, Capital with <strong>Approve/Reject</strong> actions.
                </p>
                <div className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <span>Open Monitoring</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Quick Parameters Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">CustomerID</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">LoanID</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">PD</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">LGD</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">EAD</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">ECL</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Capital</span>
            </div>
          </div>

          <div className="pt-6 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">SHAP Explainability & Real-Time Engine</span>
            <button
              type="button"
              id="btn-open-individual-hub"
              onClick={() => onNavigate('individual_risk', undefined, 'application')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <span>Launch Individual Risk</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Evaluated Loan Applications Grid */}
      <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Recent Risk Underwritings</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any application to evaluate via Application Scorecard or Behavioral Risk metrics.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('multiple')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {recentLoans.slice(0, 6).map((loan) => (
            <div
              key={loan.loanId}
              onClick={() => onNavigate('individual_risk', loan, 'behavioral')}
              className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all duration-150 space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {loan.customerName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {loan.loanId} • {loan.customerId}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                    loan.decision === 'APPROVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : loan.decision === 'REJECTED'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {loan.decision}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Amount</span>
                  <span className="font-bold text-white">{formatINR(loan.loanAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">PD / Score</span>
                  <span className="font-bold text-white">
                    {formatPercent(loan.pd)} <span className="text-slate-400 font-normal">({loan.creditScore})</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">ECL Loss</span>
                  <span className="font-bold text-white">{formatINR(loan.ecl)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{loan.loanType} • {loan.region}</span>
                <span className="text-blue-400 font-semibold group-hover:underline">Inspect Profile →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
