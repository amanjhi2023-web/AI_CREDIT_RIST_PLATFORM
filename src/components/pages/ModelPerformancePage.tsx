import React, { useState } from 'react';
import { MODEL_PERFORMANCE_DATA } from '../../data/mockData';
import { 
  FlaskConical, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  BarChart2, 
  Activity, 
  Info,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar, 
  Legend, 
  ReferenceLine 
} from 'recharts';

export const ModelPerformancePage: React.FC = () => {
  const [activeCohort, setActiveCohort] = useState<'In-Sample' | 'Out-of-Sample' | 'Out-of-Time'>('Out-of-Time');

  const selectedMetrics = 
    activeCohort === 'In-Sample' ? MODEL_PERFORMANCE_DATA.inSample :
    activeCohort === 'Out-of-Sample' ? MODEL_PERFORMANCE_DATA.outOfSample :
    MODEL_PERFORMANCE_DATA.outOfTime;

  return (
    <div id="model-performance-page" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
              Model Governance & Regulatory Validation
            </span>
            <span className="text-xs text-slate-400 font-mono">Algorithm: Logistic Regression + WOE (v3.1)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-amber-600" />
            <span>Model Performance & Statistical Validation</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Discriminatory power, calibration reliability, population stability, and validation diagnostics across In-Sample, Out-of-Sample, and Out-of-Time development cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {(['In-Sample', 'Out-of-Sample', 'Out-of-Time'] as const).map((cohort) => (
            <button
              key={cohort}
              type="button"
              onClick={() => setActiveCohort(cohort)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCohort === cohort ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              {cohort}
            </button>
          ))}
        </div>
      </div>

      {/* Top 6 KPI Performance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. AUC-ROC */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">AUC-ROC Power</div>
          <div className="text-xl font-extrabold text-blue-600 mt-1">{selectedMetrics.auc.toFixed(3)}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Benchmark &gt; 0.75 (Strong)</div>
        </div>

        {/* 2. Gini Coefficient */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Gini (2*AUC - 1)</div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">{selectedMetrics.gini.toFixed(3)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Strong Separation</div>
        </div>

        {/* 3. KS Statistic */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">KS Statistic</div>
          <div className="text-xl font-extrabold text-purple-600 mt-1">{selectedMetrics.ks.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Max at Decile {MODEL_PERFORMANCE_DATA.ksDecile}</div>
        </div>

        {/* 4. Population Stability (PSI) */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">PSI (Stability)</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{MODEL_PERFORMANCE_DATA.psi.toFixed(3)}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Green (&lt; 0.10)</div>
        </div>

        {/* 5. Brier Score */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Brier Score</div>
          <div className="text-xl font-extrabold text-cyan-600 mt-1">{selectedMetrics.brier.toFixed(3)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">High Calibration</div>
        </div>

        {/* 6. Cohort Records */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Cohort Size</div>
          <div className="text-xl font-extrabold text-slate-800 mt-1">{selectedMetrics.records.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{activeCohort}</div>
        </div>
      </div>

      {/* Primary Validation Charts: ROC Curve & KS Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROC Curve */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Receiver Operating Characteristic (ROC Curve)
              </h2>
              <p className="text-xs text-slate-500">True Positive Rate vs. False Positive Rate (AUC = {MODEL_PERFORMANCE_DATA.aucRoc.toFixed(3)})</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              AUC {MODEL_PERFORMANCE_DATA.aucRoc.toFixed(3)}
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MODEL_PERFORMANCE_DATA.rocCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="fpr" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} label={{ value: 'True Positive Rate (Sensitivity)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${(v * 100).toFixed(1)}%`]} />
                <Line type="monotone" dataKey="tpr" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} name="Scorecard Model" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KS Separation Curve */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Kolmogorov-Smirnov (KS) Cumulative Separation
              </h2>
              <p className="text-xs text-slate-500">Cumulative Goods vs. Cumulative Bads (KS = {MODEL_PERFORMANCE_DATA.ksStatistic.toFixed(1)}%)</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
              Max KS {MODEL_PERFORMANCE_DATA.ksStatistic.toFixed(1)}%
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MODEL_PERFORMANCE_DATA.ksCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="decile" tick={{ fontSize: 10 }} tickFormatter={(v) => `Decile ${v}`} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip formatter={(v: number) => [`${(v * 100).toFixed(1)}%`]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="cumBadPct" stroke="#dc2626" strokeWidth={2} name="Cum Bads %" />
                <Line type="monotone" dataKey="cumGoodPct" stroke="#16a34a" strokeWidth={2} name="Cum Goods %" />
                <Line type="monotone" dataKey="ksDiff" stroke="#9333ea" strokeWidth={2} strokeDasharray="4 4" name="KS Difference" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Calibration & Decile Accuracy Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Hosmer-Lemeshow Calibration & Decile Monotonicity
            </h2>
            <p className="text-xs text-slate-500">Predicted PD vs. Actual Observed 12M Default Rate by Risk Decile (D1 = Highest Risk, D10 = Lowest Risk)</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Strictly Monotonic
          </span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={MODEL_PERFORMANCE_DATA.calibrationPlot}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="decile" tick={{ fontSize: 11 }} tickFormatter={(v) => `D${v}`} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
              <Tooltip formatter={(v: number) => [`${(v * 100).toFixed(2)}%`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="predictedPd" fill="#3b82f6" name="Mean Predicted PD" radius={[4, 4, 0, 0]} />
              <Bar dataKey="observedDefaultRate" fill="#f59e0b" name="Observed Default Rate" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score Distribution & Bad Rate Monotonicity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Score Distribution & Bad Rate Monotonicity
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Monitoring scorecard score bins and empirical default probabilities.</p>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Score Interval</th>
                <th className="px-4 py-3">Good Accounts</th>
                <th className="px-4 py-3">Defaulted Accounts</th>
                <th className="px-4 py-3">Total Accounts</th>
                <th className="px-4 py-3 text-right">Empirical Bad Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MODEL_PERFORMANCE_DATA.scoreDistribution.map((row) => (
                <tr key={row.scoreBin} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-bold text-slate-900">{row.scoreBin}</td>
                  <td className="px-4 py-3 font-mono text-emerald-600 font-medium">{row.goodCount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-mono text-rose-600 font-medium">{row.badCount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{(row.goodCount + row.badCount).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-blue-600">
                    {(row.badRate * 100).toFixed(2)}%
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
