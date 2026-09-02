import React from 'react';
import { PORTFOLIO_STATS, PORTFOLIO_RATING_DISTRIBUTION } from '../../data/mockData';
import { 
  UserCheck, 
  PieChart, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  Landmark, 
  FileText, 
  Activity, 
  FlaskConical, 
  CheckCircle2, 
  BarChart3,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div id="home-dashboard-page" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero / Platform Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-slate-700/80 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Basel III & IFRS 9 Compliant Architecture</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            AI CREDIT RISK PLATFORM
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
            AI-powered credit risk assessment and portfolio risk management platform. Built with strict methodological separation between Application Risk (New Customers), Behavioral Risk (Existing Seasoned Mortgages), and Portfolio Capital Analytics.
          </p>
        </div>
      </div>

      {/* Top-Level Portfolio / Model KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Portfolio Health & Solvency KPIs (Enterprise Aggregate)
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">Live Panel 2024-Q3</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Total Accounts */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Total Accounts</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{PORTFOLIO_STATS.totalLoans.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-600 mt-1 font-medium">Active retail mortgages</div>
          </div>

          {/* Average PD */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Average 12M PD</div>
            <div className="text-xl font-bold text-blue-600 mt-1">{(PORTFOLIO_STATS.averagePd * 100).toFixed(2)}%</div>
            <div className="text-[11px] text-slate-600 mt-1 font-medium">TTC Calibrated: {(PORTFOLIO_STATS.averageTtcPd * 100).toFixed(2)}%</div>
          </div>

          {/* Default Rate */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Default Rate (NPA)</div>
            <div className="text-xl font-bold text-emerald-600 mt-1">{(PORTFOLIO_STATS.defaultRate * 100).toFixed(2)}%</div>
            <div className="text-[11px] text-slate-600 mt-1 font-medium">{PORTFOLIO_STATS.npaCount} accounts in 90+ DPD</div>
          </div>

          {/* Expected Loss */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Expected Loss (ECL)</div>
            <div className="text-xl font-bold text-amber-600 mt-1">{formatCurrency(PORTFOLIO_STATS.totalExpectedLoss)}</div>
            <div className="text-[11px] text-slate-600 mt-1 font-medium">0.98% of total exposure</div>
          </div>

          {/* Capital Requirement */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">Basel III Capital</div>
            <div className="text-xl font-bold text-purple-600 mt-1">{formatCurrency(PORTFOLIO_STATS.totalCapitalRequirement)}</div>
            <div className="text-[11px] text-slate-600 mt-1 font-medium">10.5% Pillar 1 + CCB Buffer</div>
          </div>
        </div>
      </div>

      {/* Two Major Primary Action Cards: INDIVIDUAL RISK vs PORTFOLIO RISK */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Core Risk Assessment Gateways
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: INDIVIDUAL RISK */}
          <div 
            id="action-card-individual-risk"
            onClick={() => onNavigate('individual_risk')}
            className="group bg-white rounded-2xl p-6 md:p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                  Single Account Level
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  <span>INDIVIDUAL RISK</span>
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Assess credit risk for a single customer or account with strict methodological separation between originations and seasoned accounts.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div 
                  onClick={(e) => { e.stopPropagation(); onNavigate('application_scorecard'); }}
                  className="p-3 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors"
                >
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-emerald-700">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Application Scorecard</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">For new customer loan originations & thin files</div>
                </div>

                <div 
                  onClick={(e) => { e.stopPropagation(); onNavigate('behavioral_scorecard'); }}
                  className="p-3 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-blue-700">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Behavioral Scorecard</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">For seasoned accounts (MOB ≥ 6) with 12M PD & Basel ECL</div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Launch Individual Risk Module</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: PORTFOLIO RISK */}
          <div 
            id="action-card-portfolio-risk"
            onClick={() => onNavigate('portfolio_risk')}
            className="group bg-white rounded-2xl p-6 md:p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                  <PieChart className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                  Macro / Aggregate Level
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center gap-2">
                  <span>PORTFOLIO RISK</span>
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Analyze risk across a portfolio of thousands of loans. Upload datasets, view rating distributions, perform vintage cohort analysis, and execute regulatory stress testing.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-purple-700">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Vintage & MOB Analysis</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Origination cohort decay & seasoning hazard curves</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Macro Stress Testing</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Base Case, Mild Downturn, and Severe Downturn shocks</div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Launch Portfolio Analytics & Stress Engine</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Quick Navigation Grid for Model Governance & Analytics */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Model Governance & Data Analytics Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('model_performance')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">Model Performance</div>
            <div className="text-[11px] text-slate-500 mt-0.5">AUC (0.864), Gini (0.728), KS (48.2%), ROC & Calibration curves.</div>
          </div>

          <div 
            onClick={() => onNavigate('data_quality')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">Data Quality & Audit</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Reconciliation checks RC-01 to RC-05, outlier & anomaly filters.</div>
          </div>

          <div 
            onClick={() => onNavigate('eda_apc')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">EDA & APC Analysis</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Age-Period-Cohort decomposition, correlation heatmaps & distributions.</div>
          </div>

          <div 
            onClick={() => onNavigate('reports')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900">Regulatory Reports</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Instant PDF & audit export for underwriting, ECL & Basel capital.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
