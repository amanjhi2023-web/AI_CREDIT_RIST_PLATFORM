import React, { useState } from 'react';
import { 
  EDA_VARIABLE_SUMMARIES, 
  APC_DATA 
} from '../../data/mockData';
import { 
  BarChart3, 
  Layers, 
  Clock, 
  Calendar, 
  Sparkles 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';

export const EdaApcPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apc' | 'eda'>('apc');

  // Correlation matrix
  const correlationVariables = ['Credit Score', 'DTI Ratio', 'Current LTV', 'MOB', 'Excess Payment', 'Defaulted'];
  const correlationMatrix: Record<string, Record<string, number>> = {
    'Credit Score': { 'Credit Score': 1.0, 'DTI Ratio': -0.38, 'Current LTV': -0.42, 'MOB': 0.15, 'Excess Payment': 0.45, 'Defaulted': -0.62 },
    'DTI Ratio': { 'Credit Score': -0.38, 'DTI Ratio': 1.0, 'Current LTV': 0.35, 'MOB': -0.05, 'Excess Payment': -0.28, 'Defaulted': 0.48 },
    'Current LTV': { 'Credit Score': -0.42, 'DTI Ratio': 0.35, 'Current LTV': 1.0, 'MOB': -0.25, 'Excess Payment': -0.32, 'Defaulted': 0.54 },
    'MOB': { 'Credit Score': 0.15, 'DTI Ratio': -0.05, 'Current LTV': -0.25, 'MOB': 1.0, 'Excess Payment': 0.22, 'Defaulted': -0.18 },
    'Excess Payment': { 'Credit Score': 0.45, 'DTI Ratio': -0.28, 'Current LTV': -0.32, 'MOB': 0.22, 'Excess Payment': 1.0, 'Defaulted': -0.41 },
    'Defaulted': { 'Credit Score': -0.62, 'DTI Ratio': 0.48, 'Current LTV': 0.54, 'MOB': -0.18, 'Excess Payment': -0.41, 'Defaulted': 1.0 },
  };

  return (
    <div id="eda-apc-page" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase tracking-wide">
              Statistical Intelligence & Panel Decomposition
            </span>
            <span className="text-xs text-slate-400 font-mono">14,850 Panel Observations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-600" />
            <span>Exploratory Data Analysis (EDA) & APC Decomposition</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            In-depth statistical distribution analysis and econometric <strong>Age-Period-Cohort (APC)</strong> decomposition separating loan seasoning (MOB), macroeconomic calendar shocks, and origination vintage quality.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('apc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'apc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Age-Period-Cohort (APC)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('eda')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'eda' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Descriptive Stats & Correlation
          </button>
        </div>
      </div>

      {activeTab === 'apc' ? (
        /* DEDICATED APC ANALYSIS MODULE */
        <div className="space-y-8 animate-in fade-in">
          {/* APC Overview Banner */}
          <div className="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-cyan-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-cyan-900">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>APC Econometric Identification Strategy:</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">
              Credit default rates in longitudinal mortgage portfolios are confounded by three collinear time dimensions: <strong>Age Effect (Seasoning / MOB)</strong>, <strong>Period Effect (Calendar Macro Shocks)</strong>, and <strong>Cohort Effect (Origination Vintage Quality)</strong>. Our model isolates each effect independently:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-cyan-200">
                <span className="font-bold text-slate-900 block">1. Age Effect (MOB / MOB²)</span>
                <span className="text-[11px] text-slate-500">Non-linear hump-shaped hazard curve peaking at 18–24 months.</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-cyan-200">
                <span className="font-bold text-slate-900 block">2. Period Effect (Calendar Macro)</span>
                <span className="text-[11px] text-slate-500">Exogenous shocks from GDP cycles, inflation & RBI repo rate hikes.</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-cyan-200">
                <span className="font-bold text-slate-900 block">3. Cohort Effect (Vintage Quality)</span>
                <span className="text-[11px] text-slate-500">Underwriting stringency and initial LTV/DTI distribution at origination.</span>
              </div>
            </div>
          </div>

          {/* 3 APC Decomposition Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Age Effect (MOB Seasoning Curve) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">1. Age Effect (MOB Curve)</span>
                  <span className="text-[10px] text-slate-400">Hazard by Loan Age</span>
                </div>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={APC_DATA.ageAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="mobBracket" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
                    <Tooltip formatter={(v: number) => [`${(v * 100).toFixed(2)}%`, 'Default Rate']} />
                    <Area type="monotone" dataKey="defaultRate" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-600">
                Default hazard peaks at MOB 19–24 (3.8%) as seasoning peaks before amortization and borrower equity reduce residual default pressure.
              </p>
            </div>

            {/* 2. Period Effect (Macroeconomic Shocks) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">2. Period Effect (Calendar Macro)</span>
                  <span className="text-[10px] text-slate-400">Quarterly Macro State</span>
                </div>
                <Calendar className="w-4 h-4 text-cyan-600" />
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={APC_DATA.periodAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="periodYear" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
                    <Tooltip formatter={(v: number) => [`${(v * 100).toFixed(2)}%`]} />
                    <Line type="monotone" dataKey="defaultRate" stroke="#0891b2" strokeWidth={2} dot={{ r: 3 }} name="Default Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-600">
                Rate hike cycle through 2022-2023 caused period default rate to elevate before monetary easing stabilized default frequencies.
              </p>
            </div>

            {/* 3. Cohort Effect (Vintage Quality) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">3. Cohort Effect (Vintage)</span>
                  <span className="text-[10px] text-slate-400">Underwriting Cohorts</span>
                </div>
                <Layers className="w-4 h-4 text-purple-600" />
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={APC_DATA.cohortAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="cohortVintage" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
                    <Tooltip formatter={(v: number) => [`${(v * 100).toFixed(2)}%`, 'Cum. Default']} />
                    <Bar dataKey="defaultRateCumulative" fill="#9333ea" radius={[4, 4, 0, 0]} name="Cumulative Default Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-600">
                2022 origination cohorts exhibit slightly higher baseline risk due to rapid portfolio expansion before underwriting risk limits were tightened.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* DEDICATED EDA & DESCRIPTIVE STATISTICS MODULE */
        <div className="space-y-8 animate-in fade-in">
          {/* Descriptive Statistics Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Descriptive Statistics (Continuous Variables)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Summary parametric statistics for all loan, bureau, and macroeconomic variables.</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">N = 14,850 observations</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Variable</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5">Mean (μ)</th>
                    <th className="px-3 py-2.5">Std Dev (σ)</th>
                    <th className="px-3 py-2.5">Min</th>
                    <th className="px-3 py-2.5">P25 (Q1)</th>
                    <th className="px-3 py-2.5">Median (Q2)</th>
                    <th className="px-3 py-2.5">P75 (Q3)</th>
                    <th className="px-3 py-2.5">Max</th>
                    <th className="px-3 py-2.5 text-right">Missing %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {EDA_VARIABLE_SUMMARIES.map((row) => (
                    <tr key={row.variable} className="hover:bg-slate-50/60">
                      <td className="px-3 py-2.5 font-bold text-slate-900">{row.variable}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-700">{row.mean.toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-600">{row.stdDev.toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-600">{row.min.toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-600">{row.p25.toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-mono font-bold text-blue-700">{row.median.toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-600">{row.p75.toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-600">{row.max.toLocaleString()}</td>
                      <td className="px-3 py-2.5 font-mono text-right text-emerald-600 font-bold">{row.missingPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Correlation Matrix Heatmap */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Pearson Correlation Matrix (Feature Collinearity)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Pairwise correlation coefficients across risk drivers and target default flag.</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">Heatmap Range [-1.00, +1.00]</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
              <table className="w-full text-center">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5 text-left">Variable</th>
                    {correlationVariables.map(c => (
                      <th key={c} className="px-3 py-2.5">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {correlationVariables.map((rowVar) => (
                    <tr key={rowVar}>
                      <td className="px-3 py-2.5 text-left font-bold text-slate-900">{rowVar}</td>
                      {correlationVariables.map((colVar) => {
                        const val = correlationMatrix[rowVar]?.[colVar] ?? 0;
                        const isPositive = val > 0;
                        const absVal = Math.abs(val);
                        let bgClass = 'bg-white';
                        let textClass = 'text-slate-700';

                        if (absVal === 1.0) {
                          bgClass = 'bg-slate-100 font-bold';
                        } else if (isPositive) {
                          if (absVal > 0.4) bgClass = 'bg-rose-100 text-rose-800 font-bold';
                          else if (absVal > 0.2) bgClass = 'bg-rose-50 text-rose-700 font-medium';
                        } else {
                          if (absVal > 0.4) bgClass = 'bg-emerald-100 text-emerald-800 font-bold';
                          else if (absVal > 0.2) bgClass = 'bg-emerald-50 text-emerald-700 font-medium';
                        }

                        return (
                          <td key={colVar} className={`px-3 py-2.5 font-mono text-[11px] ${bgClass} ${textClass}`}>
                            {val > 0 && val !== 1 ? `+${val.toFixed(2)}` : val.toFixed(2)}
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
      )}
    </div>
  );
};
