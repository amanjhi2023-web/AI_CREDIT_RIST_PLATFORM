import React from 'react';
import { PortfolioSummary, RiskDistributionData, LoanApplication } from '../../types';
import { KpiCard } from '../common/KpiCard';
import { formatINR, formatPercent, formatNumber } from '../../utils/formatting';
import { 
  PieChart as PieIcon, 
  BarChart2, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  Coins, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Briefcase,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface PortfolioRiskPageProps {
  summary: PortfolioSummary;
  riskDist: RiskDistributionData[];
  allLoans: LoanApplication[];
}

export const PortfolioRiskPage: React.FC<PortfolioRiskPageProps> = ({
  summary,
  riskDist,
  allLoans,
}) => {
  // Secured vs Unsecured LGD
  const securedLoans = allLoans.filter(l => l.loanType === 'Home Loan' || l.loanType === 'Auto Loan');
  const unsecuredLoans = allLoans.filter(l => l.loanType === 'Personal Loan' || l.loanType === 'Credit Card' || l.loanType === 'MSME Loan');

  const avgSecuredLgd = securedLoans.reduce((acc, l) => acc + l.lgd, 0) / (securedLoans.length || 1);
  const avgUnsecuredLgd = unsecuredLoans.reduce((acc, l) => acc + l.lgd, 0) / (unsecuredLoans.length || 1);

  const lgdComparisonData = [
    { type: 'Secured Portfolio (Home/Auto)', lgd: parseFloat((avgSecuredLgd * 100).toFixed(1)), fill: '#10b981' },
    { type: 'Unsecured Portfolio (Cards/Personal/MSME)', lgd: parseFloat((avgUnsecuredLgd * 100).toFixed(1)), fill: '#ef4444' }
  ];

  // Avg PD across Loan Types
  const loanTypes = ['Home Loan', 'Auto Loan', 'MSME Loan', 'Personal Loan', 'Credit Card'];
  const pdByTypeData = loanTypes.map(t => {
    const subset = allLoans.filter(l => l.loanType === t);
    const avgPd = subset.length ? subset.reduce((acc, l) => acc + l.pd, 0) / subset.length : 0;
    return {
      name: t,
      avgPd: parseFloat((avgPd * 100).toFixed(2))
    };
  });

  // Concentration by Region
  const regionExposure = ['North', 'South', 'West', 'East', 'Central'].map(r => {
    const subset = allLoans.filter(l => l.region === r);
    const exp = subset.reduce((acc, l) => acc + l.loanAmount, 0);
    return {
      name: `${r} Zone`,
      exposureCr: exp / 10000000,
      count: subset.length
    };
  });

  // Top 5 Borrower Concentration
  const sortedTopBorrowers = [...allLoans].sort((a, b) => b.loanAmount - a.loanAmount).slice(0, 5);

  return (
    <div id="portfolio-risk-page" className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#111C35] p-5 rounded-xl border border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-blue-400" />
            <span>Portfolio Risk & Concentration Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Credit risk density, regional limits, structural LGD spreads, and concentration metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-800/80">
          <Scale className="w-4 h-4" />
          <span>Single Obligor Limit: 15% Tier 1 Capital</span>
        </div>
      </div>

      {/* Top Portfolio Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Portfolio Exposure"
          value={formatINR(summary.totalExposure, true)}
          changeText="Active across 5 zones"
          icon={Coins}
          tooltipText="Aggregate credit exposure across all operating verticals."
        />
        <KpiCard
          title="Total Expected Loss (ECL)"
          value={formatINR(summary.totalEcl, true)}
          changeText="Provision coverage: 2.77%"
          icon={AlertTriangle}
          tooltipText="Total IFRS 9 ECL staged provisions."
          isPositiveChange={false}
          isChangeGood={true}
        />
        <KpiCard
          title="Top 10 Obligor Share"
          value="4.85%"
          changeText="Well within 15% limit"
          isPositiveChange={true}
          isChangeGood={true}
          icon={Building2}
          tooltipText="Aggregate credit exposure of the top 10 largest borrowers relative to total Tier 1 capital."
        />
        <KpiCard
          title="Risk Migration (QoQ)"
          value="Net +0.8% Upgrades"
          changeText="Upgrades outpace downgrades"
          isPositiveChange={true}
          isChangeGood={true}
          icon={TrendingUp}
          tooltipText="Quarterly internal credit rating transitions."
        />
      </div>

      {/* Grid: PD by Loan Type & Secured vs Unsecured LGD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PD by Loan Type */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Average PD by Loan Type (%)</h3>
              <p className="text-[11px] text-slate-400">12-Month Point-in-Time default probability</p>
            </div>
            <span className="text-xs font-semibold text-blue-300 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded">Risk Calibrated</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pdByTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number) => [`${val}%`, 'Avg PD']} 
                />
                <Bar dataKey="avgPd" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secured vs Unsecured LGD */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Average LGD: Secured vs Unsecured (%)</h3>
              <p className="text-[11px] text-slate-400">Loss Given Default post collateral liquidation haircut</p>
            </div>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">Collateral Backed</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lgdComparisonData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: '#94a3b8' }} width={140} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number) => [`${val}% LGD`, 'Loss Rate']} 
                />
                <Bar dataKey="lgd" radius={[0, 4, 4, 0]}>
                  {lgdComparisonData.map((entry, index) => (
                    <Cell key={`lgd-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Concentration Risk & Regional Exposure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Exposure Bar */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Geographical Concentration Risk (₹ Cr)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Regional distribution of active loans across zones</p>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionExposure} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number) => [`₹${val.toFixed(2)} Cr`, 'Exposure']} 
                />
                <Bar dataKey="exposureCr" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Single Obligor Concentrations */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white">Top 5 Borrower Exposures</h3>
            <span className="text-[10px] text-slate-400">Prudential Cap Check</span>
          </div>

          <div className="space-y-3">
            {sortedTopBorrowers.map((borrower) => (
              <div key={borrower.loanId} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span className="truncate">{borrower.customerName}</span>
                  <span className="text-blue-400">{formatINR(borrower.loanAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{borrower.loanType} • {borrower.branch}</span>
                  <span className="font-semibold text-emerald-400">PD: {formatPercent(borrower.pd)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
