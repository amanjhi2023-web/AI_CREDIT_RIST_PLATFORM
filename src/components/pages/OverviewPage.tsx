import React from 'react';
import { PortfolioSummary, RiskDistributionData, LoanApplication } from '../../types';
import { KpiCard } from '../common/KpiCard';
import { formatINR, formatPercent, formatNumber } from '../../utils/formatting';
import { 
  Building2, 
  Coins, 
  ShieldAlert, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Landmark, 
  Scale, 
  ArrowRight,
  PieChart as PieIcon,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface OverviewPageProps {
  summary: PortfolioSummary;
  riskDist: RiskDistributionData[];
  recentLoans: LoanApplication[];
  onNavigate: (tab: string, loan?: LoanApplication) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  summary,
  riskDist,
  recentLoans,
  onNavigate,
}) => {
  const pieColors = ['#10b981', '#f59e0b', '#ef4444'];

  const decisionChartData = [
    { name: 'Approved', count: summary.approvedLoansCount, percentage: 73, color: '#10b981' },
    { name: 'Manual Review', count: summary.manualReviewLoansCount, percentage: 14, color: '#f59e0b' },
    { name: 'Rejected', count: summary.rejectedLoansCount, percentage: 13, color: '#ef4444' },
  ];

  const exposureVsEclData = riskDist.map(r => ({
    name: r.category,
    exposureCr: r.exposure / 10000000,
    eclCr: r.ecl / 10000000,
    avgPdPct: (r.avgPd * 100).toFixed(1)
  }));

  return (
    <div id="overview-dashboard-page" className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Executive View
            </span>
            <span className="text-xs text-slate-300">Q3 FY2026-27</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Credit Risk Overview</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Monitor loan performance, customer risk, portfolio exposure and capital requirements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('individual')}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
          >
            <span>Analyze Individual Loan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            <span>Portfolio Deep-Dive</span>
          </button>
        </div>
      </div>

      {/* 8 Top KPI Cards requested in requirement #4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          id="kpi-total-loans"
          title="Total Loans"
          value={formatNumber(summary.totalLoans)}
          changeText="↑ 4.2% vs last Qtr"
          isPositiveChange={true}
          isChangeGood={true}
          icon={Building2}
          tooltipText="Total count of active and underwritten credit facilities on the balance sheet."
          subtext="12,450 unique borrowers"
          iconBgColor="bg-blue-500/20"
          iconTextColor="text-blue-400"
        />

        <KpiCard
          id="kpi-total-exposure"
          title="Total Exposure"
          value={formatINR(summary.totalExposure, true)}
          changeText="↑ 8.4% YoY"
          isPositiveChange={true}
          isChangeGood={true}
          icon={Coins}
          tooltipText="Total aggregated principal credit exposure across all loan segments."
          subtext="EAD: ₹238.0 Cr"
          iconBgColor="bg-indigo-500/20"
          iconTextColor="text-indigo-400"
        />

        <KpiCard
          id="kpi-total-ecl"
          title="Total ECL"
          value={formatINR(summary.totalEcl, true)}
          changeText="↓ 2.1% (Provision drop)"
          isPositiveChange={false}
          isChangeGood={true} // ECL dropping is good!
          icon={ShieldAlert}
          tooltipText="Expected Credit Loss (ECL = PD × LGD × EAD) computed under IFRS 9 / Ind AS 109."
          subtext="Coverage: 2.77% of book"
          iconBgColor="bg-emerald-500/20"
          iconTextColor="text-emerald-400"
        />

        <KpiCard
          id="kpi-avg-pd"
          title="Average PD"
          value={formatPercent(summary.avgPd)}
          changeText="↓ 0.35% (Credit quality up)"
          isPositiveChange={false}
          isChangeGood={true} // PD drop is good
          icon={TrendingDown}
          tooltipText="Weighted average 12-month Probability of Default across the active portfolio."
          subtext="Benchmark: ≤ 6.0%"
          iconBgColor="bg-emerald-500/20"
          iconTextColor="text-emerald-400"
        />

        <KpiCard
          id="kpi-default-rate"
          title="Default Rate"
          value={formatPercent(summary.defaultRate)}
          changeText="↓ 0.15% (NPA trend down)"
          isPositiveChange={false}
          isChangeGood={true}
          icon={ShieldCheck}
          tooltipText="Gross Non-Performing Asset (NPA / 90+ DPD) percentage of gross advances."
          subtext="Industry Avg: 3.2%"
          iconBgColor="bg-teal-500/20"
          iconTextColor="text-teal-400"
        />

        <KpiCard
          id="kpi-high-risk"
          title="High Risk Loans"
          value={formatNumber(summary.highRiskLoansCount)}
          changeText="13.0% of portfolio"
          isPositiveChange={null}
          icon={AlertTriangle}
          tooltipText="Accounts with Point-in-Time PD > 12.0% or multiple recent 60+ DPD delinquencies."
          subtext="Exposure: ₹24.58 Cr"
          iconBgColor="bg-rose-500/20"
          iconTextColor="text-rose-400"
        />

        <KpiCard
          id="kpi-total-rwa"
          title="Total RWA"
          value={formatINR(summary.totalRwa, true)}
          changeText="↑ 6.2% asset growth"
          isPositiveChange={true}
          icon={Landmark}
          tooltipText="Risk-Weighted Assets under Basel III Standardised Approach (Credit + Operational)."
          subtext="Density: 74.2% of exposure"
          iconBgColor="bg-purple-500/20"
          iconTextColor="text-purple-400"
        />

        <KpiCard
          id="kpi-capital-req"
          title="Capital Requirement"
          value={formatINR(summary.capitalRequirement, true)}
          changeText="CRAR: 14.85% (Safe)"
          isPositiveChange={true}
          isChangeGood={true}
          icon={Scale}
          tooltipText="Statutory capital needed (10.5% Basel III requirement including 2.5% CCB buffer)."
          subtext="Surplus Buffer: +₹7.94 Cr"
          iconBgColor="bg-amber-500/20"
          iconTextColor="text-amber-400"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Category Distribution Donut */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-400" />
                <span>Portfolio Risk Distribution</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">By Account Count</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDist}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {riskDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: number) => [`${formatNumber(val)} loans`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            {riskDist.map((item, idx) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx] }}></span>
                  <span className="font-semibold text-slate-300">{item.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{formatPercent(item.percentage, 1)}</span>
                  <span className="font-bold text-white">{formatINR(item.exposure, true)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Decisions Distribution */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Loan Decisions Breakdown</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">14,820 Underwritings</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={decisionChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} width={90} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: number) => [`${formatNumber(val)} applications (${(val/14820*100).toFixed(1)}%)`, 'Count']} 
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {decisionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-[11px] font-bold text-emerald-400">APPROVED</div>
              <div className="text-sm font-extrabold text-emerald-300 mt-0.5">73.0%</div>
              <div className="text-[10px] text-emerald-400/80">10,818 loans</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="text-[11px] font-bold text-amber-400">REVIEW</div>
              <div className="text-sm font-extrabold text-amber-300 mt-0.5">14.0%</div>
              <div className="text-[10px] text-amber-400/80">2,074 loans</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <div className="text-[11px] font-bold text-rose-400">REJECTED</div>
              <div className="text-sm font-extrabold text-rose-300 mt-0.5">13.0%</div>
              <div className="text-[10px] text-rose-400/80">1,928 loans</div>
            </div>
          </div>
        </div>

        {/* Exposure vs Expected Credit Loss */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Exposure vs ECL (₹ Cr)</h3>
              <span className="text-[11px] font-medium text-slate-400">By Risk Tier</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exposureVsEclData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: number, name: string) => [`₹${val.toFixed(2)} Cr`, name === 'exposureCr' ? 'Exposure' : 'ECL']} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="exposureCr" name="Exposure (Cr)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="eclCr" name="ECL (Cr)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-lg text-xs text-slate-300 border border-slate-800 mt-2">
            <span className="font-semibold text-white">Key Insight:</span> High-risk tier constitutes only 10.0% of exposure (₹24.5 Cr) but generates 44.0% of total ECL (₹3.0 Cr).
          </div>
        </div>
      </div>

      {/* Recent Evaluated Loans Table with Quick Navigate */}
      <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Customer Risk Evaluations</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any record to inspect individual risk profile, SHAP drivers, and decision rules.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('multiple')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All 14,820 Loans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-y border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Loan ID / Customer</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Credit Score</th>
                <th className="py-2.5 px-3">PD</th>
                <th className="py-2.5 px-3">LGD</th>
                <th className="py-2.5 px-3">ECL</th>
                <th className="py-2.5 px-3">Decision</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {recentLoans.slice(0, 5).map((l) => (
                <tr key={l.loanId} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{l.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{l.loanId} • {l.customerId}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">{l.loanType}</td>
                  <td className="py-3 px-3 font-semibold text-white">{formatINR(l.loanAmount)}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-white">{l.creditScore}</span>
                    <span className="text-[10px] text-slate-500 block">/ 900</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">{formatPercent(l.pd)}</td>
                  <td className="py-3 px-3 text-slate-300">{formatPercent(l.lgd)}</td>
                  <td className="py-3 px-3 font-bold text-white">{formatINR(l.ecl)}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                      l.decision === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                      l.decision === 'REJECTED' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {l.decision}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigate('individual', l)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 text-xs font-semibold transition-colors border border-slate-700 hover:border-blue-500"
                    >
                      Inspect Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
