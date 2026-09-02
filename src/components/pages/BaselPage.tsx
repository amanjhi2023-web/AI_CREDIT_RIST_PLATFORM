import React, { useState } from 'react';
import { BaselSummary } from '../../types';
import { KpiCard } from '../common/KpiCard';
import { formatINR, formatPercent } from '../../utils/formatting';
import { 
  Landmark, 
  Scale, 
  ShieldCheck, 
  PieChart as PieIcon, 
  Sliders, 
  Info, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Building2
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

interface BaselPageProps {
  baselData: BaselSummary;
}

export const BaselPage: React.FC<BaselPageProps> = ({ baselData }) => {
  // Interactive Simulator State
  const [loanGrowthPct, setLoanGrowthPct] = useState(0); // -20% to +30%
  const [riskWeightModifier, setRiskWeightModifier] = useState(0); // -10% to +20%

  // Simulated Basel metrics
  const simulatedRwa = baselData.totalRwa * (1 + loanGrowthPct / 100) * (1 + riskWeightModifier / 100);
  const requiredCapital = simulatedRwa * 0.105;
  const currentTotalCapital = baselData.tier1Capital + baselData.tier2Capital;
  const simulatedCrar = (currentTotalCapital / simulatedRwa) * 100;
  const simulatedBuffer = currentTotalCapital - requiredCapital;

  const rwaTypePieData = [
    { name: 'Credit Risk RWA', value: baselData.creditRiskRwa, color: '#3b82f6' },
    { name: 'Operational Risk RWA', value: baselData.operationalRiskRwa, color: '#f59e0b' },
    { name: 'Market Risk RWA', value: baselData.marketRiskRwa, color: '#8b5cf6' },
  ];

  const creditBreakdownData = [
    { category: 'Home Loans (35% RW)', rwaCr: 42.5, exposureCr: 121.4 },
    { category: 'Auto Loans (75% RW)', rwaCr: 31.8, exposureCr: 42.4 },
    { category: 'MSME Loans (100% RW)', rwaCr: 48.0, exposureCr: 48.0 },
    { category: 'Personal Loans (100% RW)', rwaCr: 21.3, exposureCr: 21.3 },
    { category: 'Credit Cards (125% RW)', rwaCr: 15.6, exposureCr: 12.5 },
  ];

  return (
    <div id="basel-capital-page" className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#111C35] p-5 rounded-xl border border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-400" />
            <span>Basel III Capital Adequacy & RWA Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pillar 1 Minimum Capital Requirements, RWA density calibration, and CRAR solvency compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CRAR 14.85% vs 10.50% Min Floor (+435 bps Surplus)</span>
        </div>
      </div>

      {/* Top Basel Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total RWA"
          value={formatINR(baselData.totalRwa, true)}
          changeText="Density: 74.2% of exposure"
          icon={Landmark}
          tooltipText="Total Risk-Weighted Assets under Basel III Standardised Approach (Credit + Operational + Market)."
        />
        <KpiCard
          title="Capital Adequacy (CRAR)"
          value={formatPercent(baselData.crar)}
          changeText="+4.35% statutory surplus"
          isPositiveChange={true}
          isChangeGood={true}
          icon={Scale}
          tooltipText="Capital to Risk-Weighted Assets Ratio = (Tier 1 + Tier 2 Capital) / Total RWA."
        />
        <KpiCard
          title="Tier 1 Capital Ratio"
          value={formatPercent(baselData.tier1Ratio)}
          changeText="Regulatory Min: 7.0%"
          isPositiveChange={true}
          isChangeGood={true}
          icon={Building2}
          tooltipText="Common Equity Tier 1 (CET1) and Additional Tier 1 Capital over RWA."
        />
        <KpiCard
          title="Capital Buffer"
          value={formatINR(baselData.capitalBuffer, true)}
          changeText="Surplus over 10.5% buffer"
          isPositiveChange={true}
          isChangeGood={true}
          icon={ShieldCheck}
          tooltipText="Total eligible regulatory capital in excess of the 10.5% Basel III requirement."
        />
      </div>

      {/* Visual Analytics: RWA Split & Credit RWA by Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RWA Composition Donut */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-400" />
                <span>RWA Composition by Risk Type</span>
              </h3>
              <span className="text-xs text-slate-400">Basel III</span>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rwaTypePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {rwaTypePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: number) => [formatINR(val, true), 'RWA']} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
            {rwaTypePieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="font-semibold text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-white">{formatINR(item.value, true)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Risk RWA by Loan Product (Bar Chart) */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Credit Risk RWA & Exposure by Asset Class</h3>
                <p className="text-[11px] text-slate-400">Risk-weighting factors: Mortgages 35%, MSME 100%, Cards 125%</p>
              </div>
              <span className="text-xs font-semibold text-blue-300 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded">Standardised Approach</span>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creditBreakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit=" Cr" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: number) => [`₹${val} Cr`, '']} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: '#cbd5e1' }} />
                  <Bar dataKey="exposureCr" name="Gross Exposure (₹ Cr)" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rwaCr" name="Risk-Weighted Assets (₹ Cr)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-lg text-xs text-slate-300 border border-slate-800 mt-2">
            <span className="font-semibold text-white">Prudential Optimization:</span> Residential mortgages provide the most capital-efficient growth due to 35% Basel risk weighting vs 125% on unsecured revolving credit.
          </div>
        </div>
      </div>

      {/* Interactive Capital Adequacy Simulator */}
      <div className="bg-[#111C35] border border-slate-800 text-white rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h3 className="text-base font-bold text-white">Interactive Basel CRAR & Capital Simulator</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Stress loan portfolio growth or risk weight changes to evaluate pro-forma capital adequacy.</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Simulated CRAR</div>
              <div className={`text-xl font-black ${simulatedCrar >= 10.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {simulatedCrar.toFixed(2)}%
              </div>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Simulated Buffer</div>
              <div className="text-xl font-black text-blue-300">
                {formatINR(simulatedBuffer, true)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Slider 1: Loan Book Growth */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Portfolio Asset Growth / Contraction:</span>
              <span className="font-mono text-blue-300">{loanGrowthPct > 0 ? `+${loanGrowthPct}%` : `${loanGrowthPct}%`}</span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="5"
              value={loanGrowthPct}
              onChange={(e) => setLoanGrowthPct(parseInt(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-20% Deleveraging</span>
              <span>Baseline (0%)</span>
              <span>+40% Rapid Expansion</span>
            </div>
          </div>

          {/* Slider 2: Risk Weight Adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Regulatory Risk Weight Modifier:</span>
              <span className="font-mono text-blue-300">{riskWeightModifier > 0 ? `+${riskWeightModifier}%` : `${riskWeightModifier}%`}</span>
            </div>
            <input
              type="range"
              min="-15"
              max="25"
              step="5"
              value={riskWeightModifier}
              onChange={(e) => setRiskWeightModifier(parseInt(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-15% (IRB Approval)</span>
              <span>Baseline (0%)</span>
              <span>+25% (Prudential Hike)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
