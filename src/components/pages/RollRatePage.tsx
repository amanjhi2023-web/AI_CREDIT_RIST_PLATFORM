import React from 'react';
import { RollRateMatrix } from '../../types';
import { formatPercent, formatINR } from '../../utils/formatting';
import { 
  GitCommit, 
  ArrowRight, 
  RefreshCw, 
  AlertOctagon, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Info,
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
  Cell 
} from 'recharts';

interface RollRatePageProps {
  rollRateData: RollRateMatrix;
}

export const RollRatePage: React.FC<RollRatePageProps> = ({ rollRateData }) => {
  const transitionBars = [
    { name: 'Current → 30 DPD (Entry)', rate: 4.8, fill: '#f59e0b' },
    { name: '30 DPD → 60 DPD (Deterioration)', rate: 28.5, fill: '#f97316' },
    { name: '60 DPD → 90+ DPD (Default)', rate: 61.2, fill: '#ef4444' },
    { name: '30 DPD → Current (Cure)', rate: 42.5, fill: '#10b981' },
    { name: '60 DPD → Current (Cure)', rate: 15.0, fill: '#14b8a6' },
  ];

  const getMatrixCellClass = (row: string, col: string, val: number) => {
    if (row === col) return 'bg-blue-950/80 text-blue-300 font-bold border border-blue-800/60';
    if (col === 'Current' && val > 0) return 'bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-800/60'; // Cure rate!
    if (col === '90+ DPD' && val > 0) return 'bg-rose-950/80 text-rose-300 font-bold border border-rose-800/60'; // Default roll
    if (val > 0.2) return 'bg-amber-950/80 text-amber-300 font-semibold border border-amber-800/60';
    return 'bg-slate-900/40 text-slate-300';
  };

  return (
    <div id="roll-rate-page" className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#111C35] p-5 rounded-xl border border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-blue-400" />
            <span>Roll-Rate & Delinquency Migration Analysis</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track transition probabilities between delinquency buckets (Current, 30 DPD, 60 DPD, 90+ DPD) and cure rates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
          <RefreshCw className="w-4 h-4" />
          <span>30 DPD Cure Rate: 42.5% (High Recovery Efficiency)</span>
        </div>
      </div>

      {/* Interactive Bucket Transition Visual Flow */}
      <div className="bg-[#111C35] text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Delinquency Bucket Migration Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Current */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase">Stage 1: Current</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold mt-2">94.2%</div>
              <p className="text-[11px] text-slate-400 mt-1">Accounts with zero past due balances</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
              <span className="text-rose-400 font-bold">4.8%</span> rolls to 30 DPD
            </div>
          </div>

          {/* 30 DPD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase">Stage 2: 30 DPD</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">SMA-0</span>
              </div>
              <div className="text-2xl font-bold mt-2">3.1%</div>
              <p className="text-[11px] text-slate-400 mt-1">1 to 30 Days Past Due</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] space-y-1">
              <div className="text-emerald-400 font-semibold">42.5% Cures to Current</div>
              <div className="text-rose-400 font-semibold">28.5% Rolls to 60 DPD</div>
            </div>
          </div>

          {/* 60 DPD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase">Stage 2: 60 DPD</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded border border-orange-500/30">SMA-1</span>
              </div>
              <div className="text-2xl font-bold mt-2">1.5%</div>
              <p className="text-[11px] text-slate-400 mt-1">31 to 60 Days Past Due</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] space-y-1">
              <div className="text-emerald-400 font-semibold">15.0% Cures to Current</div>
              <div className="text-rose-400 font-bold">61.2% Rolls to 90+ DPD</div>
            </div>
          </div>

          {/* 90+ DPD (Default) */}
          <div className="bg-slate-900/90 border border-rose-500/40 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase">Stage 3: 90+ DPD (NPA)</span>
                <AlertOctagon className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-rose-400 mt-2">1.2%</div>
              <p className="text-[11px] text-slate-400 mt-1">Impaired / Gross NPA Default</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
              <span className="text-rose-400 font-bold">92.0%</span> Absorbs to Write-Off / Recovery
            </div>
          </div>
        </div>
      </div>

      {/* Transition Probability Matrix Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#111C35] rounded-xl border border-slate-800 shadow-xs overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Roll Rate Transition Probability Matrix</h3>
            <p className="text-xs text-slate-400">Row: Initial Status (Month $T$) | Column: Transitioned Status (Month $T+1$)</p>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-center text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-300 font-bold border-b border-slate-800 uppercase font-sans text-[11px]">
                <tr>
                  <th className="py-3 px-3 text-left">Initial Bucket (T)</th>
                  {rollRateData.buckets.map(b => (
                    <th key={b} className="py-3 px-3">To {b}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {rollRateData.buckets.map(fromBucket => (
                  <tr key={fromBucket} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-left font-bold text-white font-sans">
                      {fromBucket}
                    </td>
                    {rollRateData.buckets.map(toBucket => {
                      const prob = rollRateData.transitions[fromBucket]?.[toBucket] ?? 0;
                      return (
                        <td key={toBucket} className={`py-3 px-3 rounded ${getMatrixCellClass(fromBucket, toBucket, prob)}`}>
                          {formatPercent(prob)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transition Summary Bar */}
        <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Key Roll & Cure Rates (%)</h3>
            <p className="text-xs text-slate-400 mb-3">Critical operational risk indicators</p>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transitionBars} layout="vertical" margin={{ left: 10, right: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" unit="%" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#cbd5e1' }} width={120} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: number) => [`${val}%`, 'Transition Rate']} 
                  />
                  <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                    {transitionBars.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-slate-200">ECL Provisioning Impact:</span> When 60 DPD roll rate increases by +5%, IFRS 9 Stage 2 lifetime provision increases by ~₹1.15 Cr.
          </div>
        </div>
      </div>
    </div>
  );
};
