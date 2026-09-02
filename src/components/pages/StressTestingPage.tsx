import React, { useState } from 'react';
import { StressScenario } from '../../types';
import { formatINR, formatPercent } from '../../utils/formatting';
import { 
  Activity, 
  ShieldAlert, 
  Scale, 
  TrendingDown, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Info,
  ShieldCheck,
  Zap
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
  Cell 
} from 'recharts';

interface StressTestingPageProps {
  scenarios: StressScenario[];
}

export const StressTestingPage: React.FC<StressTestingPageProps> = ({ scenarios }) => {
  const [activeScenarioId, setActiveScenarioId] = useState('severe_crisis');

  // Custom Macro Sliders for dynamic custom scenario
  const [customGdp, setCustomGdp] = useState(-3.0);
  const [customRateHike, setCustomRateHike] = useState(250);
  const [customUnemp, setCustomUnemp] = useState(4.0);
  const [customCollateral, setCustomCollateral] = useState(-20);

  const selectedScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  // Dynamic calculation for Custom Scenario
  const baseEcl = 6.82; // Cr
  const basePd = 5.40; // %
  const baseCrar = 14.85; // %
  const baseNpa = 2.45; // %

  const customStressedPd = basePd + Math.abs(customGdp) * 0.8 + (customRateHike / 100) * 0.6 + customUnemp * 0.5;
  const customStressedEcl = baseEcl * (1 + (customStressedPd - basePd) / basePd * 1.4) * (1 + Math.abs(customCollateral) / 100 * 0.5);
  const customEclDelta = (customStressedEcl - baseEcl) * 10000000;
  const customStressedCrar = Math.max(7.2, baseCrar - (customEclDelta / 1824000000 * 100) - (customStressedPd - basePd) * 0.2);
  const customStressedNpa = baseNpa + (customStressedPd - basePd) * 0.45;

  // Chart data comparing scenarios
  const scenarioChartData = scenarios.map(s => ({
    name: s.name.split('(')[0].trim(),
    crar: parseFloat((s.stressedCrar * 100).toFixed(1)),
    eclCr: s.stressedEcl / 10000000,
    pdPct: parseFloat((s.stressedPd * 100).toFixed(1)),
    npaPct: parseFloat((s.stressedNpa * 100).toFixed(1)),
  }));

  return (
    <div id="stress-testing-page" className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#111C35] p-5 rounded-xl border border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-400" />
            <span>Macroeconomic Stress Testing & Reverse Solvency</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate adverse macroeconomic shocks on portfolio PD, expected credit losses, and Basel III capital buffers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800/80">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Solvency Breached Only in Crisis (GDP -4.5%, Rates +350bps)</span>
        </div>
      </div>

      {/* Scenario Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {scenarios.map(sc => {
          const isSelected = sc.id === activeScenarioId;
          return (
            <div
              key={sc.id}
              onClick={() => setActiveScenarioId(sc.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-950/70 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                  : 'bg-[#111C35] text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-300' : 'text-slate-400'}`}>
                  Scenario
                </span>
                {sc.stressedCrar >= 0.105 ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </div>

              <div className="font-bold text-sm truncate text-white">{sc.name}</div>

              <div className="mt-3 pt-2 border-t border-slate-700/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stressed ECL:</span>
                  <span className="font-bold text-white">{formatINR(sc.stressedEcl, true)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CRAR:</span>
                  <span className={`font-bold ${sc.stressedCrar >= 0.105 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatPercent(sc.stressedCrar)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Scenario Detail Card */}
      <div className="bg-[#111C35] rounded-xl p-6 border border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-950/80 text-rose-300 border border-rose-800/80">
                Active Stress Shock
              </span>
              <span className="text-xs text-slate-400">Horizon: 12-Month Forward Shock</span>
            </div>
            <h3 className="text-lg font-bold text-white">{selectedScenario.name}</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">{selectedScenario.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Capital Buffer Status</div>
              <div className={`text-base font-extrabold ${selectedScenario.capitalShortfallOrSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedScenario.capitalShortfallOrSurplus >= 0 ? `+${formatINR(selectedScenario.capitalShortfallOrSurplus, true)} Surplus` : `-${formatINR(Math.abs(selectedScenario.capitalShortfallOrSurplus), true)} Shortfall`}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stressed Outcome Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Stressed Avg PD</div>
            <div className="text-xl font-bold text-white mt-1">{formatPercent(selectedScenario.stressedPd)}</div>
            <div className="text-[10px] text-rose-400 font-semibold mt-0.5">
              +{((selectedScenario.stressedPd - 0.054) * 100).toFixed(2)}% vs baseline
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Stressed ECL Loss</div>
            <div className="text-xl font-bold text-white mt-1">{formatINR(selectedScenario.stressedEcl, true)}</div>
            <div className="text-[10px] text-rose-400 font-semibold mt-0.5">
              +{formatINR(selectedScenario.eclDelta, true)} additional provisioning
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Stressed CRAR</div>
            <div className={`text-xl font-bold mt-1 ${selectedScenario.stressedCrar >= 0.105 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatPercent(selectedScenario.stressedCrar)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Regulatory Floor: 10.50%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Stressed Gross NPA</div>
            <div className="text-xl font-bold text-white mt-1">{formatPercent(selectedScenario.stressedNpa)}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Baseline: 2.45%
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart across Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CRAR across Scenarios */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Capital Adequacy (CRAR %) across Scenarios</h3>
              <p className="text-[11px] text-slate-400">Dotted line indicates statutory 10.5% Basel III floor</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarioChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 18]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number) => [`${val}%`, 'CRAR']} 
                />
                <Bar dataKey="crar" radius={[4, 4, 0, 0]}>
                  {scenarioChartData.map((entry, index) => (
                    <Cell key={`cell-crar-${index}`} fill={entry.crar >= 10.5 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ECL Provisions across Scenarios */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Stressed Expected Credit Losses (₹ Cr)</h3>
              <p className="text-[11px] text-slate-400">P&L impairment impact under adverse conditions</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarioChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis unit=" Cr" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number) => [`₹${val.toFixed(2)} Cr`, 'Stressed ECL']} 
                />
                <Bar dataKey="eclCr" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Custom Macro Shock Simulator */}
      <div className="bg-[#111C35] border border-slate-800 text-white rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              <h3 className="text-base font-bold text-white">Custom Macro Shock Simulator</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Customize real GDP shocks, interest rate surges, unemployment, and property haircuts.</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Simulated CRAR</div>
              <div className={`text-xl font-bold ${customStressedCrar >= 10.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {customStressedCrar.toFixed(2)}%
              </div>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Simulated ECL</div>
              <div className="text-xl font-bold text-white">
                ₹{customStressedEcl.toFixed(2)} Cr
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* GDP Shock */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">GDP Contraction:</span>
              <span className="font-mono text-rose-300">{customGdp}%</span>
            </div>
            <input
              type="range"
              min="-8.0"
              max="2.0"
              step="0.5"
              value={customGdp}
              onChange={(e) => setCustomGdp(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Rate Hike */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Policy Rate Hike:</span>
              <span className="font-mono text-rose-300">+{customRateHike} bps</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="25"
              value={customRateHike}
              onChange={(e) => setCustomRateHike(parseInt(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Unemployment Increase */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Unemployment Spike:</span>
              <span className="font-mono text-rose-300">+{customUnemp}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={customUnemp}
              onChange={(e) => setCustomUnemp(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Collateral Devaluation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Collateral Haircut:</span>
              <span className="font-mono text-rose-300">{customCollateral}%</span>
            </div>
            <input
              type="range"
              min="-40"
              max="0"
              step="5"
              value={customCollateral}
              onChange={(e) => setCustomCollateral(parseInt(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
