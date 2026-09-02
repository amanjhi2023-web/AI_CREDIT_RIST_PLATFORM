import React, { useState } from 'react';
import { VintageCohort } from '../../types';
import { formatPercent, formatINR, formatNumber } from '../../utils/formatting';
import { 
  TrendingUp, 
  Calendar, 
  Layers, 
  Filter, 
  Info, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';

interface VintagePageProps {
  vintageCohorts: VintageCohort[];
}

export const VintagePage: React.FC<VintagePageProps> = ({ vintageCohorts }) => {
  const [selectedProduct, setSelectedProduct] = useState('All');

  const lineColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b', '#ef4444'];
  const mobSteps = [3, 6, 9, 12, 18, 24, 30, 36];

  // Transform cohort data for multi-line MOB chart
  const lineChartData = mobSteps.map(mob => {
    const row: any = { mob: `MOB ${mob}` };
    vintageCohorts.forEach(cohort => {
      if (cohort.mobDefaultRates[mob] !== undefined) {
        row[cohort.cohort] = parseFloat((cohort.mobDefaultRates[mob] * 100).toFixed(2));
      }
    });
    return row;
  });

  // Cell heatmap background color helper
  const getCellColor = (rate: number | undefined) => {
    if (rate === undefined) return 'bg-slate-900/40 text-slate-600';
    const val = rate * 100;
    if (val < 1.0) return 'bg-emerald-950/60 text-emerald-300 font-medium';
    if (val < 2.0) return 'bg-emerald-900/60 text-emerald-200 font-semibold';
    if (val < 3.0) return 'bg-amber-950/70 text-amber-300 font-bold';
    if (val < 4.0) return 'bg-orange-950/80 text-orange-300 font-bold';
    return 'bg-rose-950/90 text-rose-300 font-extrabold';
  };

  return (
    <div id="vintage-analysis-page" className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#111C35] p-5 rounded-xl border border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>Vintage Analysis (Cohort Default Curves)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate origination quality over Months on Books (MOB) to detect seasoning and credit degradation early.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Filter Segment:</span>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Portfolio Segments</option>
            <option value="Home">Home Loans</option>
            <option value="Personal">Personal Loans</option>
            <option value="Auto">Auto Loans</option>
            <option value="MSME">MSME Loans</option>
          </select>
        </div>
      </div>

      {/* Cumulative Default Rate (MOB) Multi-Line Chart */}
      <div className="bg-[#111C35] rounded-xl p-5 border border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Cumulative Default Rate Curves (%) by Origination Vintage</h3>
            <p className="text-xs text-slate-400">Flattening slope at 18-24 MOB indicates vintage stabilization</p>
          </div>
          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/80">
            2025-Q1 & Q2 Underwriting Quality Superior (Lower Curves)
          </span>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="mob" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis unit="%" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                formatter={(val: number) => [`${val}%`, 'Default Rate']} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#cbd5e1' }} />
              {vintageCohorts.map((c, i) => (
                <Line
                  key={c.cohort}
                  type="monotone"
                  dataKey={c.cohort}
                  name={`Cohort ${c.cohort}`}
                  stroke={lineColors[i % lineColors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="bg-[#111C35] rounded-xl border border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Vintage Delinquency Transition Matrix</h3>
            <p className="text-xs text-slate-400">Cumulative default percentage at each seasoning milestone</p>
          </div>
          
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Color Intensity:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[10px] font-bold">&lt; 1.5% Low</span>
            <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80 text-[10px] font-bold">1.5 - 3.0% Mod</span>
            <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/80 text-[10px] font-bold">&gt; 3.0% Elevated</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead className="bg-slate-900/90 text-slate-300 font-bold border-b border-slate-800 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-3 text-left">Vintage Cohort</th>
                <th className="py-3 px-3">Origination Exposure</th>
                <th className="py-3 px-3">Loans Count</th>
                {mobSteps.map(mob => (
                  <th key={mob} className="py-3 px-3">MOB {mob}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {vintageCohorts.map(cohort => (
                <tr key={cohort.cohort} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-left font-bold text-white font-sans flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Cohort {cohort.cohort}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-200">{formatINR(cohort.originationAmount, true)}</td>
                  <td className="py-3 px-3 text-slate-400">{formatNumber(cohort.totalLoans)}</td>
                  {mobSteps.map(mob => {
                    const rate = cohort.mobDefaultRates[mob];
                    return (
                      <td key={mob} className={`py-3 px-3 ${getCellColor(rate)}`}>
                        {rate !== undefined ? formatPercent(rate) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
